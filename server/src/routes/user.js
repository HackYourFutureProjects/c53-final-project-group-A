import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/authVerify.js";
import { createAuthLimiter } from "../middleware/rateLimiter.js";

const userRouter = express.Router();

// Create a limiter for login/signup
const authLimiter = createAuthLimiter({ max: 5, windowMs: 5 * 60 * 1000 });

userRouter.post("/", authLimiter, createUser);
userRouter.post("/login", authLimiter, loginUser); // LOGIN
userRouter.post("/logout", verifyToken, logoutUser); // LOGOUT
userRouter.get("/me", verifyToken, getMe);
userRouter.put("/profile", verifyToken, updateProfile);

export default userRouter;
