"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await axios.post("/api/user/forgot-password", { email });
      setIsSent(true);
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="p-8 pb-4">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-black transition mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Recover Account</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Enter your email and we'll send you a secure link to reset your password.
          </p>

          {isSent ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Reset Link Sent</h3>
              <p className="text-emerald-700 text-sm">
                If an account exists for <b>{email}</b>, you will receive an email shortly with instructions.
              </p>
              <Link href="/login" className="mt-6 inline-block w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition">
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition font-medium" 
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium ml-1">{error}</p>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-black/10 hover:bg-slate-800 transition flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? "Sending Link..." : (
                  <>Send Reset Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          )}
        </div>
        
        {!isSent && (
          <div className="p-8 pt-0 border-t border-slate-50 bg-slate-50/50 mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account? <Link href="/register" className="text-black font-bold hover:underline">Apply now</Link>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
