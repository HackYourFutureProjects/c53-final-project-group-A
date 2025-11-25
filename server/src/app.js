import express from "express";
import userRouter from "./routes/user.js";
import jobsRouter from "./routes/job.js";
import travelRoutes from "./routes/travel.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */
app.use("/api/users", userRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/travel", travelRoutes);

export default app;
