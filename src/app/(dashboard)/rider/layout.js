import { requireAuth } from "@/lib/auth-shield";

export const metadata = {
  title: "Rider Dashboard | Parcel",
  description: "Fulfillment scanning and delivery tasks.",
};

import { Suspense } from "react";

export default async function RiderLayout({ children }) {
  await requireAuth(["RIDER", "ADMIN"]); 

  return (
    <Suspense fallback={<div>Loading Area...</div>}>
      {children}
    </Suspense>
  );
}
