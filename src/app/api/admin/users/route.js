import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { requireAuth as auth } from "@/lib/auth-shield";
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
