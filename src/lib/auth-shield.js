import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectToDatabase } from "./db";
import { User } from "@/models/User";

const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey);

export async function verifySession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  try {
    const { payload } = await jwtVerify(sessionToken, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload; 
  } catch (error) {
    return null;
  }
}

export async function isLogin() {
  const payload = await verifySession();
  return !!(payload && payload.id);
}

export async function isAdmin() {
  const payload = await verifySession();
  return payload?.role === "ADMIN";
}

export async function isMerchant() {
  const payload = await verifySession();
  return payload?.role === "MERCHANT" || payload?.role === "ADMIN";
}

export async function isRider() {
  const payload = await verifySession();
  return payload?.role === "RIDER" || payload?.role === "ADMIN";
}

export async function requireAuth(roles = []) {
  const payload = await verifySession();

  if (!payload || !payload.id) {
    redirect("/auth/login");
  }

  if (payload.role !== "ADMIN" && payload.status !== "ACTIVE") {
    if (payload.status === "PENDING") {
      redirect("/account-pending");
    }
    if (payload.status === "SUSPENDED") {
      redirect("/unauthorized?reason=suspended");
    }
  }

  if (roles.length > 0 && !roles.includes(payload.role)) {
    if (payload.role !== "ADMIN") {
      redirect("/unauthorized");
    }
  }

  return payload;
}

export async function getMe() {
  const payload = await verifySession();
  if (!payload?.id) return null;

  await connectToDatabase();
  const user = await User.findById(payload.id).select("-password").lean();
  return user;
}
