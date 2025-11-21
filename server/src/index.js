// Load our .env variables as early as possible so other modules that read
// process.env at module-evaluation time receive the values.
import "dotenv/config";
import express from "express";

import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";

const port = process.env.PORT;
if (port == null) {
  logError(new Error("Cannot find a PORT number, did you create a .env file?"));
}

const startServer = async () => {
  try {
    app.listen(port, () => {
      logInfo(`Server started on port ${port}`);
    });
  } catch (error) {
    logError(error);
  }
};

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

/****** Removed test router import and mounting. The `testRouter.js` file was deleted and is no longer used. ******/

// Start the server
startServer();
