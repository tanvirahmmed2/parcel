import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-rose-100 max-w-lg w-full flex flex-col items-center">
         <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6">
           <ShieldAlert className="w-12 h-12" />
         </div>
         <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Access Denied</h1>
         <p className="text-lg text-slate-500 mb-8 leading-relaxed">
           You do not have the required permissions to access this control sector. If you believe this is an error, please contact your administrator.
         </p>
         <Link href="/" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition w-full shadow-md">
           Return Home
         </Link>
      </div>
    </div>
  );
}
