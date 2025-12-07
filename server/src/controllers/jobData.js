import { logError } from "../util/logging.js";
import { realJobSearch } from "./realJobSearch.js";
import { fakeJobSearch } from "./fakeJobSearch.js";
import processJobPost from "../util/processJobPost.js";

const isSearchReal = false; // Set to true to enable real job search

export const searchJobs = async (req, res) => {
  try {
    const { search_terms } = req.body;
    const aggregatedJobsIdsSet = new Set();
    let aggregatedJobs = [];
    if (typeof search_terms !== "string" || !search_terms.trim()) {
      return res.status(400).json({
        success: false,
        msg: "You need to provide 'search_terms' (non-empty string) in the request body.",
      });
    }

    const searchWords = search_terms
      .split(new RegExp("[\\s\\-.'/]+"))
      .filter(Boolean);
    // Fetch results for all search words concurrently
    const fetchPromises = searchWords.map((jobWord, i) =>
      isSearchReal
        ? searchWords.length > 2 && i >= 2
          ? new Promise((resolve) =>
              setTimeout(() => resolve(realJobSearch(jobWord)), (i - 1) * 700),
            )
          : realJobSearch(jobWord)
        : Promise.resolve(fakeJobSearch(jobWord)),
    );

    const fetchedJobsArrays = await Promise.all(fetchPromises);

    for (const fetchedJobs of fetchedJobsArrays) {
      for (const job of fetchedJobs) {
        if (job.id && !aggregatedJobsIdsSet.has(job.id)) {
          aggregatedJobs.push(processJobPost(job));
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
