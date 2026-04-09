import React from "react";
import { X } from "lucide-react";
import ParcelReceipt from "./ParcelReceipt";

export default function ReceiptModal({ isOpen, onClose, parcel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar p-1 text-center">
          <ParcelReceipt parcel={parcel} />
        </div>
      </div>
    </div>
  );
}
