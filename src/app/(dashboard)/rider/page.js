"use client";

import Link from "next/link";
import { QrCode, MapPin, Truck, CheckCircle, Package } from "lucide-react";

export default function RiderDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-12">
      
      {/* Rider Header */}
      <div className="bg-black text-white p-6 rounded-b-[2rem] shadow-lg mb-8 pt-12">
        <div className="flex items-center gap-3 mb-2">
          <Truck className="w-8 h-8" />
          <h1 className="text-2xl font-black tracking-tight">Rider Hub</h1>
        </div>
        <p className="text-slate-300">Welcome back. Drive safe.</p>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Today's Route</p>
            <p className="text-xl font-bold">14 Parcels</p>
          </div>
          <div className="bg-emerald-900 p-4 rounded-2xl border border-emerald-800">
            <p className="text-xs text-emerald-400 uppercase tracking-wider font-bold mb-1">Delivered</p>
            <p className="text-xl font-bold text-emerald-100">8 Parcels</p>
          </div>
        </div>
      </div>

      {/* Massive Hitboxes */}
      <div className="px-4 space-y-4 flex-1">
        
        <Link href="/rider/scan" className="group block bg-black border border-slate-800 text-white rounded-3xl p-8 active:scale-95 transition-transform shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6">
            <QrCode className="w-48 h-48 opacity-10" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="bg-white text-black p-4 rounded-2xl w-fit">
              <QrCode className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black mb-1">Scan & Action</h2>
              <p className="text-slate-400 leading-snug">Quickly scan a barcode to pick up, update, or verify customer OTP.</p>
            </div>
          </div>
        </Link>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white border text-center border-slate-200 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform shadow-sm">
             <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
               <MapPin className="w-8 h-8" />
             </div>
             <span className="font-bold">Next Drop</span>
          </button>
          
          <button className="bg-white border text-center border-slate-200 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform shadow-sm">
             <div className="bg-rose-50 text-rose-600 p-4 rounded-full">
               <CheckCircle className="w-8 h-8" />
             </div>
             <span className="font-bold">My History</span>
          </button>
        </div>

      </div>

    </div>
  );
}
