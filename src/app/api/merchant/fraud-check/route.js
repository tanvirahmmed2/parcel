import { requireAuth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await requireAuth(["MERCHANT"]);

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ success: false, message: "Phone parameter required" }, { status: 400 });
    }

    await connectToDatabase();

    const ordersWithPhone = await Parcel.find({ phone }).select("status").lean();

    const totalOrders = ordersWithPhone.length;
    let successfulDeliveries = 0;
    let failedDeliveries = 0;

    ordersWithPhone.forEach(p => {

      if (p.status === "Delivered" || p.status === "Partial Delivered" || p.status === "DELIVERED") {
        successfulDeliveries++;
      } else if (p.status === "Returned" || p.status === "REFUSED") {

        failedDeliveries++;
      }
    });

    const successRate = totalOrders > 0 ? (successfulDeliveries / totalOrders) * 100 : 100;
    const isHighRisk = totalOrders > 0 && successRate < 50;

    return NextResponse.json({
      success: true,
      message: "Fraud check completed.",
      data: {
        totalOrders,
        successfulDeliveries,
        failedDeliveries,
        successRate: successRate.toFixed(2),
        isHighRisk
      }
    });
  } catch (error) {
    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized", data: null }, { status: 401 });
    }
    console.error("Fraud Check Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
