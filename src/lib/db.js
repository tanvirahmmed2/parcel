import mongoose from "mongoose";
import dns from "dns";
const MONGODB_URI = process.env.MONGODB_URI;
dns.setServers(['8.8.8.8', '8.8.4.4']);


if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

export async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('MongoDB server connected successfully')
    } catch (error) {
        console.log(error)
        console.log('Failed to connect mongodb')
    }
}
