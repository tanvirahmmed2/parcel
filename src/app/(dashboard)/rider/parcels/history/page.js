"use client";
import { Search, Package, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Eye } from "lucide-react";
import useSWR from "swr";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import ReceiptModal from "@/components/shared/ReceiptModal";

const fetcher = url => axios.get(url).then(res => res.data);

export default function RiderHistoryParcels() {
  const [page, setPage] = useState(1);
  const [previewParcel, setPreviewParcel] = useState(null);
  const { data, error, isLoading } = useSWR(`/api/rider/parcels?type=history&page=${page}&limit=10`, fetcher, { 
    fallbackData: { parcels: [], pagination: { total: 0, pages: 1 } } 
  });

  const { parcels, pagination } = data;
  const totalPages = pagination?.pages || 1;

  return (
    <div className="p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Delivery History</h1>
        <p className="text-slate-500">Review your successfully completed runs and returned items.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b bg-slate-50 relative">
            <Search className="w-5 h-5 absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-lg w-full max-sm outline-none focus:ring-2 focus:ring-black transition" />
          </div>
         
         <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
             <tr>
               <th className="p-4 font-semibold">Log ID</th>
               <th className="p-4 font-semibold">Customer</th>
               <th className="p-4 font-semibold">Completed</th>
               <th className="p-4 font-semibold">Status</th>
               <th className="p-4 font-semibold text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {isLoading ? <tr><td colSpan="5" className="text-center p-8 text-slate-400 font-medium">Loading history logs...</td></tr> : 
              parcels.length === 0 ? <tr><td colSpan="5" className="text-center p-8 text-slate-400 font-medium">No history recorded yet. Keep on driving!</td></tr> :
              parcels.map(p => (
               <tr key={p._id} className="hover:bg-slate-50 transition text-slate-600">
                 <td className="p-4 font-mono font-medium text-slate-900">
                    <div className="flex items-center">
                        <Package className="w-4 h-4 inline-block mr-2 text-slate-400"/> 
                        <Link href={`/track/${p.trackingId}`} className="hover:underline">{p.trackingId}</Link>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{p.merchantId?.storeName}</div>
                 </td>
                 <td className="p-4">
                    <div className="font-medium text-slate-800">{p.receiverName}</div>
                    <div className="text-xs text-slate-500">{p.phone}</div>
                 </td>
                 <td className="p-4">
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "N/A"}
                 </td>
                 <td className="p-4">
                    {p.status === "Delivered" ? (
                        <span className="flex items-center text-emerald-600 font-bold">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Delivered
                        </span>
                    ) : (
                        <span className="flex items-center text-rose-600 font-bold">
                            <XCircle className="w-4 h-4 mr-1.5" />
                            {p.status}
                        </span>
                    )}
                 </td>
                 <td className="p-4 text-right">
                    <button onClick={() => setPreviewParcel(p)} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 font-medium transition" title="Preview Receipt">
                       <Eye className="w-4 h-4 inline" />
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

      <ReceiptModal 
        isOpen={!!previewParcel} 
        onClose={() => setPreviewParcel(null)} 
        parcel={previewParcel} 
      />
    </div>
  );
}
