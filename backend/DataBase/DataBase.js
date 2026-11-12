import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.RK_URI || process.env.DB_URI;
let connectionPromise;

const ConnectedToDB = async () => {
  if (!uri) {
    throw new Error("Database URI (RK_URI or DB_URI) is missing in environment variables");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  return connectionPromise;
};

export default ConnectedToDB;
