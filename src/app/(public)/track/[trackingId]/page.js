"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, Box, PackageOpen, Loader2 } from "lucide-react";
import axios from "axios";
const STEPS = [
  { status: "Pending", label: "Order Placed", icon: Box },
  { status: "Picked Up", label: "Picked Up by Rider", icon: Package },
  { status: "Hub Received", label: "Sorting Hub", icon: PackageOpen },
  { status: "Out for Delivery", label: "Out for Delivery", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: CheckCircle2 }
];
export default function TrackingPage() {
  const { trackingId } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchTracking() {
      try {
        const { data } = await axios.get(`/api/track/${trackingId}`);
        if (data.success) {
          setParcel(data.data);
          document.title = `Tracking ${trackingId} - Parcel`;
        } else {
          setError(data.message || "Parcel not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTracking();
  }, [trackingId]);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }
  if (error || !parcel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Tracking Not Found</h1>
        <p className="text-gray-500 max-w-sm">We couldn't find any parcel matching ID: {trackingId}</p>
      </div>
    );
  }
  const currentStepIndex = Math.max(0, STEPS.findIndex(s => s.status === parcel.status));
  const isDelivered = parcel.status === "Delivered";
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans antialiased">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-slate-900 rounded-2xl mb-4 shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Track Parcel</h1>
          <p className="text-slate-500 font-medium tracking-tight">
            ID: <span className="font-mono text-blue-600 font-bold">{parcel.trackingId}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="relative space-y-10">
                {STEPS.map((step, idx) => {
                  const isActive = parcel.status === step.status;
                  const isCompleted = isDelivered || STEPS.findIndex(s => s.status === parcel.status) > idx;
                  const Icon = step.icon;
                  const historyEvent = (parcel.history || []).find(h => h.status === step.status && step.status !== "Pending");
                  
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {idx < STEPS.length - 1 && (
                        <div className={`absolute top-10 left-5 -ml-px w-0.5 h-10 ${isCompleted ? 'bg-blue-600' : 'bg-slate-100'}`} />
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 
                        ${isCompleted ? 'bg-blue-600 text-white border-blue-600' : 
                          isActive ? 'bg-white border-slate-900 text-slate-900' : 
                          'bg-slate-50 border-slate-100 text-slate-300'}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="pt-2">
                        <p className={`font-bold leading-none ${isCompleted || isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </p>
                        {historyEvent && (
                           <p className="text-xs text-slate-500 mt-1 font-medium">
                             {new Date(historyEvent.timestamp).toLocaleString()}
                           </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Consignment Info</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Recipient</span>
                    <span className="text-sm font-bold text-slate-900">{parcel.receiverName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Destination</span>
                    <span className="text-sm font-bold text-slate-900">{parcel.district}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Cash Collection</span>
                    <span className="text-lg font-bold text-blue-600">৳{parcel.codAmount}</span>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
               <p className="text-xs font-medium leading-relaxed opacity-70">
                  For support regarding this delivery, please contact us at <span className="font-bold underline text-blue-400">support@parcel.com</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
