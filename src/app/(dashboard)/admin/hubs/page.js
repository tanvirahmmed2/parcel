"use client";
import { CheckCircle, XCircle, Search, UserCheck, Trash, Plus, X } from "lucide-react";
import useSWR from "swr";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fetcher = url => axios.get(url).then(res => res.data);

export default function HubManagement() {
  const { data: users, error, isLoading, mutate } = useSWR("/api/admin/users?role=HUB", fetcher, { fallbackData: [] });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });

  const setStatus = async (id, status) => {
    try {
      await axios.patch("/api/admin/users", { id, status });
      toast.success(`Hub Account ${status}`);
      mutate();
    } catch(e) {
      toast.error(e.response?.data || "Update failed");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this account?")) return;
    try {
      await axios.delete(`/api/admin/users?id=${id}`);
      toast.success("Hub Account deleted");
      mutate();
    } catch(e) {
      toast.error(e.response?.data || "Deletion failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/admin/users", { ...formData, role: "HUB" });
      toast.success("Hub account created successfully");
      setShowCreateModal(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
      mutate();
    } catch (e) {
      toast.error(e.response?.data || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Hub Management</h1>
          <p className="text-slate-500">Create and manage central sorting facility accounts.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="rounded-xl px-6">
          <Plus className="w-5 h-5 mr-2" />
          Add Hub Account
        </Button>
      </div>

      <Card className="border-slate-200 overflow-hidden shadow-sm">
         <div className="p-4 border-b bg-slate-50 relative">
            <Search className="w-5 h-5 absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search records..." className="pl-12 w-full max-w-sm" />
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-4 font-semibold">Manager Name</th>
                  <th className="p-4 font-semibold">Contact Email</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoading ? <tr><td colSpan="4" className="text-center p-8 text-slate-400 font-medium">Loading hub network...</td></tr> : 
                 users.length === 0 ? <tr><td colSpan="4" className="text-center p-8 text-slate-400 font-medium">No Hub accounts found.</td></tr> :
                 users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-medium"><UserCheck className="w-4 h-4 inline-block mr-2 text-slate-400"/> {u.name}</td>
                    <td className="p-4 text-slate-500">{u.email} <br/> <span className="text-xs">{u.phone}</span></td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                       {u.status !== 'ACTIVE' ? (
                          <button onClick={() => setStatus(u._id, 'ACTIVE')} className="text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium transition" title="Activate">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                       ) : (
                          <button onClick={() => setStatus(u._id, 'SUSPENDED')} className="text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-medium transition" title="Suspend">
                            <XCircle className="w-4 h-4" />
                          </button>
                       )}
                      <button onClick={() => deleteUser(u._id)} className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 font-medium transition" title="Delete">
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </Card>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <CardHeader>
              <CardTitle>Create Hub Account</CardTitle>
              <CardDescription>Enter details for the new Hub sorting facility manager.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                    <Input 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Uttara Hub Manager"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                    <Input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="manager@hub.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact Number</label>
                    <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+880..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
                    <Input 
                        required
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••"
                    />
                </div>
                <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                    {loading ? "Creating Account..." : "Confirm & Create"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
