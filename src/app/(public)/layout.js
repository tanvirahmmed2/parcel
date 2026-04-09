import PublicNavbar from "@/components/shared/PublicNavbar";
import PublicFooter from "@/components/shared/PublicFooter";

export const metadata = {
  title: {
    default: "Parcel Logistics | reliable Parcel Delivery",
    template: "%s | Parcel"
  },
  description: "Enterprise-grade logistics and parcel management platform.",
};

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-x-hidden">
      <PublicNavbar />
      <main className="flex-1 flex flex-col w-full min-h-screen relative z-10 pt-24">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
