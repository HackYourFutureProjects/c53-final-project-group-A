import rateLimit from "express-rate-limit";

// Function to create a rate limiter with custom options
export function createAuthLimiter(options = {}) {
  return rateLimit({
    windowMs: options.windowMs || 5 * 60 * 1000, // default 5 minutes
    max: options.max || 5, // default 5 requests per window
    message: options.message || {
      success: false,
      msg: "Too many attempts.  Please try again after 5 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
