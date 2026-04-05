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
        const res = await axios.get(`/api/track/${trackingId}`);
        const data = res.data;
        setParcel(data);
        
        // Dynamically update document title to show tracking id
        document.title = `Tracking ${trackingId} - Percel`;
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Percel Tracker</h1>
          <p className="text-gray-500 mt-2">Tracking ID: <span className="font-mono text-gray-800 bg-gray-200 px-2 rounded">{parcel.trackingId}</span></p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 mb-6 relative">
           <div className="relative z-10 space-y-8">
             {STEPS.map((step, idx) => {
               const isActive = parcel.status === step.status;
               const isCompleted = isDelivered || STEPS.findIndex(s => s.status === parcel.status) > idx;
               const Icon = step.icon;
               
               // Find history event for this step if completed
               const historyEvent = parcel.history.find(h => h.status === step.status && step.status !== "Pending");

               return (
                 <div key={idx} className="relative flex items-start gap-4">
                   {/* Vertical Line */}
                   {idx < STEPS.length - 1 && (
                     <div className={`absolute top-10 left-6 -ml-px w-0.5 h-12 rounded-full ${isCompleted ? 'bg-black' : 'bg-gray-100'}`} />
                   )}
                   
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 
                       ${isCompleted ? 'bg-black text-white border-black' : 
                         isActive ? 'bg-white border-black text-black' : 
                         'bg-gray-50 border-gray-100 text-gray-300'}`}
                   >
                     <Icon className="w-5 h-5" />
                   </motion.div>

                   <div className="pt-2">
                     <p className={`font-semibold ${isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                       {step.label}
                     </p>
                     {historyEvent && (
                       <p className="text-xs text-gray-500 mt-1">
                         {new Date(historyEvent.timestamp).toLocaleString()}
                       </p>
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 text-sm shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-500">Receiver</span>
            <span className="font-semibold">{parcel.receiverName}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-500">Destination</span>
            <span className="font-semibold">{parcel.district}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Cash to Collect</span>
            <span className="font-semibold text-lg text-black">৳{parcel.codAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
