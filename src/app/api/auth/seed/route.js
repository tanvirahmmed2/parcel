import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { Parcel } from "@/models/Parcel";
import { connectToDatabase } from "@/lib/db";

const BANGLADESH_DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh", "Cumilla", "Gazipur", "Bogura"];

export async function GET() {
  try {
    await connectToDatabase()

    // 1. Clear existing data
    await User.deleteMany({});
    await Parcel.deleteMany({});

    const passwordHash = await bcrypt.hash("password123", 10);

    // 2. Create Admin
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@parcel.com",
      password: passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      phone: "01700000000"
    });

    // 3. Create 5 Merchants
    const merchants = [];
    for (let i = 1; i <= 5; i++) {
      const merchant = await User.create({
        name: `Merchant ${i}`,
        email: `merchant${i}@parcel.com`,
        password: passwordHash,
        role: "MERCHANT",
        status: "ACTIVE",
        phone: `0180000000${i}`,
        storeName: `Store ${i}`
      });
      merchants.push(merchant);
    }

    // 4. Create 10 Riders
    const riders = [];
    for (let i = 1; i <= 10; i++) {
      const rider = await User.create({
        name: `Rider ${i}`,
        email: `rider${i}@parcel.com`,
        password: passwordHash,
        role: "RIDER",
        status: "ACTIVE",
        phone: `0190000000${i}`
      });
      riders.push(rider);
    }

    // 5. Create 50 Parcels
    const statuses = ["Pending", "Picked Up", "In Transit", "Hub Received", "Out for Delivery", "Delivered", "Partial Delivered", "Returned"];
    const parcels = [];

    for (let i = 1; i <= 50; i++) {
      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      const riderId = Math.random() > 0.5 ? riders[Math.floor(Math.random() * riders.length)]._id : null;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const trackingId = `STEAD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      parcels.push({
        trackingId,
        merchantId: merchant._id,
        riderId,
        receiverName: `Customer ${i}`,
        phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: `House ${i}, Road ${Math.floor(Math.random() * 10)}`,
        district: BANGLADESH_DISTRICTS[Math.floor(Math.random() * BANGLADESH_DISTRICTS.length)],
        codAmount: Math.floor(Math.random() * 50) * 100 + 500,
        deliveryCharge: Math.random() > 0.2 ? 60 : 120,
        weight: Math.random() * 3 + 0.5,
        deliveryType: Math.random() > 0.2 ? "Regular" : "Express",
        status,
        history: [{
          status: "Pending",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          message: "Created"
        }]
      });
    }

    await Parcel.insertMany(parcels);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      stats: {
        admin: 1,
        merchants: merchants.length,
        riders: riders.length,
        parcels: parcels.length
      }
    });

  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}