import Link from "next/link";
import { Package } from "lucide-react";

export default function PublicNavbar() {
  return (
    <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <Package className="w-8 h-8 text-black" />
          <span className="text-2xl font-black tracking-tight">Percel</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link 
            href="/track" 
            className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-black hover:bg-slate-100 rounded-full transition"
          >
            Track Parcel
          </Link>
          <Link 
            href="/login" 
            className="px-5 py-2 text-sm bg-black text-white font-medium rounded-full shadow-md hover:bg-slate-800 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
