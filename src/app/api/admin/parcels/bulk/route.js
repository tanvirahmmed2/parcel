import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { ids, status, message } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    await connectToDatabase();

    // Iterate and update each to append to history
    // A simple updateMany doesn't let us push diverse subdocuments easily with standard syntax without $push
    
    const updateResult = await Parcel.updateMany(
      { _id: { $in: ids } },
      { 
        $set: { status },
        $push: { 
          history: {
            status,
            message: message || `Bulk updated to ${status}`,
            updatedBy: session.user.id
          } 
        }
      }
    );

    return NextResponse.json({ success: true, count: updateResult.modifiedCount });
  } catch (error) {
    console.error("Bulk parcel status error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    const query = {};
    if (status) query.status = status;

    await connectToDatabase();

    const parcels = await Parcel.find(query).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({ parcels });
  } catch (error) {
    console.error("Admin parcels fetch:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
