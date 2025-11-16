import express from "express";
import userRouter from "./routes/user.js";
import jobsRouter from "./routes/job.js";

import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
// Create an express server
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Tell express to use the json middleware
app.use(express.json());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */
app.use("/api/users", userRouter);

app.use("/api/jobs", jobsRouter);

export default app;
