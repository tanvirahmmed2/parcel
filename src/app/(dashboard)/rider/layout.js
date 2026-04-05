import { requireAuth } from "@/lib/auth-shield";

export const metadata = {
  title: "Rider Portal | Percel",
  description: "Fulfillment scanning and delivery tasks.",
};

export default async function RiderLayout({ children }) {
  await requireAuth(["RIDER", "ADMIN"]); 

  return (
    <>
      {children}
    </>
  );
}
