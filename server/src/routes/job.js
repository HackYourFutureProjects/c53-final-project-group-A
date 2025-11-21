import express from "express";
import { searchJobs } from "../controllers/jobData.js";
import calculateBatchTravelTime from "../controllers/travelController.js";

const router = express.Router();

router.post("/search", searchJobs);

router.post("/batch", calculateBatchTravelTime);

export default router;
