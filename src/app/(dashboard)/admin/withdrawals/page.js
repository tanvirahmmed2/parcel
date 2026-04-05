"use client";

import useSWR from "swr";
import { Banknote, CheckCircle, Database, LayoutList, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";

const fetcher = url => axios.get(url).then(res => res.data.data.withdrawals);

export default function WithdrawalQueue() {
  const { data: withdrawals, error, isLoading, mutate } = useSWR("/api/admin/withdrawals", fetcher, { fallbackData: [] });
  const [processingId, setProcessingId] = useState(null);

  const processPayment = async (withdrawalId) => {
    const transactionId = prompt("Enter Bank/Mobile Banking Transaction ID to confirm payout:");
    if (!transactionId) {
       toast.error("Transaction ID is strictly required to clear ledgers.");
       return;
    }

    setProcessingId(withdrawalId);
    try {
      const res = await axios.patch("/api/admin/withdrawals", { withdrawalId, transactionId });
      toast.success(res.data?.message || "Transaction marked as PAID");
      mutate();
    } catch(e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto">

      <div className="flex items-center gap-4 mb-8 border-b border-slate-200 pb-6">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
          <Banknote className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Enterprise Ledgers</h1>
          <p className="text-slate-500">Process Merchant Withdrawal Requests atomically.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
           <h2 className="font-bold flex items-center gap-2"><LayoutList className="w-4 h-4"/> Pending Pipeline</h2>
        </div>
        <table className="w-full text-left text-sm">
           <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-500 font-semibold">
             <tr>
               <th className="p-5">Merchant Details</th>
               <th className="p-5 text-right">Amount (BDT)</th>
               <th className="p-5">Status</th>
               <th className="p-5 text-right">Clearance</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-slate-700">
             {isLoading ? <tr><td colSpan="4" className="text-center p-8 text-slate-400">Loading ledger...</td></tr> : 
               withdrawals?.map(w => (
                 <tr key={w._id} className="hover:bg-slate-50">
                    <td className="p-5 font-mono text-xs flex flex-col gap-1">
                       <span className="font-bold text-slate-900 font-sans text-sm">{w.merchantId?.name || "Unknown"}</span>
                       <span className="text-slate-500">{w.merchantId?._id || w.merchantId}</span>
                    </td>
                    <td className="p-5 text-right text-lg font-black tracking-tight">{w.amount.toFixed(2)}</td>
                    <td className="p-5">
                       <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{w.status}</span>
                    </td>
                    <td className="p-5 text-right">
                       <button disabled={processingId === w._id} onClick={() => processPayment(w._id)} className="flex items-center justify-end gap-2 w-full text-black hover:text-emerald-600 font-bold tracking-tight transition disabled:opacity-50">
                          {processingId === w._id ? <Loader2 className="w-5 h-5 animate-spin"/> : "Process Payment"} {!processingId && <CheckCircle className="w-5 h-5" />}
                       </button>
                    </td>
                 </tr>
               ))
             }
             {!isLoading && (!withdrawals || withdrawals.length === 0) && <tr><td colSpan="4" className="text-center p-12 text-slate-400 font-medium">The queue is completely clear.</td></tr>}
           </tbody>
        </table>
      </div>

    </div>
  );
}
