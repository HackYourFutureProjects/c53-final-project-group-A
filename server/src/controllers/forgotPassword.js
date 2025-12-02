import connectNeonDB from "../db/connectNeonDB.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { logError } from "../util/logging.js";

// ansporter Gmail App Password
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.gmail.com
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
});

export async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ success: false, msg: "Email required" });

  const { connectedClient, endConnection, error } = await connectNeonDB();
  if (error)
    return res
      .status(503)
      .json({ success: false, msg: "DB connection failed" });

  try {
    const result = await connectedClient.query(
      "SELECT userid FROM users WHERE email=$1",
      [email],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Email not found" });
    }

    const userId = result.rows[0].userid;

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

    await connectedClient.query(
      "UPDATE users SET reset_token=$1, reset_token_expires=$2 WHERE userid=$3",
      [token, expiresAt, userId],
    );

    const frontendUrl =
      process.env.VITE_FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Job Compass" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset your Job Compass password",
      html: `
        <p>Hello!</p>
        <p>You requested a password reset for Job Compass.</p>
        <p>Click this link to reset your password (valid 10 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    res.json({ success: true, msg: "Reset link sent to email" });
  } catch (err) {
    logError.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  } finally {
    await endConnection();
  }
}
