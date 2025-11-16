import express from "express";
import userRouter from "./routes/user.js";
import jobsRouter from "./routes/job.js";

import cors from "cors";

// Create an express server
const app = express();
app.use(cors());

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
