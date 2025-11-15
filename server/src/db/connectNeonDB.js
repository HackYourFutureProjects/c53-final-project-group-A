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

  client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  client.on("error", (err) => {
    logError("Client emitted error:", err);
    client
      .end()
      .catch((e) =>
        logError("Error during failed connection cleanup:" + e.message),
      );
  });

  try {
    // `client.connect()` resolves when connected but does not return
    // the client instance. Assign the created `client` to
    // `connectedClient` after a successful connect so callers receive
    // the active client instance.
    await client.connect();
    connectedClient = client;
  } catch (err) {
    error = err;
    logError("Database immediate connection rejection:" + err.message);
    await client.end().catch((e) => {
      error = e;
      logError("Error during failed connection cleanup:" + e.message);
    });
  }

  async function endConnection() {
    // Prefer to close the active client instance (connectedClient if set,
    // otherwise fallback to the client we created) so we don't leave sockets open.
    const toClose = connectedClient || client;
    if (toClose) {
      try {
        await toClose.end();
      } catch (err) {
        logError("Error closing database connection:" + err.message);
      }
    }
  }

  return {
    error,
    connectedClient,
    endConnection,
  };
};

export default connectNeonDB;
