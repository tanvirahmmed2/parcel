import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const secretKey = process.env.NEXTAUTH_SECRET || "fallback_secret_key";
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req) {
  const { nextUrl, cookies } = req;
  const baseUrl = nextUrl.origin;
  const sessionToken = cookies.get("session")?.value;

  let payload = null;
  if (sessionToken) {
    try {
      const verified = await jwtVerify(sessionToken, encodedKey, { algorithms: ["HS256"] });
      payload = verified.payload;
    } catch (e) {
      payload = null;
    }
  }

  // Dashboard Protection
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!payload) return NextResponse.redirect(`${baseUrl}/auth/login?callbackUrl=${nextUrl.pathname}`);
    if (payload.role !== "ADMIN") return NextResponse.redirect(`${baseUrl}/unauthorized`);
  }

  if (nextUrl.pathname.startsWith("/merchant")) {
    if (!payload) return NextResponse.redirect(`${baseUrl}/auth/login?callbackUrl=${nextUrl.pathname}`);
    if (payload.role !== "MERCHANT" && payload.role !== "ADMIN") return NextResponse.redirect(`${baseUrl}/unauthorized`);
    if (payload.role === "MERCHANT" && payload.status === "PENDING") return NextResponse.redirect(`${baseUrl}/account-pending`);
  }

  if (nextUrl.pathname.startsWith("/rider")) {
    if (!payload) return NextResponse.redirect(`${baseUrl}/auth/login?callbackUrl=${nextUrl.pathname}`);
    if (payload.role !== "RIDER" && payload.role !== "ADMIN") return NextResponse.redirect(`${baseUrl}/unauthorized`);
    if (payload.status === "PENDING") return NextResponse.redirect(`${baseUrl}/account-pending`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/merchant/:path*", "/rider/:path*"],
};
