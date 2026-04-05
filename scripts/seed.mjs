import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../src/models/User.js";
import { Parcel } from "../src/models/Parcel.js";

const BANGLADESH_DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh", "Cumilla", "Gazipur", "Bogura"];

async function runSeed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Clear existing
    await User.deleteMany({});
    await Parcel.deleteMany({});
    console.log("Cleared existing data");

    const passwordHash = await bcrypt.hash("password123", 10);

    // 1 Admin
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@logistics.com",
      password: passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      phone: "01700000000"
    });
    console.log("Admin created");

    // 5 Merchants
    const merchants = [];
    for (let i = 1; i <= 5; i++) {
      merchants.push(await User.create({
        name: `Merchant ${i}`,
        email: `merchant${i}@logistics.com`,
        password: passwordHash,
        role: "MERCHANT",
        status: "ACTIVE",
        phone: `0180000000${i}`,
        storeName: `Store ${i}`
      }));
    }
    console.log("5 Merchants created");

    // 10 Riders
    const riders = [];
    for (let i = 1; i <= 10; i++) {
        riders.push(await User.create({
            name: `Rider ${i}`,
            email: `rider${i}@logistics.com`,
            password: passwordHash,
            role: "RIDER",
            status: "ACTIVE",
            phone: `0190000000${i}`
        }));
    }
    console.log("10 Riders created");

    // 50 Parcels
    const statuses = ["Pending", "Picked Up", "In Transit", "Hub Received", "Out for Delivery", "Delivered", "Partial Delivered", "Returned"];
    
    const parcels = [];
    for (let i = 1; i <= 50; i++) {
      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      const rider = Math.random() > 0.5 ? riders[Math.floor(Math.random() * riders.length)]._id : null;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const trackingId = `STEAD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      
      parcels.push({
        trackingId,
        merchantId: merchant._id,
        riderId: rider,
        receiverName: `Customer ${i}`,
        phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: `House ${i}, Road ${Math.floor(Math.random() * 10)}, Area ${Math.floor(Math.random() * 5)}`,
        district: BANGLADESH_DISTRICTS[Math.floor(Math.random() * BANGLADESH_DISTRICTS.length)],
        codAmount: Math.floor(Math.random() * 50) * 100 + 500, // 500 to 5500
        deliveryCharge: Math.random() > 0.2 ? 60 : 120, // mostly regular
        weight: Math.random() * 3 + 0.5, // 0.5kg to 3.5kg
        deliveryType: Math.random() > 0.2 ? "Regular" : "Express",
        status,
        history: [{
           status: "Pending",
           timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
           message: "Created"
        }]
      });
    }

    await Parcel.insertMany(parcels);
    console.log("50 Parcels created");
    console.log("Seeding complete! Admin login: admin@logistics.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

runSeed();
