import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { Withdrawal } from "@/models/Withdrawal";
import { DollarSign, Package, AlertCircle, TrendingUp } from "lucide-react";
import ParcelTable from "./components/ParcelTable";

export default async function MerchantDashboard() {
  const session = await auth();
  await connectToDatabase();

  const merchantId = session.user.id;

  // Aggregate stats
  const parcels = await Parcel.find({ merchantId });
  const totalParcels = parcels.length;
  
  let deliveredStats = 0;
  let returnedStats = 0;
  let totalCOD = 0;
  let totalDeliveryCharge = 0;

  parcels.forEach(p => {
    if (p.status === "Delivered") {
        deliveredStats++;
        totalCOD += p.codAmount;
        totalDeliveryCharge += p.deliveryCharge;
    }
    if (p.status === "Returned") returnedStats++;
  });

  const netEarnings = totalCOD - totalDeliveryCharge;
  const successRate = totalParcels > 0 ? (deliveredStats / totalParcels) * 100 : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatCard icon={Package} title="Total Parcels" value={totalParcels} />
         <StatCard icon={TrendingUp} title="Success Rate" value={`${successRate.toFixed(1)}%`} className="text-emerald-600" />
         <StatCard icon={AlertCircle} title="Returned" value={returnedStats} className="text-red-500" />
         <StatCard icon={DollarSign} title="Net Earnings" value={`৳${netEarnings.toFixed(2)}`} className="text-black" />
      </div>

      <ParcelTable initialData={JSON.parse(JSON.stringify(parcels))} />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, className = "text-gray-900" }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-4 rounded-full bg-gray-50 ${className}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className={`text-2xl font-bold ${className}`}>{value}</p>
      </div>
    </div>
  )
}
