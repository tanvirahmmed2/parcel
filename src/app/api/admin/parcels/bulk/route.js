import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-shield";
export async function PATCH(req) {
  try {
    const session = await requireAuth(["ADMIN"]);
    const { ids, status, message } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
      return new NextResponse("Invalid request body", { status: 400 });
    }
    await connectToDatabase();
    const updateResult = await Parcel.updateMany(
      { _id: { $in: ids } },
      { 
        $set: { status },
        $push: { 
          history: {
            status,
            message: message || `Bulk updated to ${status}`,
            updatedBy: session.id
          } 
        }
      }
    );
    return NextResponse.json({ success: true, message: `Updated ${updateResult.modifiedCount} parcels`, data: { count: updateResult.modifiedCount } });
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Bulk parcel status error:", error);
    return NextResponse.json({ success: false, message: "Internal server error", data: null }, { status: 500 });
  }
}
export async function GET(req) {
  try {
    await requireAuth(["ADMIN"]);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = {};
    if (status) query.status = status;
    await connectToDatabase();
    const parcels = await Parcel.find(query).sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ success: true, message: "Parcels fetched", data: { parcels } });
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Admin parcels fetch:", error);
    return NextResponse.json({ success: false, message: "Internal server error", data: null }, { status: 500 });
  }
}
