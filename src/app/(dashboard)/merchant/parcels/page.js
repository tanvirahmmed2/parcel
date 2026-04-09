"use client";
import { Search, Package, ChevronLeft, ChevronRight, Plus, Trash, Undo2, Eye } from "lucide-react";
import useSWR from "swr";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import ReceiptModal from "@/components/shared/ReceiptModal";

const fetcher = url => axios.get(url).then(res => res.data);

export default function MerchantParcelList() {
  const [page, setPage] = useState(1);
  const [previewParcel, setPreviewParcel] = useState(null);
  const { data, error, isLoading, mutate } = useSWR(`/api/merchant/parcels?page=${page}&limit=10`, fetcher, { 
    fallbackData: { parcels: [], pagination: { total: 0, pages: 1 } } 
  });

  const { parcels, pagination } = data;
  const totalPages = pagination?.pages || 1;

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this parcel?")) return;
    try {
      await axios.delete(`/api/merchant/parcels/${id}`);
      toast.success("Parcel deleted");
      mutate();
    } catch(e) {
      toast.error(e.response?.data || "Unable to delete parcel");
    }
  };

  const handleReturn = async (id) => {
    if (!confirm("Are you sure you want to manually mark this parcel as Returned?")) return;
    try {
      await axios.patch(`/api/merchant/parcels/${id}`, { action: "RETURN" });
      toast.success("Parcel marked as returned");
      mutate();
    } catch(e) {
      toast.error(e.response?.data || "Unable to return parcel");
    }
  };

  return (
    <div className="p-8 font-sans">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Parcels</h1>
          <p className="text-slate-500">View and manage your logistics dispatches.</p>
        </div>
        <Link 
          href="/merchant/parcels/new" 
          className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center shadow-md border border-slate-900"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Parcel
        </Link>
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
               <th className="p-4 font-semibold">Receiver</th>
               <th className="p-4 font-semibold">Date</th>
               <th className="p-4 font-semibold">Status</th>
               <th className="p-4 font-semibold text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {isLoading ? <tr><td colSpan="5" className="text-center p-8 text-slate-400 font-medium">Loading network data...</td></tr> : 
              parcels.length === 0 ? <tr><td colSpan="5" className="text-center p-8 text-slate-400 font-medium">No parcels found.</td></tr> :
              parcels.map(p => (
               <tr key={p._id} className="hover:bg-slate-50 transition">
                 <td className="p-4 font-mono font-medium text-slate-900">
                  <Package className="w-4 h-4 inline-block mr-2 text-slate-400"/> 
                  <Link href={`/track/${p.trackingId}`} className="hover:underline">{p.trackingId}</Link>
                 </td>
                 <td className="p-4 text-slate-600">{p.receiverName} <br/><span className="text-xs text-slate-400">{p.phone}</span></td>
                 <td className="p-4 text-slate-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                 <td className="p-4">
                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                     {p.status}
                   </span>
                 </td>
                 <td className="p-4 text-right space-x-2">
                    <button onClick={() => setPreviewParcel(p)} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 font-medium transition" title="Preview Receipt">
                      <Eye className="w-4 h-4 inline" />
                    </button>
                    {p.status !== 'Delivered' && p.status !== 'Returned' && (
                      <button onClick={() => handleReturn(p._id)} className="text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-medium transition" title="Mark Returned">
                        <Undo2 className="w-4 h-4 inline" />
                      </button>
                    )}
                    {p.status === 'Pending' && (
                      <button onClick={() => handleDelete(p._id)} className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 font-medium transition" title="Delete Parcel">
                        <Trash className="w-4 h-4 inline" />
                      </button>
                    )}
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
