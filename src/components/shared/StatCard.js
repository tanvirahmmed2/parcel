"use client";

import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, title, value, className = "text-slate-900 bg-white border-slate-200" }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`p-6 rounded-2xl border shadow-sm flex items-center gap-4 ${className}`}
    >
      <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100">
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}
