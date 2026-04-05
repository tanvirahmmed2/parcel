import { requireAuth as auth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { Withdrawal } from "@/models/Withdrawal";
import { sendOtpEmail } from "@/lib/mail";
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "RIDER")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id } = await params; 
    const { status, note, location } = await req.json();
    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }
    const { otp } = await req.json().catch(() => ({})); 
    await connectToDatabase();
    const parcel = await Parcel.findById(id);
    if (!parcel) {
       return new NextResponse("Parcel not found", { status: 404 });
    }
    if (status === "Delivered" && parcel.deliveryOtp !== otp) {
      return new NextResponse("Invalid OTP", { status: 400 });
    }
    parcel.status = status;
    if (location && location.lat && location.lng) {
      parcel.lastLocation = { lat: location.lat, lng: location.lng };
    }
    parcel.history.push({
      status,
      updatedBy: session.user.id,
      message: note || `Status updated to ${status}`
    });
    if (status === "Out for Delivery") {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      parcel.deliveryOtp = newOtp;
      try {
        await sendOtpEmail(parcel.email || "customer@example.com", parcel.trackingId, newOtp); 
      } catch(e) {
        console.error("Failed to send OTP via Brevo");
      }
    }
    await parcel.save();
    if (status === "Delivered") {
      let withdrawal = await Withdrawal.findOne({ merchantId: parcel.merchantId, status: "PENDING" });
      if (!withdrawal) {
        withdrawal = await Withdrawal.create({
          merchantId: parcel.merchantId,
          amount: parcel.codAmount - parcel.deliveryCharge,
          status: "PENDING"
        });
      } else {
        withdrawal.amount += (parcel.codAmount - parcel.deliveryCharge);
        await withdrawal.save();
      }
    }
    try {
      await pusherServer.trigger("parcel-channel", "status-updated", {
        trackingId: parcel.trackingId,
        status: parcel.status,
        merchantId: parcel.merchantId
      });
    } catch (e) {
      console.error("Pusher error:", e);
    }
    return NextResponse.json(parcel);
  } catch (error) {
    console.error("Update parcel status error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
