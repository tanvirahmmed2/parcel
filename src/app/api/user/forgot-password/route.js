import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { signToken } from "@/lib/jwt";
import { sendResetPasswordEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    await connectToDatabase();
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // For security reasons, don't reveal if a user exists or not
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: "If an account exists for this email, a reset link has been sent." 
      });
    }

    // Generate a reset token valid for 1 hour
    const resetToken = await signToken({ 
      intent: "RESET_PASSWORD", 
      id: user._id.toString(),
      email: user.email 
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    try {
      await sendResetPasswordEmail(user.email, user.name, resetUrl);
    } catch(e) {
      console.warn("Could not dispatch reset email, dropping token to console: ", resetUrl);
    }

    return NextResponse.json({ 
      success: true, 
      message: "If an account exists for this email, a reset link has been sent." 
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
