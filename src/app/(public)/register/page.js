import { Suspense } from "react";
import { Package } from "lucide-react";
import RegisterForm from "./RegisterForm";
export default function RegisterPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-slate-900 font-sans mt-10 mb-10">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#0f172a] text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create an Account</h1>
          <p className="text-slate-500 mt-2 text-center">Join the Parcel Enterprise Logistics network.</p>
        </div>
        <Suspense fallback={<div className="p-8 text-center bg-white rounded-3xl shadow-xl">Loading...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
