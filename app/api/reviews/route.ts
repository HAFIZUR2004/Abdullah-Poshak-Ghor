// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import Review from "@/models/Review";  // ✅ import default
import mongoose from "mongoose";

async function connectDb() {
  await clientPromise;
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

// ─── GET All Reviews ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    await connectDb();
    const reviews = await Review.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(20);
    
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// ─── POST Create Review ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();

    const { name, location, text, rating, verified, image } = body;

    // Validation
    if (!name || !location || !text) {
      return NextResponse.json(
        { success: false, message: "Name, location, and text are required" },
        { status: 400 }
      );
    }

    // Count total reviews for order
    const count = await Review.countDocuments();
    
    const newReview = await Review.create({
      name,
      location,
      text,
      rating: rating || 5,
      verified: verified !== undefined ? verified : true,
      image: image || "",
      order: count,
      isActive: true,
    });

    return NextResponse.json(
      { success: true, review: newReview },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create review" },
      { status: 500 }
    );
  }
}