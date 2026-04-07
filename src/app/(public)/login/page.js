"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Lock } from "lucide-react";
import LoginForm from "./LoginForm";
export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-slate-900 font-sans">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#0f172a] text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 text-center">Sign in to the Parcel Enterprise Portal.</p>
        </div>
        <Suspense fallback={<div className="p-8 text-center bg-white rounded-3xl shadow-xl">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
