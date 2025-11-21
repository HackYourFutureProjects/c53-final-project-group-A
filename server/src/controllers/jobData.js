import { logError } from "../util/logging.js";
import { realJobSearch } from "./realJobSearch.js";
import { fakeJobSearch } from "./fakeJobSearch.js";

const isSearchReal = false; // Set to true to enable real job search

export const searchJobs = async (req, res) => {
  try {
    const { search_terms } = req.body;

    if (!search_terms || !search_terms.trim()) {
      return res.status(400).json({
        success: false,
        msg: "You need to provide 'search_terms' in the request body.",
      });
    }
    const jobWord = search_terms;

    const fetchedJobs = isSearchReal
      ? await realJobSearch({ jobWord })
      : fakeJobSearch({ jobWord });

    res.status(200).json({ success: true, result: fetchedJobs });
  } catch (error) {
    logError("searchJobs error:", error);
    res.status(500).json({
      success: false,
      msg: "Unable to search for jobs, please try again later.",
    });
  }
};
