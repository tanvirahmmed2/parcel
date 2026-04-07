"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Truck } from "lucide-react";

export default function DeliveryCalculator() {
  const [district, setDistrict] = useState("dhaka");
  const [weight, setWeight] = useState(1);
  const calculateRate = () => {
    let base = district === "dhaka" ? 60 : 120;
    let extra = weight > 1 ? (Math.ceil(weight) - 1) * 20 : 0;
    return base + extra;
  };

  return (
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
  );
}
