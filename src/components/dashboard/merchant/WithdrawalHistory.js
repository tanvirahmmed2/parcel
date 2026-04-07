import { Clock } from "lucide-react";

export default function WithdrawalHistory({ withdrawals }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
          {Math.max(withdrawals?.length || 0, 0) > 0 ? (
            withdrawals.map((w) => (
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
            ))
          ) : (
            <tr><td colSpan="4" className="p-8 text-center text-gray-500">No withdrawal records.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
