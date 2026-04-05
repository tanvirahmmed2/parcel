"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import { Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Invoice({ parcel }) {
  const invoiceRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {

      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 3, 
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [101.6, 152.4]
      });

      pdf.addImage(imgData, "PNG", 0, 0, 101.6, 152.4);
      pdf.save(`Percel_4x6_Label_${parcel.trackingId}.pdf`);
      toast.success("Shipping label generated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF label.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download 4x6 Label
        </button>
      </div>

      {}
      <div className="overflow-x-auto border rounded-xl bg-gray-50 p-4">
        <div 
          ref={invoiceRef} 
          className="bg-white text-black border shadow-none relative" 
          style={{ width: '384px', height: '576px', padding: '16px', margin: '0 auto', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
        >
          {}
          <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none">PERCEL.</h1>
              <p className="text-[10px] font-bold mt-1 uppercase">Standard Carrier</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold">DATE: {new Date().toLocaleDateString()}</p>
              <p className="text-[10px] font-bold">WEIGHT: {parcel.weight} KG</p>
            </div>
          </div>

          {}
          <div className="mb-4">
            <h3 className="text-[10px] uppercase font-bold border-b border-black inline-block mb-1">Ship To:</h3>
            <h2 className="text-xl font-bold leading-tight uppercase">{parcel.receiverName}</h2>
            <p className="text-sm uppercase font-semibold leading-tight">{parcel.address}</p>
            <p className="text-sm uppercase font-semibold">{parcel.district}</p>
            <p className="text-sm font-bold mt-1 tracking-wide">PH: {parcel.phone}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-[10px] uppercase font-bold border-b border-black inline-block mb-1">Return To:</h3>
            <p className="text-xs font-semibold uppercase">{parcel.merchantId?.name || "Merchant"}</p>
            <p className="text-[10px] uppercase">{parcel.merchantId?.phone || "N/A"}</p>
          </div>

          {}
          <div className="border-4 border-black p-3 text-center mb-6">
             <p className="text-sm font-bold tracking-widest uppercase mb-1">Cash on Delivery</p>
             <p className="text-4xl font-black tracking-tighter">BDT {Math.floor(Number(parcel.codAmount))}</p>
          </div>

          {}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center border-t-2 border-black pt-4">
             <QRCodeSVG value={parcel._id || parcel.trackingId} size={110} level="H" />
             <p className="mt-2 text-xs font-mono font-bold tracking-[0.2em]">{parcel.trackingId}</p>
             <p className="text-[8px] uppercase mt-2 font-bold text-center">Scan to Track or Update Status via Percel App</p>
          </div>

        </div>
      </div>
    </div>
  );
}
