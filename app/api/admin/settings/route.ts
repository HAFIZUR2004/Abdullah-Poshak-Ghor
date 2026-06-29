import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("demosolidbazar");
    const settings = await db
      .collection("settings")
      .findOne({ key: "store_settings" });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch settings",
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    await db
      .collection("settings")
      .updateOne(
        { key: "store_settings" },
        { $set: { ...body, key: "store_settings", updatedAt: new Date() } },
        { upsert: true },
      );

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to save settings",
    });
  }
}
