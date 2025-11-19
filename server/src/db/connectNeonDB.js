import { logError, logInfo } from "../util/logging.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../.env") });

const connectNeonDB = async () => {
  let error = null;
  let connectedClient = null;

  //validation check
  if (!process.env.DATABASE_URL) {
    const errMessage =
      "DATABASE_URL is not defined in environment variables. Please check your .env file";
    logError(errMessage);
    error = new Error(errMessage);
    return {
      error,
      connectedClient,
      endConnection: () =>
        logError("Cannot close connection: Client never connected"),
    };
  }

  const endConnection = async () => {
    if (connectedClient) {
      if (connectedClient) {
        logInfo("Neon serverless connection - managed automatically");
      }
    }
  };

  try {
    connectedClient = neon(process.env.DATABASE_URL);
    logInfo("Connected to Neon database successfully!");
  } catch (err) {
    error = err;
    logError("Database connection error:", err.message);
  }

  return { error, connectedClient, endConnection };
};

export default connectNeonDB;
