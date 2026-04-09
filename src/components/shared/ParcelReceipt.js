import React from "react";
import { Package, Truck, Calendar, MapPin, Phone, User as UserIcon } from "lucide-react";

export default function ParcelReceipt({ parcel }) {
  if (!parcel) return null;

  const merchant = parcel.merchantId || {};
  
  return (
    <div className="bg-white p-8 max-w-2xl mx-auto border border-slate-200 shadow-xl rounded-2xl font-sans text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Package className="w-8 h-8 text-black" />
            PARCEL <span className="text-slate-400">LOGISTICS</span>
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Delivery Receipt</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-bold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {parcel.trackingId}
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {new Date(parcel.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-1">
            <Truck className="w-3 h-3" /> From (Sender)
          </h3>
          <div className="space-y-1">
            <p className="font-bold text-lg leading-tight">{merchant.storeName || merchant.name || "N/A"}</p>
            <p className="text-sm text-slate-600 flex items-center gap-2"><Phone className="w-3 h-3" /> {merchant.phone || "N/A"}</p>
            <p className="text-sm text-slate-600 flex items-center gap-2 font-medium"><UserIcon className="w-3 h-3" /> {merchant.name || "N/A"}</p>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> To (Receiver)
          </h3>
          <div className="space-y-1">
            <p className="font-bold text-lg leading-tight">{parcel.receiverName}</p>
            <p className="text-sm text-slate-600 flex items-center gap-2"><Phone className="w-3 h-3" /> {parcel.phone}</p>
            <p className="text-sm text-slate-600 flex items-center gap-2">{parcel.address}</p>
            <p className="text-sm font-bold text-black border-l-2 border-black pl-2 flex items-center gap-1">
               {parcel.district}
            </p>
          </div>
        </div>
      </div>

      {/* Parcel Details */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Shipment Specifications</h3>
        <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/50">
              <tr>
                <th className="px-4 py-2 font-bold">Item</th>
                <th className="px-4 py-2 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 text-slate-500 font-medium whitespace-nowrap">Weight</td>
                <td className="px-4 py-3 text-right font-bold">{parcel.weight} KG</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-500 font-medium whitespace-nowrap">Delivery Type</td>
                <td className="px-4 py-3 text-right font-bold italic">{parcel.deliveryType}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-500 font-medium whitespace-nowrap">Status</td>
                <td className="px-4 py-3 text-right">
                  <span className="bg-white border rounded ps-2 pe-2 py-0.5 font-bold shadow-sm">
                    {parcel.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="p-6 bg-black text-white rounded-2xl flex justify-between items-center shadow-lg">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Collect Cash (COD)</p>
          <p className="text-3xl font-black tracking-tighter">৳ {parcel.codAmount}</p>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Charge</p>
           <p className="text-lg font-bold">৳ {parcel.deliveryCharge}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Thank you for choosing Parcel</p>
        <div className="mt-4 flex justify-center gap-4 opacity-20">
            <div className="w-10 h-1 bg-slate-400 rounded-full"></div>
            <div className="w-10 h-1 bg-slate-400 rounded-full"></div>
            <div className="w-10 h-1 bg-slate-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
