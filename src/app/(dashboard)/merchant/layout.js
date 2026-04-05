import { requireAuth } from "@/lib/auth-shield";

export const metadata = {
  title: "Merchant Dashboard | Percel",
  description: "Manage parcels and financials.",
};

export default async function MerchantLayout({ children }) {
  await requireAuth(["MERCHANT", "ADMIN"]); 

  return (
    <>
      {children}
    </>
  );
}
