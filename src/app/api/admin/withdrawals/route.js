import { requireAuth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Withdrawal } from "@/models/Withdrawal";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await requireAuth(["ADMIN"]);

    await connectToDatabase();

    const withdrawals = await Withdrawal.find({ status: "PENDING" })
      .populate("merchantId", "name storeName bankDetails")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, message: "Withdrawals fetched", data: { withdrawals } });
  } catch (error) {
    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized", data: null }, { status: 401 });
    }
    console.error("Admin withdrawals fetch error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await requireAuth(["ADMIN"]);

    const { withdrawalId, transactionId } = await req.json();

    if (!withdrawalId || !transactionId) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    await connectToDatabase();

    const w = await Withdrawal.findById(withdrawalId);
    if (!w) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    if (w.status === "PAID") {
       return NextResponse.json({ success: false, message: "Already paid" }, { status: 400 });
    }

    w.status = "PAID";
    w.transactionId = transactionId;
    w.paidAt = new Date();
    await w.save();

    return NextResponse.json({ success: true, message: "Payout successful", data: { withdrawal: w } });
  } catch (error) {
    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Unauthorized", data: null }, { status: 401 });
    }
    console.error("Payout error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
