"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ArrowUpRight } from "lucide-react";
import axios from "@/lib/axios";

export default function WithdrawalForm({ availableBalance, onComplete }) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0 || val > availableBalance) {
      return toast.error("Invalid amount. Check your available balance.");
    }
    setIsSubmitting(true);
    try {
      await axios.post("/api/merchant/withdrawals", { amount: val });
      toast.success("Withdrawal requested successfully!");
      setAmount("");
      if (onComplete) onComplete();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to request withdrawal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleWithdrawal} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center"><ArrowUpRight className="w-5 h-5 mr-2 text-accent"/> Request Payout</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
          max={availableBalance}
          required
        />
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting || availableBalance <= 0}
        className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 font-medium"
      >
        Submit Request
      </button>
    </form>
  );
}
