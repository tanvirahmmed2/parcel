import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { requireAuth as auth } from "@/lib/auth-shield";
import bcrypt from "bcryptjs";
export async function GET(req) {
  try {
    const session = await auth(["ADMIN"]);
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    await connectToDatabase();
    const query = {};
    if (role) query.role = role;
    const users = await User.find(query).select("-password").sort({ createdAt: -1 }).lean();
    return NextResponse.json(users);
  } catch(e) {
    if (e.message === "NEXT_REDIRECT") throw e;
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function PATCH(req) {
  try {
    const session = await auth(["ADMIN"]);
    const { id, status } = await req.json();
    if (!id || !status) return new NextResponse("Bad Request", { status: 400 });
    await connectToDatabase();
    const user = await User.findById(id);
    if (!user) return new NextResponse("Not Found", { status: 404 });
    user.status = status;
    await user.save();
    return NextResponse.json({ success: true, user });
  } catch(e) {
    if (e.message === "NEXT_REDIRECT") throw e;
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    const session = await auth(["ADMIN"]);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("Bad Request", { status: 400 });
    await connectToDatabase();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch(e) {
    if (e.message === "NEXT_REDIRECT") throw e;
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function POST(req) {
  try {
    const session = await auth(["ADMIN"]);
    const { name, email, password, role, phone } = await req.json();
    
    if (!name || !email || !password || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDatabase();
    
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return new NextResponse("User already exists", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      status: "ACTIVE" // Direct admin creation skips pending status
    });

    return NextResponse.json({ success: true, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } }, { status: 201 });
  } catch (e) {
    if (e.message === "NEXT_REDIRECT") throw e;
    console.error("Admin user creation error:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
