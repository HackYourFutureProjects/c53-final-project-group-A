import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
export const blacklistedTokens = [];

// ========================
// VERIFY TOKEN - Middleware
// ========================
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, msg: "No token provided" });
    } // Check if the token has been revoked/blacklisted

    if (blacklistedTokens.includes(token)) {
      return res
        .status(401)
        .json({ success: false, msg: "Token expired or logged out" });
    } // Verify the token's signature and expiration time

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // Token is valid, continue to the next middleware/handler
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, msg: "Invalid or expired token" });
  }
};
