import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { User } from "@/models/User"; // import to register model for populate
import { requireAuth as auth } from "@/lib/auth-shield";

export async function GET(req) {
  try {
    const session = await auth(["ADMIN"]);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const status = searchParams.get("status");

    await connectToDatabase();

    const query = {};
    if (status) query.status = status;

    const parcels = await Parcel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("merchantId", "name storeName email")
      .populate("riderId", "name phone")
      .lean();

    const total = await Parcel.countDocuments(query);

    return NextResponse.json({ 
      parcels, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    });
  } catch(e) {
    if (e.message === "NEXT_REDIRECT") throw e;
    console.error(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
