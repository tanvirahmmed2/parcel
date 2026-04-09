import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return new NextResponse("Missing token or password", { status: 400 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.intent !== "RESET_PASSWORD") {
      return new NextResponse("Invalid or expired token", { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.id);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "Password reset successful. You can now login with your new password." 
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
