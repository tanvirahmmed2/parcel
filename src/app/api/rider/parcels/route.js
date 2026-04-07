import { requireAuth as auth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { User } from "@/models/User"; // Ensure User model is registered for populate
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await auth(["RIDER", "ADMIN"]);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // pending, active, history
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await connectToDatabase();

    let query = {};

    if (type === "pending") {
      query = { status: "Pending", riderId: { $exists: false } };
    } else if (type === "active") {
      query = { 
        riderId: session.id, // Using session.id directly
        status: { $in: ["Picked Up", "In Transit", "Hub Received", "Out for Delivery"] } 
      };
    } else if (type === "history") {
      query = { 
        riderId: session.id, 
        status: { $in: ["Delivered", "Partial Delivered", "Returned"] } 
      };
    } else {
      // Default to returning something or error
      return new NextResponse("Invalid type parameter", { status: 400 });
    }

    const parcels = await Parcel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("merchantId", "name storeName phone")
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
    console.error("Rider fetch parcels error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
