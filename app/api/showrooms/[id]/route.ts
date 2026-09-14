import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "sareng_furniture";
const COLLECTION = "showrooms";

// DELETE SHOWROOM
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // 🟢 Dynamic Route Params Await করা আবশ্যক
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid Showroom ID" },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Showroom not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Showroom deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Showroom Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete showroom" },
      { status: 500 }
    );
  }
}