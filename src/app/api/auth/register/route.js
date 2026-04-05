import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { sendMail } from "@/lib/mail";
export async function POST(req) {
  try {
    const data = await req.json();
    const { name, storeName, email, phone, password, role } = data;
    if (!email || !password || !name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    await connectToDatabase();
    const existing = await User.findOne({ email });
    if (existing) {
      return new NextResponse("Email already exists", { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      storeName,
      email,
      phone,
      password: hashedPassword,
      role: role || "MERCHANT", 
      status: "PENDING"
    });
    await newUser.save();
    const verifyToken = await signToken({ intent: "VERIFY_EMAIL", id: newUser._id.toString() });
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify?token=${verifyToken}`;
    try {
      await sendMail({
        to: email,
        subject: "Verify Your Percel Account",
        htmlContent: `<h2>Welcome to Percel, ${name}!</h2>
        <p>Please click the link below to verify your email. Once verified, your account will enter the approval queue.</p>
        <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background-color:#0f172a;color:#ffffff;text-decoration:none;border-radius:8px;">Verify Email</a>`
      });
    } catch(e) {
      console.warn("Could not dispatch verification email, dropping token to console: ", verificationUrl);
    }
    return NextResponse.json({ success: true, message: "Registered. Please verify your email." });
  } catch (err) {
    console.error("Registration Error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
