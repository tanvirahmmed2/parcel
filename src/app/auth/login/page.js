"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Lock } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/merchant";
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post("/api/auth/login", data);
      toast.success("Login successful!");
      router.push(callbackUrl);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || err.response.data || "Invalid credentials.");
      } else {
        toast.error("Network or server error encountered.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-5">
      <div>
        <label className="block text-sm font-semibold mb-2">Email Address</label>
        <input 
          type="email" 
          {...register("email")}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
          placeholder="name@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Password</label>
        <input 
          type="password" 
          {...register("password")}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>
      <LoadingButton isLoading={isLoading} type="submit" className="mt-2 w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-50">
        <Lock className="w-4 h-4"/> Sign In
      </LoadingButton>
    </form>
  );
}
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 text-slate-900 font-sans">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#0f172a] text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 text-center">Sign in to the Percel Enterprise Portal.</p>
        </div>
        <Suspense fallback={<div className="p-8 text-center bg-white rounded-3xl shadow-xl">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
