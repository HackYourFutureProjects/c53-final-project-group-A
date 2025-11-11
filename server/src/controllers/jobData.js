import { logError } from "../util/logging.js";

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
    const location = "Netherlands";
    const offset = 0;
    const limit = 10;

    const url = `https://linkedin-job-search-api.p.rapidapi.com/active-jb-7d?limit=${limit}&offset=${offset}&title_filter=${encodeURIComponent(jobTitle)}&location_filter=${encodeURIComponent(location)}&description_type=text`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.REACT_APP_X_RAPIDAPI_KEY,
        "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com",
      },
    };

    const apiResponse = await fetch(url, options);
    const apiResult = await apiResponse.json();

    if (!apiResponse.ok) {
      logError(
        `Linkedin API Error: ${apiResponse.status} - ${apiResponse.statusText}`,
        apiResult,
      );
      return res.status(apiResponse.status).json({
        success: false,
        msg: "Failed to fetch from Linkedin API.",
        error: apiResult,
      });
    }

    const filteredJobs = apiResult;

    res.status(200).json({ success: true, result: filteredJobs });
  } catch (error) {
    logError("searchJobs error:", error);
    res.status(500).json({
      success: false,
      msg: "Unable to search for jobs, please try again later.",
    });
  }
};
