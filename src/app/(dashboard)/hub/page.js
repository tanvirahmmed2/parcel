import { requireAuth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import HubClientPage from "./HubClientPage";
import { redirect } from "next/navigation";

export default async function HubDashboard() {
  const session = await requireAuth(["HUB", "ADMIN"]);
  if (!session) redirect("/login");

  await connectToDatabase();

  // Initial stats fetching
  const statsAggregate = await Parcel.aggregate([
    {
      $facet: {
        inTransit: [{ $match: { status: "In Transit" } }, { $count: "count" }],
        hubReceived: [{ $match: { status: "Hub Received" } }, { $count: "count" }],
        outForDelivery: [{ $match: { status: "Out for Delivery" } }, { $count: "count" }],
        pickedUp: [{ $match: { status: "Picked Up" } }, { $count: "count" }]
      }
    }
  ]);

  const initialStats = {
    inTransit: statsAggregate[0].inTransit[0]?.count || 0,
    hubReceived: statsAggregate[0].hubReceived[0]?.count || 0,
    outForDelivery: statsAggregate[0].outForDelivery[0]?.count || 0,
    pickedUp: statsAggregate[0].pickedUp[0]?.count || 0
  };

  // Initial parcels fetching
  const parcels = await Parcel.find({ 
    status: { $in: ["In Transit", "Hub Received", "Out for Delivery", "Picked Up"] } 
  })
    .sort({ updatedAt: -1 })
    .limit(10)
    .populate("merchantId", "name storeName")
    .lean();

  const total = await Parcel.countDocuments({ 
    status: { $in: ["In Transit", "Hub Received", "Out for Delivery", "Picked Up"] } 
  });

  const initialParcels = {
    parcels: JSON.parse(JSON.stringify(parcels)),
    pagination: {
      total,
      page: 1,
      limit: 10,
      pages: Math.ceil(total / 10)
    }
  };

  return <HubClientPage initialStats={initialStats} initialParcels={initialParcels} />;
}
