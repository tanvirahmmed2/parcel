"use client";

import { useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const parcelSchema = z.object({
  receiverName: z.string().min(2, "Name is too short"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(5, "Address must be detailed"),
  district: z.string(),
  weight: z.string().min(1, "Weight is required"),
  codAmount: z.string().min(1, "COD Amount is required"),
});

export function QA_MODAL({ onClose, onCreated }) {
  const [fraudData, setFraudData] = useState(null);
  const [isCheckingFraud, setIsCheckingFraud] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      receiverName: "",
      phone: "",
      address: "",
      district: "dhaka",
      weight: "1",
      codAmount: "",
    }
  });

  const district = watch("district");
  const weight = watch("weight");

  const getCharge = () => {
    let w = Number(weight) || 1;
    let base = district && district.toLowerCase().includes("dhaka") ? 60 : 120;
    let extra = w > 1 ? (Math.ceil(w) - 1) * 20 : 0;
    return base + extra;
  };

  const handlePhoneBlur = async (e) => {
    const phone = e.target.value;
    if (phone.length >= 10) {
      setIsCheckingFraud(true);
      try {
        const res = await axios.get(`/api/merchant/fraud-check?phone=${phone}`);
        setFraudData(res.data.data);
      } catch (err) {
        console.error("Fraud check failed", err);
      } finally {
        setIsCheckingFraud(false);
      }
    }
  };

  const submit = async (data) => {
    try {
      if (fraudData?.isHighRisk) {
         if(!confirm("Warning: High Risk Phone Number! This recipient has a high return rate. Are you sure you want to dispatch this parcel anyway?")) {
           return;
         }
      }

      await axios.post("/api/merchant/parcels", data);
      toast.success("Parcel Created!");
      onCreated();
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b filter">
          <h2 className="text-xl font-bold tracking-tight">Create New Parcel</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5"/></button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 line-clamp-1">Customer Name</label>
            <input {...register("receiverName")} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            {errors.receiverName && <p className="text-red-500 text-xs mt-1">{errors.receiverName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1 line-clamp-1">Phone</label>
                <div className="relative">
                  <input {...register("phone")} onBlur={handlePhoneBlur} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                  {isCheckingFraud && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-slate-400" />}
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}

                {fraudData && !isCheckingFraud && (
                  <div className={`mt-2 p-2 rounded-lg text-xs flex items-start gap-1 font-medium ${fraudData.isHighRisk ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700'}`}>
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <div>
                      {fraudData.isHighRisk ? "HIGH RISK!" : "Good Standing"}<br/>
                      <span className="opacity-80 font-normal">Delivery Success: {fraudData.successRate}%</span>
                    </div>
                  </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 line-clamp-1">Cash to Collect (COD)</label>
                <input type="number" {...register("codAmount")} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                {errors.codAmount && <p className="text-red-500 text-xs mt-1">{errors.codAmount.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Detailed Address</label>
            <textarea rows={2} {...register("address")} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target District</label>
              <select {...register("district")} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white">
                <option value="dhaka">Inside Dhaka</option>
                <option value="chittagong">Chittagong</option>
                <option value="sylhet">Sylhet</option>
                <option value="other">Other District</option>
              </select>
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Weight (KG)</label>
              <input type="number" min="0.5" step="0.5" {...register("weight")} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center mt-4">
            <span className="text-slate-600 font-medium tracking-tight text-sm">Calculated Delivery Charge:</span>
            <span className="text-xl font-bold">৳{getCharge()}</span>
          </div>

          <button disabled={isSubmitting} type="submit" className="w-full bg-black text-white p-3 rounded-xl font-bold flex justify-center hover:bg-slate-800 transition disabled:opacity-50 mt-4 h-12 items-center">
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm & Dispatch"}
          </button>
        </form>
      </div>
    </div>
  );
}
