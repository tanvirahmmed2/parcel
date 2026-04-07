"use client";

import { Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ScannerActions({ data, updating, onUpdateStatus }) {
  if (data === "No result" || !data) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit mb-2">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">QR Acquired</span>
      </div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest hidden">Payload</span>
        <span className="font-mono text-xs bg-slate-100 p-2 text-center font-bold tracking-widest rounded truncate">{data}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button 
          onClick={() => onUpdateStatus("IN_TRANSIT")}
          disabled={updating}
          className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800 py-3 rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50"
        >
            Out for Delivery
        </button>
        <button 
          onClick={() => onUpdateStatus("DELIVERED")}
          disabled={updating}
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 py-3 rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50"
        >
            Mark Delivered
        </button>
        <button 
          onClick={() => onUpdateStatus("REFUSED")}
          disabled={updating}
          className="col-span-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 py-3 rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Customer Refused"}
        </button>
      </div>
    </motion.div>
  );
}
