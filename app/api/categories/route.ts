import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

async function connectDb() {
  const client = await clientPromise;
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET() {
  try {
    await connectDb();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { name, image } = await req.json();

    if (!name || !image) {
      return NextResponse.json({ success: false, message: "Name and image are required" }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newCategory = await Category.create({ name, slug, image });
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}