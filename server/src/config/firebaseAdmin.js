import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: process.env.STORAGE_BUCKET,
});

export const bucket = admin.storage().bucket();
