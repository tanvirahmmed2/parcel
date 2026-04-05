import { isAdmin } from "@/lib/auth-guards";

export default async function AdminLayout({ children }) {
  // This physically blocks layout rendering on the server
  // returning un-authenticated/un-authorized instantly natively hitting MongoDB through RBAC
  const user = await isAdmin(); 
  
  return (
    <>
      {children}
    </>
  );
}
