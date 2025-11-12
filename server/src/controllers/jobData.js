import { logError } from "../util/logging.js";
import { realJobSearch } from "./realJobSearch.js";

export const searchJobs = async (req, res) => {
  try {
    const { search_terms } = req.body;

    if (!search_terms || !search_terms.trim()) {
      return res.status(400).json({
        success: false,
        msg: "You need to provide 'search_terms' in the request body.",
      });
    }

    const jobTitle = search_terms;

    // Delegate the actual job-fetching logic to the realJobSearch helper
    const filteredJobs = await realJobSearch({ jobTitle });

    res.status(200).json({ success: true, result: filteredJobs });
  } catch (error) {
    logError("searchJobs error:", error);
    res.status(500).json({
      success: false,
      msg: "Unable to search for jobs, please try again later.",
    });
  }
};
