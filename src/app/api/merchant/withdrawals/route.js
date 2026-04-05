import { requireAuth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Withdrawal } from "@/models/Withdrawal";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const user = await requireAuth(["MERCHANT"]);

    await connectToDatabase();

    const deliveredParcels = await Parcel.find({ merchantId: user.id, status: "Delivered" }).lean();

    let totalCOD = 0;
    let totalDeliveryCharge = 0;
    deliveredParcels.forEach(p => {
      totalCOD += p.codAmount || 0;
      totalDeliveryCharge += p.deliveryCharge || 0;
    });

    const netEarnings = totalCOD - totalDeliveryCharge;

    const withdrawals = await Withdrawal.find({ merchantId: user.id }).sort({ createdAt: -1 }).lean();

    let withdrawnTotal = 0;
    let pendingWithdrawalTotal = 0;

    withdrawals.forEach(w => {
      if (w.status === "PAID") withdrawnTotal += w.amount;
      if (w.status === "PENDING" || w.status === "APPROVED") pendingWithdrawalTotal += w.amount;
    });

    const availableBalance = netEarnings - withdrawnTotal - pendingWithdrawalTotal;

    return NextResponse.json({
      success: true,
      message: "Ledger fetched.",
      data: {
        stats: {
          totalCOD,
          totalDeliveryCharge,
          netEarnings,
          withdrawnTotal,
          pendingWithdrawalTotal,
          availableBalance
        },
        withdrawals
      }
    });

  } catch (error) {
    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized", data: null }, { status: 401 });
    }
    console.error("Fetch withdrawals error:", error);
    return NextResponse.json({ success: false, message: "Internal server error", data: null }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await requireAuth(["MERCHANT"]);

    const { amount } = await req.json();
    if (!amount || amount <= 0) {
       return NextResponse.json({ success: false, message: "Invalid amount", data: null }, { status: 400 });
    }

    await connectToDatabase();

    const deliveredParcels = await Parcel.find({ merchantId: user.id, status: "Delivered" }).lean();
    let netEarnings = 0;
    deliveredParcels.forEach(p => netEarnings += (p.codAmount || 0) - (p.deliveryCharge || 0));

    const withdrawals = await Withdrawal.find({ merchantId: user.id }).lean();
    let totalDeductions = 0;
    withdrawals.forEach(w => totalDeductions += w.amount);

    const availableBalance = netEarnings - totalDeductions;

    if (amount > availableBalance) {
      return NextResponse.json({ success: false, message: "Insufficient balance", data: null }, { status: 400 });
    }

    const w = await Withdrawal.create({
      merchantId: user.id,
      amount,
      status: "PENDING"
    });

    return NextResponse.json({ success: true, message: "Withdrawal requested", data: w }, { status: 201 });
  } catch (error) {
    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized", data: null }, { status: 401 });
    }
    console.error("Create withdrawal error:", error);
    return NextResponse.json({ success: false, message: "Internal server error", data: null }, { status: 500 });
  }
}
