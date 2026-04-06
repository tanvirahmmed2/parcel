import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { createSessionCookie } from "@/lib/jwt";
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse("No account found with this email", { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new NextResponse("Incorrect password", { status: 401 });
    }
    if (user.role !== "ADMIN" && user.status !== "ACTIVE") {
      if (user.status === "SUSPENDED") {
         return new NextResponse("Account suspended", { status: 403 });
      }
    }
    const payload = {
      id: user._id.toString(),
      name: user.name || user.storeName || "Vendor",
      email: user.email,
      role: user.role,
      status: user.status
    };
    await createSessionCookie(payload);
    return NextResponse.json({ success: true,message:'Successfully logged in', role: user.role, status: user.status });
  } catch (err) {
    console.error("Login API Error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
