import { requireAuth } from "@/lib/auth-shield";

export const metadata = {
  title: "Admin Dashboard | Parcel",
  description: "Global system control and logistics tracking.",
};

import { Suspense } from "react";

export default async function AdminLayout({ children }) {
  await requireAuth(["ADMIN"]); 

  return (
    <Suspense fallback={<div>Loading Area...</div>}>
      {children}
    </Suspense>
  );
}
