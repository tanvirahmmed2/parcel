"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Package, LogOut, FileSpreadsheet, Building2, User as UserIcon, ChevronLeft, ChevronRight, Bike, Boxes, Clock, QrCode, MapPin, Truck, CheckCircle, Scan } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Sidebar({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const { role, name } = user;

  const links = [
    ...(role === "MERCHANT" ? [
      { href: "/merchant", icon: LayoutDashboard, label: "Overview" },
      { href: "/merchant/parcels", icon: Package, label: "My Parcels" },
      { href: "/merchant/business", icon: Building2, label: "Business Hub" },
      { href: "/merchant/wallet", icon: FileSpreadsheet, label: "Wallet" },
    ] : []),
    ...(role === "ADMIN" ? [
      { href: "/admin", icon: LayoutDashboard, label: "Command Center" },
      { href: "/admin/merchants", icon: Building2, label: "Merchants" },
      { href: "/admin/riders", icon: Bike, label: "Riders" },
      { href: "/admin/hubs", icon: Boxes, label: "Hub Management" },
      { href: "/admin/parcels", icon: Boxes, label: "All Parcels" },
      { href: "/admin/parcels/pending", icon: Clock, label: "Pending Parcels" },
      { href: "/admin/withdrawals", icon: FileSpreadsheet, label: "Withdrawals" },
      { href: "/admin/map", icon: UserIcon, label: "Map" },
    ] : []),
    ...(role === "RIDER" ? [
      { href: "/rider", icon: LayoutDashboard, label: "Rider Hub" },
      { href: "/rider/scan", icon: QrCode, label: "Scanner Tool" },
      { href: "/rider/parcels/pending", icon: MapPin, label: "Available Dispatches" },
      { href: "/rider/parcels/active", icon: Truck, label: "Active Deliveries" },
      { href: "/rider/parcels/history", icon: CheckCircle, label: "My History" },
    ] : []),
    ...(role === "HUB" ? [
      { href: "/hub", icon: LayoutDashboard, label: "Hub Overview" },
      { href: "/hub", icon: Scan, label: "Sorting Tools" },
    ] : []),
    { href: "/profile", icon: UserIcon, label: "My Profile" },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="bg-[#0f172a] text-slate-300 flex flex-col relative z-20 shadow-2xl h-full"
    >
      <button 
        onClick={() => setCollapsed(!collapsed)} 
        className="absolute -right-3 top-8 bg-white text-slate-900 border border-slate-200 rounded-full p-1 shadow-md hover:bg-slate-50 transition"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'justify-start'} overflow-hidden whitespace-nowrap`}>
        <div className="flex items-center gap-3">
            <Package className={`shrink-0 ${collapsed ? 'w-8 h-8 text-white' : 'w-7 h-7 text-white'}`} />
            <AnimatePresence>
            {!collapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                <h1 className="text-xl font-bold tracking-tight text-white">Percel</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{role}</p>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto overflow-x-hidden">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <div key={link.href} className="relative group">
              <Link
                href={link.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 hover:text-white"
                } ${collapsed ? 'justify-center' : 'justify-start'}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="font-medium text-sm whitespace-nowrap">{link.label}</span>}
              </Link>
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {link.label}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-3 mb-4 ${collapsed ? 'justify-center' : 'px-2'}`}>
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold shrink-0 text-white shadow-inner">
            {name?.charAt(0) || "U"}
          </div>
          {!collapsed && <div className="text-sm font-medium truncate text-white whitespace-nowrap">{name}</div>}
        </div>
        <button onClick={() => { axios.delete("/api/user/session").then(()=> window.location.replace("/login")) }} className={`w-full flex items-center gap-2 bg-slate-800 hover:bg-rose-900 hover:text-rose-100 py-2.5 rounded-xl transition-colors ${collapsed ? 'justify-center px-0' : 'justify-center px-4'}`} title={collapsed ? "Log Out" : ""}>
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Log Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
