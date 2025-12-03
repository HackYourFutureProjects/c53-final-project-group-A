import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  updateUserAvatar,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/authVerify.js";
import { createAuthLimiter } from "../middleware/rateLimiter.js";
import { toggleFavoriteJob } from "../controllers/toggleFavoriteJob.js";
import { deleteUser } from "../controllers/deleteUser.js";
import { changePassword } from "../controllers/changePassword.js";
import { changeSkills } from "../controllers/changeSkills.js";
import { forgotPassword } from "../controllers/forgotPassword.js";
import { resetPassword } from "../controllers/resetPassword.js";
import multer from "multer";

const userRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 6 * 1024 * 1024, // 6MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only image files are allowed."));
    }
  },
});

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
userRouter.post("/change-skills", verifyToken, changeSkills);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

userRouter.post(
  "/update-avatar",
  verifyToken,
  upload.single("pic"),
  updateUserAvatar,
);

export default userRouter;
