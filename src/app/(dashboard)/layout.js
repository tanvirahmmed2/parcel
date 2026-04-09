import { requireAuth } from "@/lib/auth-shield";
import Sidebar from "./Sidebar";

export const metadata = {
  title: "Dashboard | Parcel",
  description: "Parcel Enterprise Portal",
};

export default async function DashboardLayout({ children }) {

  const session = await requireAuth();

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden antialiased">
      <Sidebar user={session} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 relative">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-slate-200/50 to-transparent pointer-events-none"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-100/30 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-indigo-100/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
