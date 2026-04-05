"use client";
import useSWR from "swr";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Package, Truck, CheckCircle, Activity, Loader2 } from "lucide-react";
import AdminParcelTable from "@/components/dashboard/admin/AdminParcelTable";
import StatCard from "@/components/shared/StatCard";
import api from "@/lib/axios";
const fetcher = url => api.get(url).then(res => res.data.data);
export default function AdminDashboard() {
  const { data, error, isLoading } = useSWR("/api/admin/stats", fetcher);
  if (isLoading) return <div className="p-8 min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-slate-400" /></div>;
  if (error || !data) return <div className="p-8 text-red-500 font-bold">Failed to load system stats.</div>;
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-900">
      {}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Command Center</h1>
        <p className="text-slate-500 mt-1">Real-time overview of the logistics network.</p>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Activity} title="Total Active" value={data.totalOrders} />
        <StatCard icon={CheckCircle} title="Delivered" value={data.delivered} className="text-emerald-600 bg-emerald-50 border-emerald-100" />
        <StatCard icon={Truck} title="In Transit" value={data.transit} className="text-blue-600 bg-blue-50 border-blue-100" />
        <StatCard icon={Package} title="Pending" value={data.pending} />
      </div>
      {}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold mb-6">Delivery Volume Trends</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Active Operations</h2>
          <p className="text-sm text-slate-500">Live feed of all parcels requiring routing or tracking update.</p>
        </div>
        <AdminParcelTable />
      </div>
    </div>
  );
}
