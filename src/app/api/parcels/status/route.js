import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { requireAuth } from "@/lib/auth-shield";

export async function PATCH(req) {
  try {
    const user = await requireAuth(["RIDER", "ADMIN"]);
    
    const payload = await req.json();
    const { trackingId, status, reason, location } = payload;

    if (!trackingId || !status) {
      return NextResponse.json({ success: false, message: "Missing tracking ID or status" }, { status: 400 });
    }

    await connectToDatabase();

    let statusStr = status;
    if (statusStr === "IN_TRANSIT") statusStr = "In Transit";
    if (statusStr === "DELIVERED") statusStr = "Delivered";

    let finalMessage = payload.note || `Status updated to ${statusStr}`;
    if (status === "REFUSED") {
      statusStr = "Returned";
      finalMessage = `REFUSED: ${reason}`;
    }

    const query = trackingId.length === 24 
      ? { $or: [{ _id: trackingId }, { trackingId: trackingId }] }
      : { trackingId: trackingId };

    const updateOperation = {
      $set: { status: statusStr },
      $push: {
        history: {
          status: statusStr,
          message: finalMessage,
          updatedBy: user.id
        }
      }
    };

    if (location?.lat && location?.lng) {
      updateOperation.$set.lastLocation = location;
    }

    const parcel = await Parcel.findOneAndUpdate(
      query,
      updateOperation,
      { new: true }
    );

    if (!parcel) {
      return NextResponse.json({ success: false, message: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Parcel ${parcel.trackingId} updated to ${statusStr}`,
      data: parcel
    });
  } catch (error) {
    console.error("Error updating parcel status:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
