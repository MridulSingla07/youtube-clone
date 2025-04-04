import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_BASE_URL}/${DB_NAME}`
    );
    console.log("DB CONNECTED : ", connection.connection.host);
  } catch (error) {
    console.log("CONNECTION ERROR: ", error);
    process.exit(1);
  }
};

export default connectDB;
