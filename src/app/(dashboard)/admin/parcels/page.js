"use client";
import { Search, Package, ChevronLeft, ChevronRight } from "lucide-react";
import useSWR from "swr";
import { useState } from "react";
import axios from "axios";

const fetcher = url => axios.get(url).then(res => res.data);

export default function AdminParcelList() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR(`/api/admin/parcels?page=${page}&limit=10`, fetcher, { 
    fallbackData: { parcels: [], totalPages: 1 } 
  });

  const { parcels, totalPages } = data;

  return (
    <div className="p-8 font-sans">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Global Parcels</h1>
          <p className="text-slate-500">View and manage all parcels across the logistics network.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b bg-slate-50 relative">
            <Search className="w-5 h-5 absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search tracking IDs..." className="pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-lg w-full max-w-sm outline-none focus:ring-2 focus:ring-black transition" />
         </div>
         
         <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
             <tr>
               <th className="p-4 font-semibold">Tracking ID</th>
               <th className="p-4 font-semibold">Merchant</th>
               <th className="p-4 font-semibold">Receiver</th>
               <th className="p-4 font-semibold">Rider</th>
               <th className="p-4 font-semibold">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {isLoading ? <tr><td colSpan="5" className="text-center p-8 text-slate-400 font-medium">Loading network data...</td></tr> : 
              parcels.length === 0 ? <tr><td colSpan="5" className="text-center p-8 text-slate-400 font-medium">No parcels found.</td></tr> :
              parcels.map(p => (
               <tr key={p._id} className="hover:bg-slate-50 transition">
                 <td className="p-4 font-mono font-medium text-slate-900"><Package className="w-4 h-4 inline-block mr-2 text-slate-400"/> {p.trackingId}</td>
                 <td className="p-4 font-medium text-slate-700">{p.merchantId?.storeName || p.merchantId?.name || "N/A"}</td>
                 <td className="p-4 text-slate-600">{p.receiverName} <br/><span className="text-xs text-slate-400">{p.phone}</span></td>
                 <td className="p-4 text-slate-600">{p.riderId ? p.riderId.name : <span className="text-slate-400 italic">Unassigned</span>}</td>
                 <td className="p-4">
                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                     {p.status}
                   </span>
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
