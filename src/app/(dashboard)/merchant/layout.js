import { requireAuth } from "@/lib/auth-shield";

export const metadata = {
  title: "Merchant Dashboard | Parcel",
  description: "Manage parcels and financials.",
};

import { Suspense } from "react";

export default async function MerchantLayout({ children }) {
  await requireAuth(["MERCHANT", "ADMIN"]); 

  return (
    <Suspense fallback={<div>Loading Area...</div>}>
      {children}
    </Suspense>
  );
}
