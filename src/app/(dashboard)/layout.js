import { requireAuth } from "@/lib/auth-shield";
import DashboardClientLayout from "@/components/dashboard/DashboardClientLayout";

export const metadata = {
  title: {
    default: "Dashboard | Parcel",
    template: "%s | Parcel Logistics"
  },
  description: "Enterprise-grade logistics management portal.",
  robots: "noindex, nofollow"
};

export default async function DashboardLayout({ children }) {
  const session = await requireAuth();

  return (
    <DashboardClientLayout user={session}>
      {children}
    </DashboardClientLayout>
  );
}
