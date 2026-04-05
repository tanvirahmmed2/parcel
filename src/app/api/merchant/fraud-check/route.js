import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "MERCHANT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return new NextResponse("Phone parameter required", { status: 400 });
    }

    await connectToDatabase();

    const ordersWithPhone = await Parcel.find({ phone }).select("status");

    const totalOrders = ordersWithPhone.length;
    let successfulDeliveries = 0;
    let failedDeliveries = 0;

    ordersWithPhone.forEach(p => {
      if (p.status === "Delivered" || p.status === "Partial Delivered") {
        successfulDeliveries++;
      } else if (p.status === "Returned") {
        failedDeliveries++;
      }
    });

    // In a real system, we'd calculate across all merchants.
    const successRate = totalOrders > 0 ? (successfulDeliveries / totalOrders) * 100 : 100;
    const isHighRisk = totalOrders > 0 && successRate < 50;

    return NextResponse.json({
      totalOrders,
      successfulDeliveries,
      failedDeliveries,
      successRate: successRate.toFixed(2),
      isHighRisk
    });
  } catch (error) {
    console.error("Fraud Check Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
