import express from "express";
import { searchJobs } from "../controllers/jobData.js";

const router = express.Router();

router.post("/search", searchJobs);

export default router;
