import { NextResponse } from "next/server";
import { Parcel } from "@/models/Parcel";
import { connectToDatabase } from "@/lib/db";
export async function POST(req) {
  try {
    const { id } = await req.json();
    await connectToDatabase();
    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return new NextResponse("Not Found", { status: 404 });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    parcel.deliveryOtp = otp;
    await parcel.save();
     is Out for Delivery!`);
    return NextResponse.json({ success: true, message: "Mock OTP sent via console" });
  } catch (error) {
    console.error("Mailer error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
