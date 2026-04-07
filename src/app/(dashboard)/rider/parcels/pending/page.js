"use client";
import { Search, Package, ChevronLeft, ChevronRight, Check } from "lucide-react";
import useSWR from "swr";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const fetcher = url => axios.get(url).then(res => res.data);

export default function RiderPendingParcels() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, mutate } = useSWR(`/api/rider/parcels?type=pending&page=${page}&limit=10`, fetcher, { 
    fallbackData: { parcels: [], pagination: { total: 0, pages: 1 } } 
  });

  const { parcels, pagination } = data;
  const totalPages = pagination?.pages || 1;

  const handleAccept = async (id) => {
    if (!confirm("Confirm parcel dispatch? This will bind you as the active rider.")) return;
    try {
      await axios.patch(`/api/rider/parcels/${id}/accept`);
      toast.success("Parcel accepted for dispatch");
      mutate();
    } catch(e) {
      toast.error(e.response?.data || "Unable to accept parcel");
    }
  };

  return (
    <div className="p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Available Parcels</h1>
        <p className="text-slate-500">Discover and accept pending deliveries in your area.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b bg-slate-50 relative">
            <Search className="w-5 h-5 absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search tracking IDs..." className="pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-lg w-full max-w-sm outline-none focus:ring-2 focus:ring-black transition" />
         </div>
         
         <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
             <tr>
               <th className="p-4 font-semibold">Details</th>
               <th className="p-4 font-semibold">Pickup From</th>
               <th className="p-4 font-semibold">Delivery To</th>
               <th className="p-4 font-semibold">Spec</th>
               <th className="p-4 font-semibold text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {isLoading ? <tr><td colSpan="5" className="text-center p-8 text-slate-400 font-medium">Loading available stock...</td></tr> : 
              parcels.length === 0 ? <tr><td colSpan="5" className="text-center p-8 text-slate-400 font-medium">No pending parcels available at this time.</td></tr> :
              parcels.map(p => (
               <tr key={p._id} className="hover:bg-slate-50 transition">
                 <td className="p-4">
                    <div className="font-mono font-medium text-slate-900 mb-1 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-slate-400"/> 
                        {p.trackingId}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {p.deliveryType}
                    </span>
                 </td>
                 <td className="p-4">
                    <div className="font-medium text-slate-800">{p.merchantId?.storeName || "Unknown Store"}</div>
                    <div className="text-xs text-slate-500">{p.merchantId?.phone}</div>
                 </td>
                 <td className="p-4">
                    <div className="font-medium text-slate-800">{p.receiverName}</div>
                    <div className="text-xs text-slate-500">{p.district}</div>
                 </td>
                 <td className="p-4 text-slate-600">
                    <div>{p.weight} kg</div>
                    <div className="font-bold text-black">৳{p.codAmount}</div>
                 </td>
                 <td className="p-4 text-right">
                    <button 
                        onClick={() => handleAccept(p._id)} 
                        className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition flex items-center ml-auto shadow-sm"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Accept Dispatch
                    </button>
                 </td>
               </tr>
              ))}
           </tbody>
         </table>

         {/* Pagination Controls */}
         <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
           <span className="text-sm text-slate-500 font-medium">
             Page {page} of {Math.max(1, totalPages)}
           </span>
           <div className="flex gap-2">
             <button 
               onClick={() => setPage(p => Math.max(1, p - 1))} 
               disabled={page === 1}
               className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition"
             >
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
               disabled={page >= totalPages}
               className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition"
             >
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
         </div>
      </div>
    </div>
  );
}
