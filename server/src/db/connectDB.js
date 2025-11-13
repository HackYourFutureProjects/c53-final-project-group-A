// import mongoose from "mongoose";
import connectNeonDB from "./connectNeonDB.js";

// const connectDB = () => mongoose.connect(process.env.MONGODB_URL);
const connectDB = connectNeonDB;

export default connectDB;
