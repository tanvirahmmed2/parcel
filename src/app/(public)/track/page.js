"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
export default function GlobalTracker() {
  const [trackingId, setTrackingId] = useState("");
  const router = useRouter();
  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim().length > 0) {
      router.push(`/track/${trackingId.trim().toUpperCase()}`);
    }
  };
  return (
    <>
      {}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-100/50 shadow-2xl shadow-blue-900/5 mb-20 mx-6">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Where is your package?</h1>
          <p className="text-xl text-slate-500 mb-10">Enter your Parcel Tracking ID below for real-time updates.</p>
          <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl rounded-full bg-white transition hover:shadow-xl group border border-slate-200">
            <Search className="absolute left-6 w-7 h-7 text-slate-400 group-focus-within:text-black transition" />
            <input 
              type="text" 
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full py-6 pl-16 pr-32 text-xl font-mono tracking-widest bg-transparent outline-none rounded-full placeholder-slate-300"
              required
            />
            <button 
              type="submit" 
              className="absolute right-3 bg-black text-white p-4 rounded-full hover:bg-slate-800 transition"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </form>
          <div className="mt-12 opacity-50 flex flex-col items-center">
            <p className="text-sm font-medium uppercase tracking-widest mb-4">Trusted by over 10,000 merchants</p>
            <div className="flex gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-12 h-1 bg-slate-300 rounded-full" />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
