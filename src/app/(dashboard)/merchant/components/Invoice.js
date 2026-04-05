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
      // Dynamic import to keep bundle small and fix SSR issues with html2canvas/jspdf
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Percel_Invoice_${parcel.trackingId}.pdf`);
      toast.success("Invoice downloaded!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF");
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
          Download Invoice
        </button>
      </div>

      {/* Hidden Invoice Template designed for A4 ratio roughly */}
      <div className="overflow-x-auto border rounded-xl bg-gray-50 p-4">
        <div ref={invoiceRef} className="bg-white p-8 max-w-2xl mx-auto w-full text-black shadow-none border m-0" style={{ minWidth: '600px' }}>
          <div className="flex justify-between items-start border-b pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">PERCEL.</h1>
              <p className="text-gray-500 text-sm mt-1">Enterprise Logistics</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold mb-2">INVOICE</h2>
              <div className="p-2 border-2 rounded-lg inline-block bg-white">
                <QRCodeSVG value={parcel._id || parcel.trackingId} size={80} level="M" />
              </div>
              <p className="text-xs text-center font-mono mt-1 tracking-widest">{parcel.trackingId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Sender Details</h3>
              <p className="font-semibold">{parcel.merchantId?.name || "Merchant"}</p>
              <p className="text-sm text-gray-600">{parcel.merchantId?.phone || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Receiver Details</h3>
              <p className="font-semibold">{parcel.receiverName}</p>
              <p className="text-sm text-gray-600">{parcel.phone}</p>
              <p className="text-sm text-gray-600">{parcel.address}</p>
              <p className="text-sm font-medium mt-1">District: {parcel.district}</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-8">
             <thead>
               <tr className="border-b-2 border-gray-200">
                 <th className="py-3 text-sm tracking-wider uppercase text-gray-500">Description</th>
                 <th className="py-3 text-sm tracking-wider uppercase text-gray-500 text-right">Details</th>
               </tr>
             </thead>
             <tbody>
               <tr className="border-b">
                 <td className="py-3 font-medium">Delivery Type</td>
                 <td className="py-3 text-right">{parcel.deliveryType}</td>
               </tr>
               <tr className="border-b">
                 <td className="py-3 font-medium">Weight</td>
                 <td className="py-3 text-right">{parcel.weight} kg</td>
               </tr>
             </tbody>
          </table>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border">
            <div>
              <span className="text-gray-500 font-medium block">Total COD Amount</span>
              <span className="text-2xl font-bold">BDT {parcel.codAmount}</span>
            </div>
            <div className="text-right">
               <span className="text-gray-500 font-medium block">Delivery Charge</span>
               <span className="text-lg">BDT {parcel.deliveryCharge}</span>
            </div>
          </div>
          
          <div className="mt-12 text-center text-xs text-gray-400">
            Scanning the QR Code allows riders to instantly update parcel status via Percel Scanner.
          </div>
        </div>
      </div>
    </div>
  );
}
