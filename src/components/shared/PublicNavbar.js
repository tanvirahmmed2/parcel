"use client";
import Link from "next/link";
import { Package, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 bg-white shadow-sm z-50 border-b border-slate-100">
      <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <Package className="w-8 h-8 text-black" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">Parcel</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/track" className="text-sm font-bold text-slate-600 hover:text-black transition">Track Parcel</Link>
          <Link 
            href="/login" 
            className="px-6 py-2.5 text-sm bg-black text-white font-bold rounded-xl shadow-lg shadow-black/10 hover:bg-slate-800 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-600">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
               <Link onClick={() => setIsOpen(false)} href="/track" className="text-lg font-bold text-slate-800">Track Parcel</Link>
               <Link onClick={() => setIsOpen(false)} href="/login" className="text-lg font-bold text-slate-800">Sign In</Link>
               <hr className="border-slate-50" />
               <Link onClick={() => setIsOpen(false)} href="/register" className="text-lg font-bold text-blue-600">Create Merchant Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
