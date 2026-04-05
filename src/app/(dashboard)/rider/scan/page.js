"use client";

import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Loader2, Camera, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {scanAndUpdateParcel} from "./actions";

export default function RiderScanPage() {
  const [data, setData] = useState("No result");
  const [cameraActive, setCameraActive] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleResult = async (result, error) => {
    if (!!result) {
      setData(result?.text);
      setCameraActive(false);
    }
  };

  const updateStatus = async (status) => {
    if (data === "No result" || !data) return;

    let reason = "";
    if (status === "REFUSED") {
        reason = prompt("MANDATORY: Provide reason for refusal (e.g. Customer unavailable, Wrong addressed, Product damaged).");
        if (!reason || reason.trim() === "") {
            toast.error("Reason is mandatory for Refused statuses.");
            return;
        }
    }

    setUpdating(true);
    try {
      let lat = null;
      let lng = null;

      if (navigator.geolocation) {
        try {
          const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch(e) {
          console.warn("Location permission denied");
        }
      }

      const res = await scanAndUpdateParcel(data, { 
          status, 
          reason,
          location: lat && lng ? { lat, lng } : undefined
      });

      if (res.success) {
          toast.success(res.message);
          setData("No result");
      } else {
          toast.error(res.message);
      }

    } catch (e) {
      toast.error(e.message || "Failed to update parcel status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 border-b pb-2">Scanner Console</h1>

      {!cameraActive && data === "No result" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center p-8 bg-black/5 rounded-2xl border border-gray-200">
          <Camera className="w-16 h-16 text-gray-400 mb-4" />
          <button onClick={() => setCameraActive(true)} className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">
            Initialize Scanner
          </button>
        </motion.div>
      )}

      {cameraActive && (
        <div className="relative rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center h-80 shadow-2xl border-4 border-slate-700">
          <QrReader
            onResult={handleResult}
            constraints={{ facingMode: "environment" }}
            videoContainerStyle={{ paddingTop: "0px", height: "100%", width: "100%", display: "flex", justifyContent: "center" }}
            videoStyle={{ objectFit: "cover", width: "100%" }}
          />
          <button onClick={() => setCameraActive(false)} className="absolute bottom-4 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg uppercase text-xs">
            Abort Scan
          </button>
        </div>
      )}

      {data !== "No result" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">QR Acquired</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest hidden">Payload</span>
            <span className="font-mono text-xs bg-slate-100 p-2 text-center font-bold tracking-widest rounded truncate">{data}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              onClick={() => updateStatus("IN_TRANSIT")}
              disabled={updating}
              className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800 py-3 rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50"
            >
               Out for Delivery
            </button>
            <button 
              onClick={() => updateStatus("DELIVERED")}
              disabled={updating}
              className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 py-3 rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50"
            >
               Mark Delivered
            </button>
            <button 
              onClick={() => updateStatus("REFUSED")}
              disabled={updating}
              className="col-span-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 py-3 rounded-xl text-sm font-bold shadow-sm transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Customer Refused"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
