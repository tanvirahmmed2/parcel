import PublicNavbar from "@/components/shared/PublicNavbar";
import PublicFooter from "@/components/shared/PublicFooter";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <PublicNavbar />
      <main className="flex-1 flex flex-col w-full min-h-screen">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
