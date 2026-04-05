import { NextResponse } from "next/server";
import { Parcel } from "@/models/Parcel";
import { connectToDatabase } from "@/lib/db";

// Simulated Email/SMS gateway
export async function POST(req) {
  try {
    const { id } = await req.json();
    await connectToDatabase();

    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Generate 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save to parcel
    parcel.deliveryOtp = otp;
    await parcel.save();

    console.log(`\n\n=== MOCK EMAIL/SMS SYSTEM ===`);
    console.log(`To: ${parcel.phone}`);
    console.log(`Subject: Your Steadfast (Percel) is Out for Delivery!`);
    console.log(`Message: Your parcel ${parcel.trackingId} is out for delivery.`);
    console.log(`Please share this OTP with the rider: ${otp}`);
    console.log(`=============================\n\n`);

    return NextResponse.json({ success: true, message: "Mock OTP sent via console" });
  } catch (error) {
    console.error("Mailer error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
