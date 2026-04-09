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
    <motion.div 
      initial={{ x: -20, opacity: 0 }} 
      whileInView={{ x: 0, opacity: 1 }} 
      viewport={{ once: true }} 
      className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
        <Calculator className="w-48 h-48 text-slate-900" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
           <Calculator className="w-6 h-6 text-blue-600" />
           <h3 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">Check Rates</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Delivery Area</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDistrict("dhaka")} 
                className={`py-3.5 rounded-xl font-bold border-2 transition-all ${district === "dhaka" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-100 text-slate-500 hover:border-slate-200"}`}
              >
                Dhaka
              </button>
              <button 
                onClick={() => setDistrict("outside")} 
                className={`py-3.5 rounded-xl font-bold border-2 transition-all ${district === "outside" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-100 text-slate-500 hover:border-slate-200"}`}
              >
                Outside
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weight (kg)</label>
               <span className="text-xl font-bold text-slate-900">{weight} kg</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="0.5" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))} 
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 transition-all" 
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              <span>1kg</span>
              <span>10kg</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 text-center">Estimated Cost</span>
              <span className="text-3xl font-bold text-blue-600">
                ৳{calculateRate()}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100">
               <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-400 font-medium">
            * Final rates depend on actual measurements.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
