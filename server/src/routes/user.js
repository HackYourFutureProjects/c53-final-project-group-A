import express from "express";
import { createUser, loginUser, logoutUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/authVerify.js";

const userRouter = express.Router();

// userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.post("/login", loginUser); // LOGIN
userRouter.post("/logout", verifyToken, logoutUser); // LOGOUT

export default userRouter;
