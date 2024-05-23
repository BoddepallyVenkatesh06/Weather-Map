import mongoose from "mongoose";

export const mongoDBConnection = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    return;
    // console.log("connection failed", error);
  }
};
