import { requireAuth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await requireAuth(["HUB", "ADMIN"]);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    await connectToDatabase();

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { trackingId: { $regex: search, $options: "i" } },
        { receiverName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const parcels = await Parcel.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("merchantId", "name storeName")
      .populate("riderId", "name phone")
      .lean();

    const total = await Parcel.countDocuments(query);

    return NextResponse.json({
      parcels,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Hub parcels fetch error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Bulk update / Scanner endpoint
export async function PATCH(req) {
  try {
    const session = await requireAuth(["HUB", "ADMIN"]);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { trackingId, action } = await req.json();
    await connectToDatabase();

    const parcel = await Parcel.findOne({ trackingId });
    if (!parcel) return new NextResponse("Parcel not found", { status: 404 });

    if (action === "RECEIVE") {
      parcel.status = "Hub Received";
      parcel.history.push({
        status: "Hub Received",
        message: "Parcel sorted and received at Hub facility",
        updatedBy: session.id,
        timestamp: new Date()
      });
    } else if (action === "ASSIGN") {
        parcel.status = "Out for Delivery";
        parcel.history.push({
          status: "Out for Delivery",
          message: "Parcel dispatched from Hub for final delivery",
          updatedBy: session.id,
          timestamp: new Date()
        });
    }

    await parcel.save();

    return NextResponse.json({ success: true, parcel });
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Hub parcel update error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
