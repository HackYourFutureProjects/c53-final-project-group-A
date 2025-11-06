import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logError } from "../util/logging.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jobsPath = path.join(__dirname, "../data/NorthHolland.json");
const jobs = JSON.parse(fs.readFileSync(jobsPath, "utf-8"));

export const getJobs = (req, res) => {
  try {
    const searchQuery = req.query.q?.toLowerCase() || "";
    let filteredJobs = jobs;

    if (searchQuery) {
      filteredJobs = jobs.filter((job) => {
        if (typeof job.title === "string") {
          return job.title.toLowerCase().includes(searchQuery);
        }
        return false;
      });
    }

    res.status(200).json({
      success: true,
      result: filteredJobs,
    });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to get jobs, please try again later",
    });
  }
};
