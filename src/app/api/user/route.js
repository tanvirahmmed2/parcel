import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { sendMail } from "@/lib/mail";
import { createSession, requireAuth as auth } from "@/lib/auth-shield";

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, storeName, email, phone, password, role } = data;
    if (!email || !password || !name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    await connectToDatabase();
    
    // Convert to lowercase and trim
    const normalizedEmail = email.toLowerCase().trim();
    
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return new NextResponse("Email already exists", { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      storeName,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: role || "MERCHANT", 
      status: "PENDING"
    });
    await newUser.save();
    
    const verifyToken = await signToken({ intent: "VERIFY_EMAIL", id: newUser._id.toString() });
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify?token=${verifyToken}`;
    
    try {
      await sendMail({
        to: normalizedEmail,
        subject: "Verify Your Parcel Account",
        htmlContent: `<h2>Welcome to Parcel, ${name}!</h2>
        <p>Please click the link below to verify your email. Once verified, your account will enter the approval queue.</p>
        <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background-color:#0f172a;color:#ffffff;text-decoration:none;border-radius:8px;">Verify Email</a>`
      });
    } catch(e) {
      console.warn("Could not dispatch verification email, dropping token to console: ", verificationUrl);
    }
    
    const payload = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status
    };
    await createSession(payload);

    return NextResponse.json({ 
      success: true, 
      message: "Registered successfully. You are pending approval.",
      user: payload 
    });
  } catch (err) {
    console.error("Registration Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    
    const data = await req.json();
    await connectToDatabase();
    
    const user = await User.findById(session.id);
    if (!user) return new NextResponse("Not Found", { status: 404 });
    
    if (data.name) user.name = data.name;
    if (data.phone) user.phone = data.phone;
    if (data.storeName !== undefined) user.storeName = data.storeName;
    if (data.bankDetails) {
      user.bankDetails = { ...user.bankDetails, ...data.bankDetails };
    }
    
    await user.save();
    return NextResponse.json({ success: true, user });
  } catch(e) {
    if (e.message === "NEXT_REDIRECT") throw e;
    console.error("Update profile error:", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
