import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectMongoDB; 