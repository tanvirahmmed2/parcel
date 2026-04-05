"use client";
import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";
const fetcher = url => axios.get(url).then(res => res.data);
export default function AdminParcelTable() {
  const { data, error, isLoading, mutate } = useSWR("/api/admin/parcels/bulk", fetcher);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  if (isLoading) return <div className="p-8 h-64 flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-black" /></div>;
  if (error) return <div className="p-8 text-red-500 font-bold">Failed to load system parcels.</div>;
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(data.parcels.map((p) => p._id));
    else setSelectedIds([]);
  };
  const handleSelect = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const updateStatus = async (status) => {
    if (selectedIds.length === 0) return toast.error("Select parcels first");
    setIsUpdating(true);
    try {
      const res = await axios.patch("/api/admin/parcels/bulk", { ids: selectedIds, status });
      toast.success(`Updated ${selectedIds.length} parcels to ${status}`);
      mutate();
      setSelectedIds([]);
    } catch(e) {
      toast.error(e.message);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="glass-panel overflow-hidden rounded-xl">
      <div className="p-4 border-b bg-white/50 backdrop-blur-sm flex items-center justify-between">
        <div className="space-x-2 text-sm text-slate-600">
            <span className="font-bold text-black">{selectedIds.length}</span> selected
        </div>
        <div className="space-x-2">
          <button disabled={isUpdating || selectedIds.length === 0} onClick={() => updateStatus("Picked Up")} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition disabled:opacity-50 border border-slate-200">Set Picked Up</button>
          <button disabled={isUpdating || selectedIds.length === 0} onClick={() => updateStatus("Hub Received")} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-medium hover:bg-blue-100 transition disabled:opacity-50">Set Hub</button>
          <button disabled={isUpdating || selectedIds.length === 0} onClick={() => updateStatus("Delivered")} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50 shadow-md">Force Complete</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#f8fafc]/80 backdrop-blur-sm text-slate-500 border-b border-slate-100 sticky top-0 z-10">
            <tr>
              <th className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={data?.parcels?.length > 0 && selectedIds.length === data.parcels.length} className="rounded border-slate-300 pointer" /></th>
              <th className="p-4 font-semibold uppercase tracking-wider text-xs">Tracking ID</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-xs">Merchant</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-xs">Customer</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-xs">Destination</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.parcels.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4"><input type="checkbox" checked={selectedIds.includes(p._id)} onChange={() => handleSelect(p._id)}/></td>
                  <td className="p-4 font-mono font-medium text-xs bg-slate-100 px-2 py-1 rounded inline-block mt-3 ml-2">{p.trackingId}</td>
                  <td className="p-4 font-medium">{p.merchantId?.name || "Unknown"}</td>
                  <td className="p-4">{p.receiverName} <br/><span className="text-xs text-slate-400">{p.phone}</span></td>
                  <td className="p-4">{p.district}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                      {p.status}
                    </span>
                  </td>
              </tr>
            ))}
            {data.parcels.length === 0 && <tr><td colSpan="6" className="p-12 text-center text-slate-500">No active parcels.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
