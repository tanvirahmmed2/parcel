"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Scan, Package, ArrowRight, CheckCircle2, Truck, Clock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/shared/DataTable";

export default function HubClientPage({ initialStats, initialParcels }) {
  const [stats, setStats] = useState(initialStats);
  const [parcels, setParcels] = useState(initialParcels.parcels);
  const [pagination, setPagination] = useState(initialParcels.pagination);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [scanValue, setScanValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const scanInputRef = useRef(null);

  const fetchParcels = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/hub/parcels?page=${page}&limit=10&status=${statusFilter}&search=${search}`);
      setParcels(res.data.parcels);
      setPagination(res.data.pagination);
    } catch (e) {
      toast.error("Failed to load pipeline data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/hub/stats");
      setStats(res.data);
    } catch (e) {}
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!scanValue) return;

    try {
      await axios.patch("/api/hub/parcels", { trackingId: scanValue.trim(), action: "RECEIVE" });
      toast.success(`Parcel ${scanValue} received at hub`);
      setScanValue("");
      fetchParcels();
      fetchStats();
    } catch (e) {
      toast.error(e.response?.data || "Unable to process scan");
    }
  };

  const updateStatus = async (id, action) => {
    try {
      const endpoint = action === "RECEIVE" ? `/api/hub/parcels/${id}/receive` : `/api/hub/parcels/${id}/assign`;
      await axios.patch(endpoint);
      toast.success(action === "RECEIVE" ? "Marked as Received" : "Assigned to Rider");
      fetchParcels();
      fetchStats();
    } catch (e) {
      toast.error(e.response?.data || "Update failed");
    }
  };

  const columns = [
    {
      accessorKey: "trackingId",
      header: "Tracking ID",
      cell: ({ row }) => <span className="font-mono font-bold">{row.original.trackingId}</span>,
    },
    {
      accessorKey: "merchantId.storeName",
      header: "Merchant",
      cell: ({ row }) => <span>{row.original.merchantId?.storeName || row.original.merchantId?.name}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
          row.original.status === "Hub Received" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
          row.original.status === "In Transit" ? "bg-blue-50 text-blue-700 border-blue-100" :
          row.original.status === "Out for Delivery" ? "bg-amber-50 text-amber-700 border-amber-100" :
          "bg-slate-50 text-slate-700 border-slate-100"
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
        accessorKey: "district",
        header: "District",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.status === "In Transit" || row.original.status === "Picked Up" ? (
            <Button size="sm" onClick={() => updateStatus(row.original._id, "RECEIVE")}>
              Receive
            </Button>
          ) : row.original.status === "Hub Received" ? (
            <Button size="sm" variant="secondary" onClick={() => updateStatus(row.original._id, "ASSIGN")}>
              Assign Rider
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-8 font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Hub Operations</h1>
          <p className="text-slate-500">Manage sorting and dispatch logistics for central hub.</p>
        </div>
        <div className="bg-white border rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="bg-slate-100 p-2 rounded-xl">
                <Scan className="w-6 h-6 text-slate-600" />
            </div>
            <form onSubmit={handleScanSubmit} className="flex gap-2">
                <Input 
                    ref={scanInputRef}
                    placeholder="Scan Tracking ID..." 
                    className="w-64"
                    value={scanValue}
                    onChange={(e) => setScanValue(e.target.value)}
                    autoFocus
                />
                <Button type="submit">Process</Button>
            </form>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="In Transit" count={stats.inTransit} icon={Truck} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Hub Received" count={stats.hubReceived} icon={Package} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Out for Delivery" count={stats.outForDelivery} icon={ArrowRight} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Picked Up" count={stats.pickedUp} icon={Clock} color="text-slate-600" bg="bg-slate-50" />
      </div>

      {/* Parcel Management Table */}
      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
           <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-lg">Sorting Pipeline</CardTitle>
                    <CardDescription>Real-time view of parcels currently processed by hub.</CardDescription>
                </div>
                <div className="flex gap-4">
                    <Input 
                        placeholder="Search parcels..." 
                        className="w-64" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchParcels()}
                    />
                    <select 
                        className="bg-white border rounded-md px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-black"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); fetchParcels(); }}
                    >
                        <option value="">All Statuses</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Hub Received">Hub Received</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Picked Up">Picked Up</option>
                    </select>
                </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Synchronizing with hub database...</div>
          ) : (
            <DataTable data={parcels} columns={columns} getRowId={(r) => r._id} />
          )}
        </CardContent>
        {pagination.pages > 1 && (
            <div className="p-4 border-t flex items-center justify-between bg-slate-50/50">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Page {pagination.page} / {pagination.pages}</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchParcels(pagination.page - 1)} disabled={pagination.page === 1}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => fetchParcels(pagination.page + 1)} disabled={pagination.page === pagination.pages}>Next</Button>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ title, count, icon: Icon, color, bg }) {
    return (
        <Card className="border-slate-100 shadow-sm hover:translate-y-[-2px] transition-transform">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`${bg} ${color} p-3 rounded-2xl`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{title}</p>
                    <p className="text-3xl font-black">{count}</p>
                </div>
            </CardContent>
        </Card>
    );
}
