"use client";
import { CheckCircle, XCircle, Search, UserCheck, Trash } from "lucide-react";
import useSWR from "swr";
import toast from "react-hot-toast";
import axios from "axios";

const fetcher = url => axios.get(url).then(res => res.data);

export default function RiderManagement() {
  const { data: users, error, isLoading, mutate } = useSWR("/api/admin/users?role=RIDER", fetcher, { fallbackData: [] });

  const setStatus = async (id, status) => {
    try {
      await axios.patch("/api/admin/users", { id, status });
      toast.success(`Rider ${status}`);
      mutate();
    } catch(e) {
      toast.error(e.message);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this account?")) return;
    try {
      await axios.delete(`/api/admin/users?id=${id}`);
      toast.success("Rider deleted");
      mutate();
    } catch(e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Rider Management</h1>
        <p className="text-slate-500">Manage, approve, or suspend rider applications.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b bg-slate-50 relative">
            <Search className="w-5 h-5 absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search records..." className="pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-lg w-full max-w-sm outline-none focus:ring-2 focus:ring-black transition" />
         </div>
         <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
             <tr>
               <th className="p-4 font-semibold">Name / Vehicle</th>
               <th className="p-4 font-semibold">Email</th>
               <th className="p-4 font-semibold">Status</th>
               <th className="p-4 font-semibold text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {isLoading ? <tr><td colSpan="4" className="text-center p-8 text-slate-400 font-medium">Loading network...</td></tr> : 
              users.map(u => (
               <tr key={u._id} className="hover:bg-slate-50 transition">
                 <td className="p-4 font-medium"><UserCheck className="w-4 h-4 inline-block mr-2 text-slate-400"/> {u.name}</td>
                 <td className="p-4 text-slate-500">{u.email}</td>
                 <td className="p-4">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                     {u.status}
                   </span>
                 </td>
                 <td className="p-4 text-right space-x-2">
                   {u.status !== 'ACTIVE' && <button onClick={() => setStatus(u._id, 'ACTIVE')} className="text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium transition"><CheckCircle className="w-4 h-4 inline mr-1"/>Approve</button>}
                   <button onClick={() => setStatus(u._id, 'SUSPENDED')} className="text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-medium transition"><XCircle className="w-4 h-4 inline mr-1"/>Suspend</button>
                   <button onClick={() => deleteUser(u._id)} className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 font-medium transition"><Trash className="w-4 h-4 inline mr-1"/>Delete</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}
