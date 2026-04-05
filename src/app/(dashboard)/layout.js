import { requireAuth } from "@/lib/auth-shield";
import Sidebar from "./Sidebar";

export const metadata = {
  title: "Dashboard | Percel",
  description: "Percel Enterprise Portal",
};

export default async function DashboardLayout({ children }) {

  const session = await requireAuth();

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 border-none">
      <Sidebar user={session} />

      {}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-slate-100 -z-0"></div>
        <div className="relative z-10 w-full">
           {children}
        </div>
      </main>
    </div>
  );
}
