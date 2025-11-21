import { logError } from "../util/logging.js";
import { realJobSearch } from "./realJobSearch.js";
import { fakeJobSearch } from "./fakeJobSearch.js";

const isSearchReal = false; // Set to true to enable real job search

export const searchJobs = async (req, res) => {
  try {
    const { search_terms } = req.body;
    const aggregatedJobsIdsSet = new Set();
    let aggregatedJobs = [];
    if (!search_terms || !search_terms.trim()) {
      return res.status(400).json({
        success: false,
        msg: "You need to provide 'search_terms' in the request body.",
      });
    }

    const searchWords = search_terms.split(new RegExp("[\\s\\-.'/]+"));

    for (const jobWord of searchWords) {
      const fetchedJobs = isSearchReal
        ? await realJobSearch({ jobWord })
        : fakeJobSearch({ jobWord });
      for (const job of fetchedJobs) {
        if (job.id && !aggregatedJobsIdsSet.has(job.id)) {
          aggregatedJobs.push(job);
          aggregatedJobsIdsSet.add(job.id);
        }
      }
    }

    res.status(200).json({ success: true, result: aggregatedJobs });
  } catch (error) {
    logError("searchJobs error:", error);
    res.status(500).json({
      success: false,
      msg: "Unable to search for jobs, please try again later.",
    });
  }
};
