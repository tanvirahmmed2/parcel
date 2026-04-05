"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export function QA_MODAL({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    receiverName: "",
    phone: "",
    address: "",
    district: "dhaka",
    weight: "1",
    codAmount: "",
  });

  const getCharge = () => {
    let base = data.district.toLowerCase().includes("dhaka") ? 60 : 120;
    let extra = Number(data.weight) > 1 ? (Math.ceil(Number(data.weight)) - 1) * 20 : 0;
    return base + extra;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/merchant/parcels", data);
      toast.success("Parcel Created!");
      onCreated();
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b filter">
          <h2 className="text-xl font-bold tracking-tight">Create New Parcel</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5"/></button>
        </div>
        
        <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 line-clamp-1">Customer Name</label>
            <input required value={data.receiverName} onChange={e=>setData({...data, receiverName: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1 line-clamp-1">Phone</label>
                <input required value={data.phone} onChange={e=>setData({...data, phone: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 line-clamp-1">Cash to Collect</label>
                <input required type="number" value={data.codAmount} onChange={e=>setData({...data, codAmount: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Detailed Address</label>
            <textarea required rows={2} value={data.address} onChange={e=>setData({...data, address: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target District</label>
              <select value={data.district} onChange={e=>setData({...data, district: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none">
                <option value="dhaka">Inside Dhaka</option>
                <option value="chittagong">Chittagong</option>
                <option value="sylhet">Sylhet</option>
                <option value="other">Other District</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Weight (KG)</label>
              <input required type="number" min="0.5" step="0.5" value={data.weight} onChange={e=>setData({...data, weight: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center mt-4">
            <span className="text-slate-600 font-medium tracking-tight text-sm">Calculated Delivery Charge:</span>
            <span className="text-xl font-bold">৳{getCharge()}</span>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-black text-white p-3 rounded-xl font-bold flex justify-center hover:bg-slate-800 transition disabled:opacity-50 mt-4">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm & Dispatch"}
          </button>
        </form>
      </div>
    </div>
  );
}
