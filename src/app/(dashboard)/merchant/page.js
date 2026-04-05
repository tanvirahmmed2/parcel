"use client";

import useSWR from "swr";
import api from "@/lib/axios";
import { DollarSign, Package, AlertCircle, TrendingUp, Wallet, Loader2 } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import ParcelTable from "@/components/dashboard/merchant/ParcelTable";

const fetcher = (url) => api.get(url).then((res) => res.data.data);

export default function MerchantDashboard() {
  const { data, error, isLoading } = useSWR("/api/merchant/stats", fetcher);

  if (isLoading) return <div className="p-8 min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-slate-400" /></div>;
  if (error || !data) return <div className="p-8 text-red-500 font-bold">Failed to load dashboard data.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-900">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Merchant Portal</h1>
        <p className="text-slate-500 mt-1">Overview of your parcels and financials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
         <StatCard icon={Package} title="Total Parcels" value={data.totalParcels} />
         <StatCard icon={TrendingUp} title="Success Rate" value={`${data.successRate}%`} className="text-emerald-600 bg-emerald-50 border-emerald-100" />
         <StatCard icon={AlertCircle} title="Returned" value={data.returnedStats} className="text-red-500 bg-red-50 py-4 border-red-100" />
         <StatCard icon={DollarSign} title="Net Earnings" value={`৳${data.netEarnings}`} />
         <StatCard icon={Wallet} title="Available Balance" value={`৳${data.balance}`} className="text-black shadow-lg" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Your Parcels</h2>
        </div>
        <ParcelTable initialData={data.parcels} />
      </div>
    </div>
  );
}
