import { requireAuth as auth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.role !== "MERCHANT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const data = await req.json();
    await connectToDatabase();
    const trackingId = `PARCEL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const isDhaka = data.district?.toLowerCase()?.includes("dhaka");
    let deliveryCharge = isDhaka ? 60 : 120;
    const weight = Number(data.weight) || 1;
    if (weight > 1) {
      deliveryCharge += (Math.ceil(weight) - 1) * 20;
    }
    const newParcel = await Parcel.create({
      trackingId,
      merchantId: session.id,
      receiverName: data.receiverName,
      phone: data.phone,
      address: data.address,
      district: data.district,
      codAmount: data.codAmount,
      weight: data.weight,
      deliveryType: data.deliveryType || "Regular",
      deliveryCharge,
      status: "Pending",
      history: [{
        status: "Pending",
        message: "Parcel created by merchant",
        updatedBy: session.id
      }]
    });
    return NextResponse.json(newParcel, { status: 201 });
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Parcel creation error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.role !== "MERCHANT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const query = { merchantId: session.id };
    const status = searchParams.get("status");
    if (status) query.status = status;
    await connectToDatabase();
    const parcels = await Parcel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("merchantId", "name storeName phone email")
      .lean();
    const total = await Parcel.countDocuments(query);
    return NextResponse.json({
      parcels,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Fetch parcels error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}


