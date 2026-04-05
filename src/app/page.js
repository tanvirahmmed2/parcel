"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Truck, Zap, ShieldCheck, Calculator, ArrowRight } from "lucide-react";
export default function LandingPage() {
  const [district, setDistrict] = useState("dhaka");
  const [weight, setWeight] = useState(1);
  const calculateRate = () => {
    let base = district === "dhaka" ? 60 : 120;
    let extra = weight > 1 ? (Math.ceil(weight) - 1) * 20 : 0;
    return base + extra;
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Package className="w-8 h-8 text-black" />
          <span className="text-2xl font-black tracking-tight">Percel</span>
        </div>
        <div className="flex gap-4">
          <Link href="/track" className="px-5 py-2.5 font-medium text-slate-600 hover:text-black hover:bg-slate-100 rounded-full transition">Track Parcel</Link>
          <Link href="/auth/login" className="px-5 py-2.5 bg-black text-white font-medium rounded-full shadow-md hover:bg-slate-800 transition">Login</Link>
        </div>
      </nav>
      {}
      <section className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-4 text-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-3xl">
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-tight text-slate-900 mb-6">
            Logistics, <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-black">redefined.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade delivery platform enabling merchants to scale rapidly with real-time tracking, seamless cash cycles, and powerful APIs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login" className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-800 transition shadow-xl hover:shadow-2xl">
              Become a Merchant <ArrowRight className="w-5 h-5"/>
            </Link>
            <Link href="/track" className="flex items-center gap-2 bg-white text-black border border-slate-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-50 transition shadow-sm">
              Track a Package
            </Link>
          </div>
        </motion.div>
      </section>
      {}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          {}
          <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Calculator className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-2">Check Delivery Rate</h3>
              <p className="text-slate-500 mb-8">Instant, transparent pricing calculations.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Area</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setDistrict("dhaka")} className={`py-4 rounded-2xl font-medium border-2 transition ${district === "dhaka" ? "border-black bg-white shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>Inside Dhaka</button>
                    <button onClick={() => setDistrict("outside")} className={`py-4 rounded-2xl font-medium border-2 transition ${district === "outside" ? "border-black bg-white shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>Outside Dhaka</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Approximate Weight (kg)</label>
                  <input type="range" min="1" max="10" step="0.5" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black" />
                  <div className="flex justify-between mt-2 text-sm font-bold text-slate-500">
                    <span>1kg</span>
                    <span className="text-black bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">{weight} kg</span>
                    <span>10kg</span>
                  </div>
                </div>
                <div className="bg-black text-white p-6 rounded-2xl mt-8 flex justify-between items-center shadow-lg">
                  <div>
                    <span className="block text-sm opacity-80 mb-1">Estimated Charge</span>
                    <span className="text-3xl font-black tracking-tight">{calculateRate()} BDT</span>
                  </div>
                  <Truck className="w-10 h-10 opacity-20" />
                </div>
              </div>
            </div>
          </motion.div>
          {}
          <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="space-y-12 pr-4">
            <div>
              <h2 className="text-4xl font-extrabold mb-4">Why Percel?</h2>
              <p className="text-xl text-slate-500 leading-relaxed">We provide bleeding-edge infrastructure to manage hundreds of deliveries a day without missing a beat.</p>
            </div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Real-Time Routing</h4>
                  <p className="text-slate-500">Live WebSockets push status and location updates to your dashboard the moment a rider scans a parcel.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Secure Settlements</h4>
                  <p className="text-slate-500">Automated ledger systems collect COD and instantly route funds to your merchant wallet for payout.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <footer className="bg-slate-900 py-12 text-center text-slate-400 mt-auto">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Package className="w-6 h-6" />
          <span className="text-xl font-black tracking-tight text-white">Percel</span>
        </div>
        <p className="mb-2">© 2026 Percel Logistics. Enterprise Grade.</p>
        <p className="text-sm">A project of <a href="https://disibin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition font-medium">Disibin</a></p>
      </footer>
    </div>
  );
}
