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
    <form action={formAction} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Full Name</label>
          <input 
            type="text" 
            name="name"
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Store Name</label>
          <input 
            type="text" 
            name="storeName"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
            placeholder="My Store"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Email Address</label>
        <input 
          type="email" 
          name="email"
          required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
          placeholder="name@example.com"
        />
      </div>
      <div>
         <label className="block text-sm font-semibold mb-2">Phone</label>
          <input 
            type="text" 
            name="phone"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
            placeholder="+1234567890"
          />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Password</label>
        <input 
          type="password" 
          name="password"
          required
          minLength={6}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
          placeholder="••••••••"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Role</label>
        <select name="role" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition">
          <option value="MERCHANT">Merchant</option>
          <option value="RIDER">Rider</option>
        </select>
      </div>
      
      {state?.error && <p className="text-red-500 text-sm text-center">{state.error}</p>}
      
      <LoadingButton isLoading={isPending} type="submit" className="mt-2 w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-50">
        <UserPlus className="w-4 h-4"/> Sign Up
      </LoadingButton>
    </form>
  );
}
