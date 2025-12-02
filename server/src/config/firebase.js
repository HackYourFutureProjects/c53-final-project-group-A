import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import dotenv from "dotenv";
// import { logError } from "../util/logging";

dotenv.config();
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

console.log("STORAGE_BUCKET =", process.env.STORAGE_BUCKET);

// logError(firebaseConfig);
console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
// logError(app);
console.log(app);

export const storage = getStorage(app);
