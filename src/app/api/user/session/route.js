import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth-shield";
import { clearSessionCookie } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    await connectToDatabase();
    
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return NextResponse.json({ success: false, message: "No account found with this email" }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
    }
    if (user.role !== "ADMIN" && user.status !== "ACTIVE") {
      if (user.status === "SUSPENDED") {
         return NextResponse.json({ success: false, message: "Account suspended" }, { status: 403 });
      }
    }
    const payload = {
      id: user._id.toString(),
      name: user.name || user.storeName || "Vendor",
      email: user.email,
      role: user.role,
      status: user.status
    };
    await createSession(payload);

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully logged in', 
      user: payload 
    });
  } catch (err) {
    console.error("Login API Error", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
