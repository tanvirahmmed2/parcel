"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { User as UserIcon, Mail, Building2, Calendar, ShieldCheck, Pencil, Check, X } from "lucide-react";
import toast from "react-hot-toast";

const fetcher = url => axios.get(url).then(res => res.data.user);

export default function ProfileDashboard() {
  const { data: user, error, isLoading, mutate } = useSWR("/api/user/me", fetcher);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.patch("/api/user", formData);
      toast.success("Profile updated successfully");
      setEditing(false);
      mutate();
    } catch(err) {
      toast.error(err.response?.data || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name || "", phone: user.phone || "" });
    setEditing(false);
  };

  if (isLoading) return <div className="p-8 text-slate-500 font-medium">Loading profile...</div>;
  if (error || !user) return <div className="p-8 text-rose-500 font-medium">Unable to load profile data.</div>;

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Personal Profile</h1>
          <p className="text-slate-500">Manage your account settings and view system status.</p>
        </div>
        {!editing ? (
           <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-800 px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition">
             <Pencil className="w-4 h-4" /> Edit Profile
           </button>
        ) : (
           <div className="flex gap-2">
             <button disabled={loading} onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-emerald-700 transition disabled:opacity-50">
               <Check className="w-4 h-4" /> Save
             </button>
             <button disabled={loading} onClick={handleCancel} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition disabled:opacity-50">
               <X className="w-4 h-4" /> Cancel
             </button>
           </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 h-32 relative">
           <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white text-3xl font-black text-slate-800">
             {formData.name?.charAt(0) || user.name?.charAt(0) || "U"}
           </div>
        </div>
        
        <div className="pt-16 pb-8 px-8 border-b border-slate-100">
          {editing ? (
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="text-2xl font-bold tracking-tight text-slate-900 w-full max-w-sm border-b-2 border-slate-300 focus:border-slate-800 outline-none pb-1 bg-transparent" placeholder="Your Full Name" />
          ) : (
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{user.name}</h2>
          )}

          <div className="flex items-center gap-4 mt-2 mb-6">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">{user.role}</span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{user.status} account</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email Address</p>
                <p className="font-medium text-slate-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                 <UserIcon className="w-5 h-5 text-slate-400" />
               </div>
               <div className="flex-1">
                 <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Phone Number</p>
                 {editing ? (
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="font-medium text-slate-900 w-full bg-slate-50 px-2 py-1 border border-slate-200 rounded-md outline-none" placeholder="Enter phone" />
                 ) : (
                    <p className="font-medium text-slate-900">{user.phone || "Not set"}</p>
                 )}
               </div>
            </div>

            {user.role === "MERCHANT" && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Store Name</p>
                  <p className="font-medium text-slate-900">{user.storeName || "Not set"}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Joined On</p>
                <p className="font-medium text-slate-900">{new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">System ID</p>
                <p className="font-medium text-slate-900 font-mono text-sm break-all">{user._id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 text-sm text-slate-500">
          <p>Important security parameter changes require direct validation with your administrator.</p>
        </div>
      </div>
    </div>
  );
}
