import express from "express";
import userRouter from "./routes/user.js";
import jobsRouter from "./routes/job.js";
import cookieParser from "cookie-parser";

import cors from "cors";

// Create an express server
const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  }),
);

// Tell express to use the json middleware
app.use(express.json());
app.use(cookieParser());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */
app.use("/api/users", userRouter);

app.use("/api/jobs", jobsRouter);

export default app;
