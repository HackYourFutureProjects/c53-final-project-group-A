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
import { toggleFavoriteJob } from "../controllers/toggleFavoriteJob.js";
import { deleteUser } from "../controllers/deleteUser.js";
import { changePassword } from "../controllers/changePassword.js";
// import { addSkill } from "../controllers/changeSkills.js";

const userRouter = express.Router();

// Create a limiter for login/signup
const authLimiter = createAuthLimiter({ max: 5, windowMs: 5 * 60 * 1000 });

userRouter.post("/", authLimiter, createUser);
userRouter.post("/login", authLimiter, loginUser); // LOGIN
userRouter.post("/logout", verifyToken, logoutUser); // LOGOUT
userRouter.get("/me", verifyToken, getMe);
userRouter.put("/profile", verifyToken, updateProfile);
userRouter.post("/favorites/toggle", verifyToken, toggleFavoriteJob);
userRouter.delete("/delete/:userid", verifyToken, deleteUser);
userRouter.post("/change-password", verifyToken, changePassword);
// userRouter.post("/skills/add", verifyToken, addSkill);

export default userRouter;
