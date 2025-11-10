import { logInfo, logError } from "./util/logging.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from the server folder explicitly. When this module is executed
// with a different working directory (e.g. project root), dotenv.config()
// without a path may not find `server/.env`.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// server/src -> ../.env points to server/.env
const envPath = path.resolve(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const RAPID_API_KEY = process.env.REACT_APP_X_RAPIDAPI_KEY;

const jobTitle = "developer";
const location = "Netherlands";
const offset = 0;
const limit = 10;

const url = `https://linkedin-job-search-api.p.rapidapi.com/active-jb-7d?limit=${limit}&offset=${offset}&title_filter=${encodeURIComponent(jobTitle)}&location_filter=${encodeURIComponent(location)}&description_type=text`;
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": RAPID_API_KEY,
    "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com",
  },
};

try {
  const response = await fetch(url, options);
  const result = await response.json();
  logInfo(result.length, "LinkedIn jobs fetched successfully");
  logInfo(JSON.stringify(result, null, 2));
} catch (error) {
  logError("Error fetching LinkedIn jobs:", error);
}
