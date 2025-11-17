import express from "express";
import { createUser, loginUser, logoutUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/authVerify.js";
import { createAuthLimiter } from "../middleware/rateLimiter.js";

const userRouter = express.Router();

// Create a limiter for login/signup
const authLimiter = createAuthLimiter({ max: 5, windowMs: 5 * 60 * 1000 });

// userRouter.get("/", getUsers);
userRouter.post("/", authLimiter, createUser);
userRouter.post("/login", authLimiter, loginUser); // LOGIN
userRouter.post("/logout", verifyToken, logoutUser); // LOGOUT

export default userRouter;
