"use client";

import { useState } from "react";
import Sidebar from "@/app/(dashboard)/Sidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default function DashboardClientLayout({ user, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden antialiased">
      <Sidebar user={user} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 relative">
        <DashboardNavbar user={user} onMenuClick={() => setMobileOpen(true)} />

        <div className="relative flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="max-w-[1600px] mx-auto min-h-full px-4 py-8 md:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
