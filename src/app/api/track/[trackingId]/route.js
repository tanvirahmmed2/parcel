import { NextResponse } from "next/server";
import { Parcel } from "@/models/Parcel";
import { connectToDatabase } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { trackingId } = await params;
    await connectToDatabase();

    const parcel = await Parcel.findOne({ trackingId }).select("-deliveryOtp -history.updatedBy");
    if (!parcel) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(parcel);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
