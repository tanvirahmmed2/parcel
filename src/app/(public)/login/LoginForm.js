"use client";

import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import toast from "react-hot-toast";
import axios from "@/lib/axios";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/merchant";

  const loginAction = async (prevState, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await axios.post("/api/user/session", { email, password });
      if (res.data.success) {
        toast.success(res.data.message || "Login successful!");
        window.location.replace(callbackUrl);
        return { success: true };
      }
      return { error: res.data.message || "Invalid credentials" };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials.";
      toast.error(msg);
      return { error: msg };
    }
  };

  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-5">
      <div>
        <label className="block text-sm font-semibold mb-2">Email Address</label>
        <input 
          type="email" 
          name="email"
          required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold">Password</label>
          <a href="/forgot-password" size="sm" className="text-sm font-medium text-slate-500 hover:text-black transition">
            Forgot Password?
          </a>
        </div>
        <input 
          type="password" 
          name="password"
          required
          minLength={6}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
        />
      </div>
      
      {state?.error && <p className="text-red-500 text-sm text-center">{state.error}</p>}
      
      <LoadingButton isLoading={isPending} type="submit" className="mt-2 w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-50">
        <Lock className="w-4 h-4"/> Sign In
      </LoadingButton>
    </form>
  );
}
