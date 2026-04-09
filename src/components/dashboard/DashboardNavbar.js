"use client";

import { LayoutDashboard, Menu, Search, Bell } from "lucide-react";

export default function DashboardNavbar({ user, onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div>
          <p className="text-sm font-semibold text-slate-900 leading-none capitalize">{user?.role?.toLowerCase()} Panel</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Desktop Search */}
        <div className="hidden md:flex items-center bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 w-64 group focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-slate-400"
          />
        </div>

        <button className="relative p-2.5 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 ml-2">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-wider mt-1">{user?.role}</p>
           </div>
           <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-black/10">
              {user?.name?.charAt(0)}
           </div>
        </div>
      </div>
    </header>
  );
}
