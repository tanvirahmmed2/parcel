import { requireAuth } from "@/lib/auth-shield";

export const metadata = {
  title: "Admin Dashboard | Percel",
  description: "Global system control and logistics tracking.",
};

export default async function AdminLayout({ children }) {
  await requireAuth(["ADMIN"]); 

  return (
    <>
      {children}
    </>
  );
}
