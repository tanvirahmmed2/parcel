import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const secretKey = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback_secret_key";
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req) {
  const { nextUrl, cookies } = req;
  const baseUrl = nextUrl.origin;
  const sessionToken = cookies.get("session")?.value;
  const pathname = nextUrl.pathname;

  let payload = null;
  if (sessionToken) {
    try {
      const verified = await jwtVerify(sessionToken, encodedKey, { algorithms: ["HS256"] });
      payload = verified.payload;
    } catch (e) {
      payload = null;
    }
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (payload) {
      const target = payload.role === "ADMIN" ? "/admin" : payload.role === "MERCHANT" ? "/merchant" : payload.role === "HUB" ? "/hub" : "/rider";
      return NextResponse.redirect(`${baseUrl}${target}`);
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/admin") || 
    pathname.startsWith("/merchant") || 
    pathname.startsWith("/rider") || 
    pathname.startsWith("/hub") || 
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/hub")
  ) {
    if (!payload) {
      return NextResponse.redirect(`${baseUrl}/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }

    if (payload.role !== "ADMIN" && payload.status === "PENDING") {
      if (!pathname.startsWith("/account-pending")) {
         return NextResponse.redirect(`${baseUrl}/account-pending`);
      }
    }

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (payload.role !== "ADMIN") return NextResponse.redirect(`${baseUrl}/unauthorized`);
    }

    if (pathname.startsWith("/merchant") && payload.role !== "MERCHANT" && payload.role !== "ADMIN") {
       return NextResponse.redirect(`${baseUrl}/unauthorized`);
    }

    if (pathname.startsWith("/rider") && payload.role !== "RIDER" && payload.role !== "ADMIN") {
       return NextResponse.redirect(`${baseUrl}/unauthorized`);
    }

    if (pathname.startsWith("/hub") && payload.role !== "HUB" && payload.role !== "ADMIN") {
       return NextResponse.redirect(`${baseUrl}/unauthorized`);
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/admin/:path*", 
    "/merchant/:path*", 
    "/rider/:path*", 
    "/hub/:path*", 
    "/api/admin/:path*",
    "/api/hub/:path*",
    "/login",
    "/register"
  ],
};