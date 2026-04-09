"use client";
import { useState, useEffect } from "react";
import { Building2, Save, BadgeDollarSign, CreditCard, Landmark } from "lucide-react";
import useSWR from "swr";
import axios from "axios";
import toast from "react-hot-toast";

const fetcher = url => axios.get(url).then(res => res.data.user);

export default function BusinessSettings() {
  const { data: user, error, isLoading, mutate } = useSWR("/api/user/me", fetcher);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: ""
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        storeName: user.storeName || "",
        bankDetails: {
          accountName: user.bankDetails?.accountName || "",
          accountNumber: user.bankDetails?.accountNumber || "",
          bankName: user.bankDetails?.bankName || ""
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("bankDetails.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch("/api/user", formData);
      toast.success("Business details updated successfully");
      mutate();
    } catch(err) {
      toast.error(err.response?.data || "Unable to update business details");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500 font-medium">Loading network...</div>;
  if (!user) return <div className="p-8 text-rose-500">Failed to load business profile.</div>;

  return (
    <div className="p-8 font-sans max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Business Settings</h1>
        <p className="text-slate-500">Configure your store profile and payout bank information.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
         <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-8">
              
              <section>
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold">Store Configuration</h2>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Brand / Store Name</label>
                  <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition" />
                </div>
              </section>

              <hr className="border-slate-100" />

              <section>
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <BadgeDollarSign className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-bold">Payout Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Bank Name</label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" name="bankDetails.bankName" value={formData.bankDetails.bankName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Account Holder Name</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" name="bankDetails.accountName" value={formData.bankDetails.accountName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Account Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm leading-none">#</span>
                      <input type="text" name="bankDetails.accountNumber" value={formData.bankDetails.accountNumber} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-slate-900 font-mono transition" />
                    </div>
                  </div>
                </div>
              </section>

            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
              <button disabled={loading} type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center shadow-lg disabled:opacity-50">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Configuration"}
              </button>
            </div>
         </form>
      </div>
    </div>
  );
}
