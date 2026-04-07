"use client";
import useSWR from "swr";
import axios from "@/lib/axios";
import WithdrawalForm from "@/components/dashboard/merchant/WithdrawalForm";
import WithdrawalHistory from "@/components/dashboard/merchant/WithdrawalHistory";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function MerchantWallet() {
  const { data, error, isLoading, mutate } = useSWR("/api/merchant/withdrawals", fetcher);

  if (isLoading) return <div className="p-8"><div className="animate-pulse h-32 bg-gray-200 rounded-xl mb-8"></div></div>;
  if (error) return <div className="p-8 text-danger">Failed to load wallet stats.</div>;

  const { stats, withdrawals } = data?.data || { stats: { availableBalance: 0, netEarnings: 0, pendingWithdrawalTotal: 0 }, withdrawals: [] };

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
           <WithdrawalForm 
             availableBalance={stats.availableBalance} 
             onComplete={() => mutate()} 
           />
        </div>
        <div className="lg:col-span-2">
           <WithdrawalHistory withdrawals={withdrawals} />
        </div>
      </div>
    </div>
  );
}
