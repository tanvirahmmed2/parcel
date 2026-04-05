"use server";

import { requireAuth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";

export async function scanAndUpdateParcel(trackingIdOrId, payload) {
  const user = await requireAuth(["RIDER", "ADMIN"]);

  if (!trackingIdOrId || !payload.status) {
    return { success: false, message: "Missing tracking ID or status" };
  }

  await connectToDatabase();

  let statusStr = payload.status;
  if (statusStr === "IN_TRANSIT") statusStr = "In Transit";
  if (statusStr === "DELIVERED") statusStr = "Delivered";

  let finalMessage = payload.note || `Status updated to ${statusStr}`;
  if (payload.status === "REFUSED") {
    statusStr = "Returned";
    finalMessage = `REFUSED: ${payload.reason}`;
  }

  const query = trackingIdOrId.length === 24 
    ? { $or: [{ _id: trackingIdOrId }, { trackingId: trackingIdOrId }] }
    : { trackingId: trackingIdOrId };

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

  if (payload.location?.lat && payload.location?.lng) {
    updateOperation.$set.lastLocation = payload.location;
  }

  const parcel = await Parcel.findOneAndUpdate(
    query,
    updateOperation,
    { new: true }
  );

  if (!parcel) {
    return { success: false, message: "Parcel not found" };
  }

  return { success: true, message: `Parcel ${parcel.trackingId} updated to ${statusStr}` };
}
