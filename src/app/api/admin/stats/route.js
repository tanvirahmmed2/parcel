import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();

    const totalOrders = await Parcel.countDocuments();
    const delivered = await Parcel.countDocuments({ status: "Delivered" });
    const pending = await Parcel.countDocuments({ status: "Pending" });
    const transit = await Parcel.countDocuments({ status: "In Transit" });

    // Mock weekly data for recharts
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
        totalOrders,
        delivered,
        pending,
        transit,
        chartData
    });

  } catch(e) {
    return new NextResponse("Internal", { status: 500 });
  }
}
