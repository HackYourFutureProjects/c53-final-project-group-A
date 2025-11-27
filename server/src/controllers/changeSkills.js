import connectNeonDB from "../db/connectNeonDB.js";
import { logError } from "../util/logging.js";

export async function changeSkills(req, res) {
  const userId = req.user?.id;
  const { skills } = req.body;

  if (!userId)
    return res
      .status(401)
      .json({ success: false, msg: "User not authenticated" });

  if (
    !skills ||
    !Array.isArray(skills) ||
    (skills.length !== 0 && skills.some((skill) => typeof skill !== "string"))
  )
    return res.status(400).json({
      success: false,
      msg: "Only an array of strings (or empty array) is allowed",
    });

  const { connectedClient, endConnection, error } = await connectNeonDB();
  if (error)
    return res
      .status(503)
      .json({ success: false, msg: "Database connection error" });

  try {
    const result = await connectedClient.query(
      `UPDATE users
      SET skills = $1
      WHERE userid = $2
      RETURNING *`,
      [skills.join(","), userId],
    );

    if (result.rowCount === 0) {
      throw new Error("User not found after update");
    }

    res.status(201).json({
      success: true,
      msg: "Skills are updated",
    });
  } catch (err) {
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Sorry, there's an error with the DB. Unable to update skills",
    });
  } finally {
    if (endConnection) await endConnection();
  }
}
