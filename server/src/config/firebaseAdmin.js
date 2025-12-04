import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error(
    "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set",
  );
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
} catch (error) {
  throw new Error(
    "Invalid GOOGLE_APPLICATION_CREDENTIALS format. Must be valid JSON.",
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

export const bucket = admin.storage().bucket();
