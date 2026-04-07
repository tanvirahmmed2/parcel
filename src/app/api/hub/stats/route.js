import { requireAuth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireAuth(["HUB", "ADMIN"]);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    await connectToDatabase();

    // Stats definitions:
    // In Transit: Incoming to Hub (from Rider/Merchant)
    // Hub Received: Currently in sorting facility
    // Out for Delivery: Dispatched to destination rider
    // Picked Up: Accepted by rider but not yet arrived at hub

    const stats = await Parcel.aggregate([
      {
        $facet: {
          inTransit: [{ $match: { status: "In Transit" } }, { $count: "count" }],
          hubReceived: [{ $match: { status: "Hub Received" } }, { $count: "count" }],
          outForDelivery: [{ $match: { status: "Out for Delivery" } }, { $count: "count" }],
          pickedUp: [{ $match: { status: "Picked Up" } }, { $count: "count" }]
        }
      }
    ]);

    const result = {
      inTransit: stats[0].inTransit[0]?.count || 0,
      hubReceived: stats[0].hubReceived[0]?.count || 0,
      outForDelivery: stats[0].outForDelivery[0]?.count || 0,
      pickedUp: stats[0].pickedUp[0]?.count || 0
    };

    return NextResponse.json(result);
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Hub stats error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
