"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import toast from "react-hot-toast";
import axios from "@/lib/axios";

export default function RegisterForm() {
  const router = useRouter();

  const registerAction = async (prevState, formData) => {
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await axios.post("/api/user", data);
      if (res.data.success) {
        toast.success(res.data.message || "Registration successful!");
        window.location.replace("/account-pending");
        return { success: true };
      }
      return { error: res.data.message || "Registration failed" };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration error encountered.";
      toast.error(msg);
      return { error: msg };
    }
  };

  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <form action={formAction} className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Full Name</label>
          <input 
            type="text" 
            name="name"
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Store Name</label>
          <input 
            type="text" 
            name="storeName"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Email Address</label>
          <input 
            type="email" 
            name="email"
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div className="space-y-1">
           <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <input 
              type="text" 
              name="phone"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <input 
            type="password" 
            name="password"
            required
            minLength={6}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Apply As</label>
          <select name="role" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold appearance-none">
            <option value="MERCHANT">Merchant</option>
            <option value="RIDER">Rider</option>
          </select>
        </div>
      </div>
      
      {state?.error && (
        <p className="text-rose-500 text-sm font-medium text-center">
          {state.error}
        </p>
      )}
      
      <LoadingButton 
        isLoading={isPending} 
        type="submit" 
        className="mt-2 w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg"
      >
        <UserPlus className="w-5 h-5"/> Sign Up
      </LoadingButton>

      <p className="text-center text-sm text-slate-500">
        Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Sign In</a>
      </p>
    </form>
  );
}
