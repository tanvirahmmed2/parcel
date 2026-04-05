import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const secretKey = process.env.NEXTAUTH_SECRET || "fallback_secret_key";
const encodedKey = new TextEncoder().encode(secretKey);
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
export async function createSessionCookie(payload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, 
    path: "/",
  });
  return token;
}
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
export async function getSessionPayload() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  return await verifyToken(sessionToken);
}
