import { logError } from "../util/logging.js";

export const realJobSearch = async ({
  jobTitle,
  location = "Netherlands",
  limit = 10,
  maxIterations = 2,
  initialOffset = 0,
} = {}) => {
  const aggregated = [];
  let offset = initialOffset;

  for (let i = 0; i < maxIterations; i++) {
    const url = `https://linkedin-job-search-api.p.rapidapi.com/active-jb-7d?limit=${limit}&offset=${offset}&title_filter=${encodeURIComponent(
      jobTitle,
    )}&location_filter=${encodeURIComponent(location)}&description_type=text`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
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
      throw new Error(`Failed to fetch from Linkedin API: ${apiResult}`);
    }

    const items = apiResult || [];
    if (items.length === 0) {
      break;
    }

    aggregated.push(...items);

    if (items.length < limit) {
      // last page
      break;
    }

    offset += limit;
  }

  return aggregated;
};
