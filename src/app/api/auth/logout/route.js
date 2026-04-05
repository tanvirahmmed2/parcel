import { clearSessionCookie } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET() {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/auth/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
