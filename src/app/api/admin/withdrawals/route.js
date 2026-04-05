import { isAdmin } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/db";
import { Withdrawal } from "@/models/Withdrawal";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const user = await isAdmin();

    await connectToDatabase();
    
    // Fetch pending withdrawals, populate merchant details
    const withdrawals = await Withdrawal.find({ status: "PENDING" })
      .populate("merchantId", "name storeName bankDetails")
      .sort({ createdAt: -1 });

    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error("Admin withdrawals fetch error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const user = await isAdmin();

    const { withdrawalId, transactionId } = await req.json();

    if (!withdrawalId || !transactionId) {
      return new NextResponse("Missing data", { status: 400 });
    }

    await connectToDatabase();

    const w = await Withdrawal.findById(withdrawalId);
    if (!w) return new NextResponse("Not found", { status: 404 });

    w.status = "PAID";
    w.transactionId = transactionId;
    w.paidAt = new Date();
    await w.save();

    return NextResponse.json({ success: true, withdrawal: w });
  } catch (error) {
    console.error("Payout error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
