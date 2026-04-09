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
    <form action={formAction} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-6 w-full max-w-md mx-auto">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Email Address</label>
        <input 
          type="email" 
          name="email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
        />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <a href="/forgot-password" size="sm" className="text-sm font-medium text-blue-600 hover:underline transition">
            Forgot Password?
          </a>
        </div>
        <input 
          type="password" 
          name="password"
          required
          autoComplete="current-password"
          minLength={6}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
        />
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
        <Lock className="w-4 h-4"/> Sign In
      </LoadingButton>

      <p className="text-center text-sm text-slate-500">
        New here? <a href="/register" className="text-blue-600 font-bold hover:underline">Create an account</a>
      </p>
    </form>
  );
}
