import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
    if (isConnected) return;

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI_PROD as string);


        isConnected = true;
        // console.log("✅ MongoDB connected:", conn.connection.host);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
};
