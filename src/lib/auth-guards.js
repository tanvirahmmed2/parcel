import { getSessionPayload } from "./jwt";
import { connectToDatabase } from "./db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";

export async function isLogin() {
  const payload = await getSessionPayload();
  if (!payload || !payload.id) {
    redirect("/auth/login");
  }

  await connectToDatabase();
  const user = await User.findById(payload.id).select("-password").lean();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "ADMIN" && user.status !== "ACTIVE") {
    // If pending, allow them to view a pending page, but restrict standard access
    if (user.status === "PENDING") {
      redirect("/account-pending");
    }
    // Suspended
    if (user.status === "SUSPENDED") {
      redirect("/unauthorized?reason=suspended");
    }
  }

  return user;
}

export async function isAdmin() {
  const user = await isLogin();
  if (user.role !== "ADMIN") {
    redirect("/unauthorized");
  }
  return user;
}

export async function isMerchant() {
  const user = await isLogin();
  if (user.role !== "MERCHANT" && user.role !== "ADMIN") {
    redirect("/unauthorized");
  }
  return user;
}

export async function isRider() {
  const user = await isLogin();
  if (user.role !== "RIDER" && user.role !== "ADMIN") {
    redirect("/unauthorized");
  }
  return user;
}
