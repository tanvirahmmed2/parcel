
import Link from "next/link";
import { Zap, ShieldCheck, ArrowRight } from "lucide-react";
import DeliveryCalculator from "@/components/shared/DeliveryCalculator";
import ClientMotionWrapper from "@/components/shared/ClientMotionWrapper";

export const metadata = {
  title: "Parcel Logistics - Enterprise Grade Parcel Delivery",
  description: "Scale rapidly with real-time tracking, seamless cash cycles, and powerful APIs.",
};

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col pt-12 items-center justify-center font-sans antialiased text-slate-900 bg-slate-50">
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <ClientMotionWrapper className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-8 shadow-sm">
            <Zap className="w-4 h-4 text-blue-500 fill-blue-500" />
            <span>Powering 5,000+ local merchants nationwide</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-slate-900 mb-8">
            Logistics, <span className="text-blue-600">Redefined.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade delivery infrastructure enabling modern merchants to scale with real-time intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 transition shadow-lg">
              Start Shipping <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/track" className="flex items-center gap-2 bg-white text-black border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition shadow-sm">
              Track Parcel
            </Link>
          </div>
        </ClientMotionWrapper>
      </section>

      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <DeliveryCalculator />

          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Why Parcel?</h2>
              <p className="text-xl text-slate-500 leading-relaxed">We provide bleeding-edge infrastructure to manage hundreds of deliveries a day without missing a beat.</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4 group">
                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Real-Time Routing</h4>
                  <p className="text-slate-500">Live WebSockets push status and location updates to your dashboard the moment a rider scans a parcel.</p>
                </div>
              </div>
              
              <div className="flex gap-4 group">
                <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Secure Settlements</h4>
                  <p className="text-slate-500">Automated ledger systems collect COD and instantly route funds to your merchant wallet for payout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
