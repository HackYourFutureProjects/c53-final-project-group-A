// Load our .env variables
import dotenv from "dotenv";
import express from "express";
dotenv.config();

import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectNeonDB from "./db/connectNeonDB.js";
import testRouter from "./testRouter.js";

// The environment should set the port
const port = process.env.PORT;

if (port == null) {
  // If this fails, make sure you have created a `.env` file in the right place with the PORT set
  logError(new Error("Cannot find a PORT number, did you create a .env file?"));
}

async function startServer() {
  try {
    const { error, endConnection } = await connectNeonDB();
    // Graceful shutdown helper. When a watcher (nodemon, etc.) restarts the process, startServer.dbEndConnection is called during the shutdown sequence. This prevents DB clients from dangling.

    startServer.dbEndConnection = endConnection;
    if (error) {
      logError("Failed to connect to the database:", error);
    }

    app.listen(port, () => {
      logInfo(`Server started on port ${port}`);
    });
  } catch (error) {
    logError(error);
  }
}

const shutdown = async (signal) => {
  logInfo(`Received ${signal}. Closing database connection if open...`);
  try {
    if (startServer.dbEndConnection) {
      await startServer.dbEndConnection();
      logInfo("Database connection closed.");
    }
  } catch (err) {
    logError("Error while closing database connection:", err);
  }
};

// Common graceful handlers
process.on("SIGINT", async () => {
  await shutdown("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await shutdown("SIGTERM");
  process.exit(0);
});

// nodemon often restarts the process using SIGUSR2 — handle it specially so
// the restart still occurs after cleanup. (On Windows signals behave
// differently; this is a best-effort handler.)
process.once("SIGUSR2", async () => {
  await shutdown("SIGUSR2");
  process.kill(process.pid, "SIGUSR2");
});

process.on("uncaughtException", async (err) => {
  logError("Uncaught exception:", err);
  await shutdown("uncaughtException");
  process.exit(1);
});

/****** Host our client code for Heroku *****/
/**
 * We only want to host our client code when in production mode as we then want to use the production build that is built in the dist folder.
 * When not in production, don't host the files, but the development version of the app can connect to the backend itself.
 */
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(new URL("../../client/dist", import.meta.url).pathname),
  );
  // Redirect * requests to give the client data
  app.get("/*file", (req, res) =>
    res.sendFile(
      new URL("../../client/dist/index.html", import.meta.url).pathname,
    ),
  );
}

/****** For cypress we want to provide an endpoint to seed our data ******/
if (process.env.NODE_ENV !== "production") {
  app.use("/api/test", testRouter);
}

// Start the server
startServer();
