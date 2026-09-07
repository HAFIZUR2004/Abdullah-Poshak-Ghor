// app/api/reviews/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import Review from "@/models/Review";
import mongoose from "mongoose";

async function connectDb() {
  await clientPromise;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

// ─── GET Single Review ────────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        { status: 400 }
      );
    }

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching review:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch review",
      },
      { status: 500 }
    );
  }
}

// ─── PUT Update Review ────────────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const { id } = await params;
    const body = await req.json();

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        { status: 400 }
      );
    }

    const {
      name,
      location,
      text,
      rating,
      verified,
      isActive,
      order,
      image,
    } = body;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        name,
        location,
        text,
        rating,
        verified,
        isActive,
        order,
        image: image || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        review: updatedReview,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating review:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update review",
      },
      { status: 500 }
    );
  }
}

// ─── DELETE Review ────────────────────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        { status: 400 }
      );
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Review deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting review:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete review",
      },
      { status: 500 }
    );
  }
}