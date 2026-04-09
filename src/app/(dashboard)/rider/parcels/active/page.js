"use client";
import { Search, Package, ChevronLeft, ChevronRight, QrCode, MapPin, Eye } from "lucide-react";
import useSWR from "swr";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import ReceiptModal from "@/components/shared/ReceiptModal";

const fetcher = url => axios.get(url).then(res => res.data);

export default function RiderActiveParcels() {
  const [page, setPage] = useState(1);
  const [previewParcel, setPreviewParcel] = useState(null);
  const { data, error, isLoading } = useSWR(`/api/rider/parcels?type=active&page=${page}&limit=10`, fetcher, { 
    fallbackData: { parcels: [], pagination: { total: 0, pages: 1 } } 
  });

  const { parcels, pagination } = data;
  const totalPages = pagination?.pages || 1;

  return (
    <div className="p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Active Deliveries</h1>
        <p className="text-slate-500">Track and update your currently dispatched parcels.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b bg-slate-50 relative">
            <Search className="w-5 h-5 absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-lg w-full max-w-sm outline-none focus:ring-2 focus:ring-black transition" />
         </div>
         
         <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
             <tr>
               <th className="p-4 font-semibold">Tracking ID</th>
               <th className="p-4 font-semibold">Destination</th>
               <th className="p-4 font-semibold">Status</th>
               <th className="p-4 font-semibold text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {isLoading ? <tr><td colSpan="4" className="text-center p-8 text-slate-400 font-medium">Loading active pipeline...</td></tr> : 
              parcels.length === 0 ? <tr><td colSpan="4" className="text-center p-8 text-slate-400 font-medium">No active deliveries. Ready for a new hub run?</td></tr> :
              parcels.map(p => (
               <tr key={p._id} className="hover:bg-slate-50 transition">
                 <td className="p-4">
                    <div className="font-mono font-medium text-slate-900 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-slate-400"/> 
                        {p.trackingId}
                    </div>
                    <div className="text-xs text-slate-400">{p.merchantId?.storeName}</div>
                 </td>
                 <td className="p-4 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                    <div>
                        <div className="font-medium text-slate-800">{p.receiverName}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{p.address}, {p.district}</div>
                    </div>
                 </td>
                 <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {p.status}
                    </span>
                 </td>
                 <td className="p-4 text-right space-x-2">
                    <button onClick={() => setPreviewParcel(p)} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 font-medium transition" title="Preview Receipt">
                       <Eye className="w-4 h-4 inline" />
                    </button>
                    <Link 
                        href="/rider/scan" 
                        className="text-black hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition inline-flex items-center"
                        title="Update Status"
                    >
                        <QrCode className="w-4 h-4 mr-2" />
                        Update
                    </Link>
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

      <ReceiptModal 
        isOpen={!!previewParcel} 
        onClose={() => setPreviewParcel(null)} 
        parcel={previewParcel} 
      />
    </div>
  );
}
