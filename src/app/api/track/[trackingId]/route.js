import { NextResponse } from "next/server";
import { Parcel } from "@/models/Parcel";
import { connectToDatabase } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { trackingId } = await params;
    await connectToDatabase();

    const parcel = await Parcel.findOne({ trackingId }).select("-deliveryOtp -history.updatedBy").lean();
    if (!parcel) {
      return NextResponse.json({ success: false, message: "Not Found", data: null }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Parcel found", data: parcel });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error", data: null }, { status: 500 });
  }
}
