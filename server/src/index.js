// Load our .env variables
import dotenv from "dotenv";
import express from "express";
dotenv.config();

import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
// import connectDB from "./db/connectDB.js";
import connectNeonDB from "./db/connectNeonDB.js";
import testRouter from "./testRouter.js";

// The environment should set the port
const port = process.env.PORT;

if (port == null) {
  // If this fails, make sure you have created a `.env` file in the right place with the PORT set
  logError(new Error("Cannot find a PORT number, did you create a .env file?"));
}

async function connectWithRetry(connectFn, initialError) {
  // connectFn: function to call to attempt a connection (e.g. connectNeonDB)
  // initialError: the error returned from the first connection attempt
  let attempt = 1;
  const maxAttempts = 5;
  const delayMs = 100; // milliseconds to wait between attempts
  let err = initialError;

  while (err && attempt <= maxAttempts) {
    logInfo(
      "Attempting to connect to NeonDB (attempt " +
        attempt +
        "/" +
        maxAttempts +
        ")",
    );

    // Try to connect using the provided function
    const { error } = await connectFn();
    err = error;

    if (err) {
      // If we'll attempt again, wait for delayMs before retrying
      if (attempt < maxAttempts) {
        logInfo(`Connection failed, retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      attempt++;
    }
  }

  if (err) {
    // All attempts exhausted
    logError(
      new Error(`Failed to connect to NeonDB after ${maxAttempts} attempts`),
    );
  }

  return { error: err };
}

async function startServer() {
  try {
    const { error } = await connectNeonDB();
    // Try to connect to the NeonDB with retries in case the DB isn't ready yet
    if (error) {
      await connectWithRetry(connectNeonDB, error);
    }

    app.listen(port, () => {
      logInfo(`Server started on port ${port}`);
    });
  } catch (error) {
    logError(error);
  }
}

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
