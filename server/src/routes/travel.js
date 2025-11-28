import express from "express";
import calculateBatchTravelTime from "../controllers/travelController.js";

const router = express.Router();

router.post("/batch", calculateBatchTravelTime);

export default router;
