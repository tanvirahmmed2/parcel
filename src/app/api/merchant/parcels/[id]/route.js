import { requireAuth as auth } from "@/lib/auth-shield";
import { connectToDatabase } from "@/lib/db";
import { Parcel } from "@/models/Parcel";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.role !== "MERCHANT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // params.id is correctly captured in a route.js file since Next 13+, wait, Next 13+ passes context object
    const { id } = await params;
    
    await connectToDatabase();
    
    const parcel = await Parcel.findOne({ _id: id, merchantId: session.id });
    if (!parcel) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }
    
    if (parcel.status !== "Pending") {
      return new NextResponse("Can only delete parcels in Pending state", { status: 400 });
    }
    
    await Parcel.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch(e) {
    if (e.message === "NEXT_REDIRECT") throw e;
    console.error("Delete Parcel Error:", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.role !== "MERCHANT") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { id } = await params;
    const body = await req.json();
    
    await connectToDatabase();
    const parcel = await Parcel.findOne({ _id: id, merchantId: session.id });
    
    if (!parcel) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }
    
    // Merchant requesting return
    if (body.action === "RETURN") {
      // Allowing return request generally if not already Delivered
      if (parcel.status === "Delivered" || parcel.status === "Returned") {
         return new NextResponse("Cannot return delivered or already returned parcels", { status: 400 });
      }
      parcel.status = "Returned";
      parcel.history.push({
        status: "Returned",
        message: "Merchant manually marked parcel as returned.",
        updatedBy: session.id
      });
      await parcel.save();
      return NextResponse.json({ success: true, parcel });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch(e) {
    if (e.message === "NEXT_REDIRECT") throw e;
    console.error("Patch Parcel Error:", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
