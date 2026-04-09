import { Package } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 py-12 text-center text-slate-400 mt-auto">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Package className="w-6 h-6" />
        <span className="text-xl font-black tracking-tight text-white">Parcel</span>
      </div>
      <p className="mb-2">© 2026 Parcel Logistics. Enterprise Grade.</p>
      <p className="text-sm">
        A project of <a href="https://disibin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition font-medium">Disibin</a>
      </p>
    </footer>
  );
}
