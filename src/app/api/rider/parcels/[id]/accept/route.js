import { requireAuth as auth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const session = await auth(["RIDER", "ADMIN"]);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    await connectToDatabase();

    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return new NextResponse("Parcel not found", { status: 404 });
    }

    if (parcel.status !== "Pending" || parcel.riderId) {
      return new NextResponse("Parcel is already accepted or not available", { status: 400 });
    }

    // Update status and binder rider
    parcel.riderId = session.id;
    parcel.status = "Picked Up";
    parcel.history.push({
      status: "Picked Up",
      message: `Accepted for dispatch by rider: ${session.name}`,
      updatedBy: session.id,
      timestamp: new Date()
    });

    await parcel.save();

    return NextResponse.json({ 
      success: true, 
      message: "Parcel accepted successfully",
      parcel 
    });
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Accept parcel error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
