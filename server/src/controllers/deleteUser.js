import connectNeonDB from "../db/connectNeonDB.js";
import { logError } from "../util/logging.js";

export const deleteUser = async (req, res) => {
  // This API endpoint is secured via `verifyToken` middleware,
  // ensuring the request is authenticated.

  // We strictly enforce "Self-Deletion" by using the user ID extracted
  // from the token payload (req.user.id) as the target ID.
  const targetUserId = req.user.id;

  // --- ID Validation Check ---
  if (!targetUserId) {
    // If the authenticated token somehow lacks a valid ID payload, respond with 401.
    // This suggests an issue with the token payload itself.
    return res.status(401).json({
      success: false,
      message: "Authentication failed: No valid User ID found in token.",
    });
  }

  // Connect to the database
  const { error, connectedClient, endConnection } = await connectNeonDB();
  if (error) {
    logError("DB connection failed: " + error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }

  try {
    // Delete the user record using the ID from the token
    const query = "DELETE FROM users WHERE userid = $1 RETURNING *";
    const result = await connectedClient.query(query, [targetUserId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found (or already deleted)",
      });
    }

    // Successfully deleted
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: result.rows,
    });
  } catch (err) {
    logError("Error deleting user: " + err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    await endConnection();
  }
};
