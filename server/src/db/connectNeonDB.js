import { Client } from "pg";
import { logError } from "../util/logging.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

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

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const endConnection = async () => {
    if (connectedClient) {
      try {
        await connectedClient.end();
      } catch (err) {
        logError("Error closing database connection:", err.message);
      }
    }
  };

  try {
    await client.connect();
    connectedClient = client;
  } catch (err) {
    error = err;
    logError("Database connection error:", err.message);
    await client
      .end()
      .catch((e) =>
        logError("Error during failed connection cleanup:", e.message),
      );
  }

  return { error, connectedClient, endConnection };
};

export default connectNeonDB;
