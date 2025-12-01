import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jobsPath = path.join(__dirname, "..", "data", "JobsDataset.json");
const jobs = JSON.parse(fs.readFileSync(jobsPath, "utf-8"));

export function fakeJobSearch(jobWord) {
  const searchQuery = jobWord?.toLowerCase();
  let filteredJobs = jobs;

  if (searchQuery) {
    filteredJobs = jobs.filter((job) => {
      if (typeof job.title === "string") {
        return job.title.toLowerCase().includes(searchQuery);
      }
      return false;
    });
  }

  return filteredJobs;
}
