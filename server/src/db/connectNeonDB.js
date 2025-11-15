import { Client } from "pg";
import { logError, logInfo } from "../util/logging.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../.env") });

const connectNeonDB = async () => {
  let error = null;
  let client = null;
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

  // client = new Client({
  //   connectionString: process.env.DATABASE_URL,
  // });

  // client.on("error", (err) => {
  //   // error = new Error(err && err.message ? err.message : String(err)); - to come back to this, if more simple approach fails
  //   error = err;
  //   return {
  //     error,
  //     connectedClient,
  //     endConnection: () => logError("Postgres client error:" + error.message),
  //   };
  // });

  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
  } catch (error) {
    return {
      error,
      connectedClient,
      endConnection: () => logError("Postgres client error:" + error.message),
    };
  }

  const endConnection = async () => {
    // Prefer to close the active client instance (connectedClient if set,
    // otherwise fallback to the client we created) so we don't leave sockets open.
    const toClose = connectedClient || client;
    if (toClose) {
      try {
        await toClose.end();
        logInfo("Database connection closed");
      } catch (err) {
        logError("Error closing database connection:" + err.message);
      }
    }
  };

  try {
    await client.connect();
    connectedClient = client;
    logInfo("Connected to Neon database successfully!");
  } catch (err) {
    error = err;
    logError("Database connection error:" + err.message);

    await client
      .end()
      .catch((e) =>
        logError("Error during failed connection cleanup:" + e.message),
      );
  }

  return { error, connectedClient, endConnection };
};

export default connectNeonDB;
