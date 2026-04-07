"use client";

import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import ScannerActions from "@/components/dashboard/rider/ScannerActions";

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

      const res = await axios.patch("/api/parcels/status", {
        trackingId: data,
        status, 
        reason,
        location: lat && lng ? { lat, lng } : undefined
      });

      if (res.data.success) {
          toast.success(res.data.message);
          setData("No result");
      } else {
          toast.error(res.data.message);
      }

    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update parcel status.");
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

      <ScannerActions data={data} updating={updating} onUpdateStatus={updateStatus} />
    </div>
  );
}
