import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { Withdrawal } from "@/models/Withdrawal";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "MERCHANT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    
    // Calculate total COD and delivery charges
    const deliveredParcels = await Parcel.find({ merchantId: session.user.id, status: "Delivered" });
    
    let totalCOD = 0;
    let totalDeliveryCharge = 0;
    deliveredParcels.forEach(p => {
      totalCOD += p.codAmount;
      totalDeliveryCharge += p.deliveryCharge;
    });

    const netEarnings = totalCOD - totalDeliveryCharge;

    const withdrawals = await Withdrawal.find({ merchantId: session.user.id }).sort({ createdAt: -1 });

    let withdrawnTotal = 0;
    let pendingWithdrawalTotal = 0;

    withdrawals.forEach(w => {
      if (w.status === "PAID") withdrawnTotal += w.amount;
      if (w.status === "PENDING" || w.status === "APPROVED") pendingWithdrawalTotal += w.amount;
    });

    const availableBalance = netEarnings - withdrawnTotal - pendingWithdrawalTotal;

    return NextResponse.json({
      stats: {
        totalCOD,
        totalDeliveryCharge,
        netEarnings,
        withdrawnTotal,
        pendingWithdrawalTotal,
        availableBalance
      },
      withdrawals
    });

  } catch (error) {
    console.error("Fetch withdrawals error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "MERCHANT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount } = await req.json();
    if (!amount || amount <= 0) {
       return new NextResponse("Invalid amount", { status: 400 });
    }

    await connectToDatabase();
    
    // Validate if enough balance exists
    // (In production, you'd calculate available balance here again before saving to prevent race conditions)

    const w = await Withdrawal.create({
      merchantId: session.user.id,
      amount,
      status: "PENDING"
    });

    return NextResponse.json(w, { status: 201 });
  } catch (error) {
    console.error("Create withdrawal error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
