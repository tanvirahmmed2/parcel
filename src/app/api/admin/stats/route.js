import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { requireAuth } from "@/lib/auth-shield";

export async function GET(req) {
  try {
    await requireAuth(["ADMIN"]);

    await connectToDatabase();

    const totalOrders = await Parcel.countDocuments();
    const delivered = await Parcel.countDocuments({ status: "Delivered" });
    const pending = await Parcel.countDocuments({ status: "Pending" });
    const transit = await Parcel.countDocuments({ status: "In Transit" });

    const chartData = [
      { name: "Mon", total: 120, delivered: 100 },
      { name: "Tue", total: 150, delivered: 120 },
      { name: "Wed", total: 180, delivered: 160 },
      { name: "Thu", total: Math.floor(totalOrders/2) || 200, delivered: Math.floor(delivered/2) || 180 },
      { name: "Fri", total: totalOrders || 250, delivered: delivered || 220 },
      { name: "Sat", total: 90, delivered: 85 },
      { name: "Sun", total: 40, delivered: 35 },
    ];

    return NextResponse.json({
        success: true,
        message: "Stats generated",
        data: {
          totalOrders,
          delivered,
          pending,
          transit,
          chartData
        }
    });

  } catch(error) {
    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized", data: null }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
