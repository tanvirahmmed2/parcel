"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    
    setIsLoading(true);
    try {
      await axios.post("/api/user/reset-password", { token, password });
      setIsSuccess(true);
      toast.success("Password reset successfully");
    } catch (err) {
      toast.error(err.response?.data || "Unable to reset password. Link may be expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Invalid Link</h2>
        <p className="text-slate-500 mb-6">This password reset link is invalid or has expired.</p>
        <button onClick={() => router.push("/forgot-password")} className="bg-black text-white px-6 py-3 rounded-xl font-bold">Request New Link</button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">You're all set!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed text-lg">
          Your password has been successfully updated. You can now log in with your new credentials.
        </p>
        <button 
          onClick={() => router.push("/login")}
          className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition shadow-xl shadow-emerald-200"
        >
          Login to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Set New Password</h1>
      <p className="text-slate-500 mb-10 leading-relaxed">
        Choose a strong, unique password to secure your Parcel account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition font-mono" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition font-mono" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-black/10 hover:bg-slate-800 transition flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
        >
          {isLoading ? "Updating Password..." : (
            <>Update Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
      >
        <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading secure reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
