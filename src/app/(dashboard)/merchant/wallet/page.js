"use client";

import useSWR from "swr";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { DollarSign, ArrowUpRight, Clock } from "lucide-react";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function MerchantWallet() {
  const { data, error, isLoading, mutate } = useSWR("/api/merchant/withdrawals", fetcher);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <div className="p-8"><div className="animate-pulse h-32 bg-gray-200 rounded-xl mb-8"></div></div>;
  if (error) return <div className="p-8 text-danger">Failed to load wallet stats.</div>;

  const { stats, withdrawals } = data;

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0 || val > stats.availableBalance) {
      return toast.error("Invalid amount. Check your available balance.");
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/merchant/withdrawals", { amount: val });
      toast.success("Withdrawal requested successfully!");
      setAmount("");
      mutate();
    } catch (err) {
      toast.error(err.message || "Failed to request withdrawal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Financial Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-primary text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-primary-light font-medium mb-2">Available Balance</h3>
            <p className="text-4xl font-bold">৳{stats.availableBalance.toFixed(2)}</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Net Earnings</h3>
            <p className="text-2xl font-bold text-gray-900">৳{stats.netEarnings.toFixed(2)}</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Pending Withdrawals</h3>
            <p className="text-2xl font-bold text-gray-900">৳{stats.pendingWithdrawalTotal.toFixed(2)}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
           <form onSubmit={handleWithdrawal} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center"><ArrowUpRight className="w-5 h-5 mr-2 text-accent"/> Request Payout</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  max={stats.availableBalance}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || stats.availableBalance <= 0}
                className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 font-medium"
              >
                Submit Request
              </button>
           </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
             <h2 className="text-lg font-semibold flex items-center"><Clock className="w-5 h-5 mr-2 text-gray-500"/> Withdrawal History</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {withdrawals.map((w) => (
                <tr key={w._id}>
                   <td className="p-4">{new Date(w.createdAt).toLocaleDateString()}</td>
                   <td className="p-4 font-medium">৳{w.amount.toFixed(2)}</td>
                   <td className="p-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${w.status === 'PAID' ? 'bg-success/10 text-success' : 'bg-accent-light/10 text-accent-light'}`}>
                       {w.status}
                     </span>
                   </td>
                   <td className="p-4 text-gray-500 font-mono text-xs">{w.transactionId || '-'}</td>
                </tr>
              ))}
              {withdrawals.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No withdrawal records.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
