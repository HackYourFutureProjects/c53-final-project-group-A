import connectNeonDB from "../db/connectNeonDB.js";
import bcrypt from "bcrypt";
import { logError } from "../util/logging.js";

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res
      .status(400)
      .json({ success: false, msg: "Missing token or password" });

  const { connectedClient, endConnection } = await connectNeonDB();

  try {
    const result = await connectedClient.query(
      "SELECT userid, reset_token_expires FROM users WHERE reset_token=$1",
      [token],
    );

    if (result.rows.length === 0)
      return res.status(400).json({ success: false, msg: "Invalid token" });

    const { userid, reset_token_expires } = result.rows[0];

    if (new Date() > new Date(reset_token_expires))
      return res.status(400).json({ success: false, msg: "Token expired" });

    const hashed = await bcrypt.hash(newPassword, 12);

    await connectedClient.query(
      "UPDATE users SET password=$1, reset_token=NULL, reset_token_expires=NULL WHERE userid=$2",
      [hashed, userid],
    );

    res.json({ success: true, msg: "Password updated" });
  } catch (err) {
    logError(err);
    res.status(500).json({ success: false, msg: "Server error" });
  } finally {
    await endConnection();
  }
}
