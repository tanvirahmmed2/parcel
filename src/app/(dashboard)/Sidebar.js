"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Package, LogOut, FileSpreadsheet, Building2, User as UserIcon, ChevronLeft, ChevronRight, Bike, Boxes, Clock, QrCode, MapPin, Truck, CheckCircle, Scan } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Sidebar({ user, mobileOpen, setMobileOpen }) {
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

  const sidebarVariants = {
    open: { width: 280, x: 0 },
    collapsed: { width: 90, x: 0 },
    mobileOpen: { x: 0 },
    mobileClosed: { x: -320 }
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        variants={sidebarVariants}
        animate={mobileOpen ? "mobileOpen" : (collapsed ? "collapsed" : "open")}
        className={`fixed lg:relative top-0 bottom-0 left-0 bg-slate-900 text-slate-300 flex flex-col z-50 transition-all duration-300 ease-in-out lg:flex ${mobileOpen ? 'flex' : 'hidden lg:flex'}`}
      >
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="hidden lg:flex absolute -right-3 top-10 bg-white text-slate-900 border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 transition z-50"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'justify-start'} overflow-hidden`}>
          <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-white shrink-0" />
              {!collapsed && (
                  <div className="font-bold text-xl text-white tracking-tight">Parcel</div>
              )}
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <div key={`${link.href}-${link.label}`} className="relative group">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive ? "bg-blue-600 text-white shadow-md" : "hover:bg-slate-800 hover:text-white"
                  } ${collapsed ? 'justify-center px-0 w-12 mx-auto' : 'justify-start'}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{link.label}</span>}
                </Link>
                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] uppercase font-bold tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {link.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { axios.delete("/api/user/session").then(()=> window.location.replace("/login")) }} className={`w-full flex items-center gap-2 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl transition-all ${collapsed ? 'justify-center px-0' : 'justify-center px-4'}`}>
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="font-bold text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
