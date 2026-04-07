import { requireAuth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const session = await requireAuth(["HUB", "ADMIN"]);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    await connectToDatabase();

    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return new NextResponse("Parcel not found", { status: 404 });
    }

    if (parcel.status !== "Hub Received") {
      return new NextResponse("Only Hub Received parcels can be assigned for delivery", { status: 400 });
    }

    // Update status and push to history
    parcel.status = "Out for Delivery";
    parcel.history.push({
      status: "Out for Delivery",
      message: `Parcel assigned for final dispatch by Hub Manager: ${session.name}`,
      updatedBy: session.id,
      timestamp: new Date()
    });

    await parcel.save();

    return NextResponse.json({ 
      success: true, 
      message: "Parcel assigned successfully",
      parcel 
    });
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Assign parcel error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
