import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

async function connectDb() {
  await clientPromise;
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET() {
  try {
    await connectDb();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const image = typeof body.image === "string" ? body.image.trim() : "";

    // ✅ শুধু name required
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCategory = await Category.create({ name, slug, image });
    return NextResponse.json(
      { success: true, category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}