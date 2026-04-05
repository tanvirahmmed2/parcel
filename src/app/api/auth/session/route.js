import { getSessionPayload } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSessionPayload();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return NextResponse.json({ user: session });
}
