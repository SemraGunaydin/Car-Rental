import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected");
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "CarRental", // Atlas'ta görünen DB adı (case-sensitive!)
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

export default connectDB;