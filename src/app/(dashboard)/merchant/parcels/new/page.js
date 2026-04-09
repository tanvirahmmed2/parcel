"use client";
import { useState } from "react";
import { Package, MapPin, Scale, Banknote, Navigation } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateParcel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    receiverName: "",
    phone: "",
    address: "",
    district: "Dhaka",
    codAmount: 0,
    weight: 1,
    deliveryType: "Regular"
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/merchant/parcels", formData);
      toast.success("Parcel requested successfully");
      router.push("/merchant/parcels");
    } catch(err) {
      toast.error(err.response?.data || "Failed to create parcel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Create Parcel</h1>
        <p className="text-slate-500">Dispatch a new item to the Parcel logistics network.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Receiver Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Package className="w-5 h-5"/></div>
                <input required type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Receiver Phone</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Navigation className="w-5 h-5"/></div>
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Full Address</label>
            <div className="relative">
              <div className="absolute left-3 top-4 text-slate-400"><MapPin className="w-5 h-5"/></div>
              <textarea required name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black outline-none"></textarea>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">District</label>
              <select name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black outline-none appearance-none font-medium">
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barisal">Barisal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Delivery Type</label>
              <select name="deliveryType" value={formData.deliveryType} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black outline-none appearance-none font-medium">
                <option value="Regular">Regular</option>
                <option value="Express">Express</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">COD Amount (৳) <span className="text-xs text-slate-400 font-normal">Amount to collect</span></label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Banknote className="w-5 h-5"/></div>
                <input required type="number" min="0" name="codAmount" value={formData.codAmount} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black outline-none font-mono" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Weight (KG)</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Scale className="w-5 h-5"/></div>
                <input required type="number" min="0.1" step="0.1" name="weight" value={formData.weight} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black outline-none font-mono" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-slate-800 hover:shadow-xl transition flex justify-center items-center disabled:opacity-50"
            >
              {loading ? "Generating Payload..." : "Confirm & Dispatch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
