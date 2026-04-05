import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { Withdrawal } from "@/models/Withdrawal";
import { requireAuth } from "@/lib/auth-shield";

export async function GET(req) {
  try {
    const session = await requireAuth(["MERCHANT", "ADMIN"]);
    await connectToDatabase();

    const merchantId = session.id;

    const parcels = await Parcel.find({ merchantId }).lean();
    const withdrawals = await Withdrawal.find({ merchantId, status: "PAID" }).lean();

    const totalParcels = parcels.length;
    let deliveredStats = 0;
    let returnedStats = 0;
    let totalCOD = 0;
    let totalDeliveryCharge = 0;

    parcels.forEach((p) => {
      if (p.status === "Delivered") {
        deliveredStats++;
        totalCOD += p.codAmount || 0;
        totalDeliveryCharge += p.deliveryCharge || 0;
      }
      if (p.status === "Returned") returnedStats++;
    });

    const netEarnings = totalCOD - totalDeliveryCharge;

    const totalPaidWithdrawals = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const balance = netEarnings - totalPaidWithdrawals;

    const successRate = totalParcels > 0 ? (deliveredStats / totalParcels) * 100 : 0;

    return NextResponse.json({
      success: true,
      message: "Merchant stats retrieved successfully",
      data: {
        totalParcels,
        successRate: successRate.toFixed(1),
        returnedStats,
        netEarnings: netEarnings.toFixed(2),
        balance: balance.toFixed(2),
        parcels
      }
    });
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error; 
    return NextResponse.json({ success: false, message: "Server error", data: null }, { status: 500 });
  }
}
