import Link from "next/link";
import { Clock } from "lucide-react";

export default function AccountPendingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center font-sans">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-amber-100 max-w-lg w-full flex flex-col items-center">
         <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6">
           <Clock className="w-12 h-12" />
         </div>
         <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Account Pending</h1>
         <p className="text-lg text-slate-500 mb-8 leading-relaxed">
           Your merchant application has been successfully submitted and is currently under review by our administration team. You will receive an email once approved.
         </p>
         <Link href="/api/auth/signout" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition w-full shadow-md">
           Sign Out
         </Link>
      </div>
    </div>
  );
}
