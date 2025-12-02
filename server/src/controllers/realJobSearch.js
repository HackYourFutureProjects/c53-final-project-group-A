import { logError } from "../util/logging.js";

export const realJobSearch = async (
  jobWord,
  location = "Netherlands",
  limit = 100,
  maxIterations = 2,
  initialOffset = 0,
) => {
  const aggregated = [];
  // Build offsets for concurrent requests
  const offsets = Array.from(
    { length: maxIterations },
    (_, i) => initialOffset + i * limit,
  );

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com",
    },
  };

  const fetchPromises = offsets.map((offset) => {
    const url = `https://linkedin-job-search-api.p.rapidapi.com/active-jb-7d?limit=${limit}&offset=${offset}&title_filter=${encodeURIComponent(
      jobWord,
    )}&location_filter=${encodeURIComponent(location)}&description_type=text`;

    return fetch(url, options).then(async (apiResponse) => {
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        logError(
          `Linkedin API Error: ${apiResponse.status} - ${apiResponse.statusText}`,
          errorText,
        );
        throw new Error(`Failed to fetch from Linkedin API: ${errorText}`);
      }
      return apiResponse.json();
    });
  });

  // Run all requests concurrently and aggregate results
  const results = await Promise.all(fetchPromises);

  results.forEach((apiResult) => {
    if (Array.isArray(apiResult)) {
      aggregated.push(...apiResult);
    } else if (apiResult) {
      aggregated.push(apiResult);
    }
  });

  return aggregated;
};
