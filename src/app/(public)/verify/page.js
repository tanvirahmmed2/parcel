import { verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
export default async function VerifyEmailPage({ searchParams }) {
  const token = await searchParams?.token;
  if (!token) {
    return <ResultState isError message="No verification token provided." />;
  }
  const payload = await verifyToken(token);
  if (!payload || payload.intent !== "VERIFY_EMAIL" || !payload.id) {
    return <ResultState isError message="Invalid or expired verification token." />;
  }
  try {
    await connectToDatabase();
    const user = await User.findById(payload.id);
    if (!user) {
      return <ResultState isError message="User not found in system." />;
    }
    if (user.status === "ACTIVE") {
      return <ResultState isError={false} message="Account is already active." />
    }
    user.emailVerified = new Date();
    await user.save();
    return <ResultState isError={false} message="Email perfectly verified. Your account is now in the queue for Admin approval!" />;
  } catch(e) {
    return <ResultState isError message="Database connection interrupted." />;
  }
}
function ResultState({ isError, message }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
       <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg text-center flex flex-col items-center">
         <div className={`w-20 h-20 flex items-center justify-center rounded-2xl mb-6 shadow-inner ${isError ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {isError ? <AlertCircle className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
         </div>
         <h1 className="text-3xl font-extrabold mb-3">{isError ? "Verification Failed" : "Verification Complete"}</h1>
         <p className="text-slate-500 mb-8">{message}</p>
         <Link href="/auth/login" className="bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 transition shadow-md w-full">
           Proceed to Login
         </Link>
       </div>
    </div>
  )
}
