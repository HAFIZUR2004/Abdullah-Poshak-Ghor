import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // আপনার DB Connection Helper Path
import CustomSection from "@/models/CustomSection";

// GET: কাস্টম ইমেজের তথ্য ফেচ করবে
export async function GET() {
  try {
    await connectDB();
    const data = await CustomSection.findOne();
    if (!data) {
      return NextResponse.json({ imageUrl: "/images/customizesection.jpeg" });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch custom section data" },
      { status: 500 }
    );
  }
}

// POST: নতুন ইমেজ আপডেট বা ক্রিয়েট করবে
export async function POST(req: Request) {
  try {
    await connectDB();
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    let data = await CustomSection.findOne();
    if (data) {
      data.imageUrl = imageUrl;
      await data.save();
    } else {
      data = await CustomSection.create({ imageUrl });
    }

    return NextResponse.json({
      message: "Custom section image updated successfully!",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update custom section" },
      { status: 500 }
    );
  }
}

// DELETE: ইমেজ মুছে ডিফল্ট ইমেজে ব্যাক করবে
export async function DELETE() {
  try {
    await connectDB();
    await CustomSection.deleteMany({});
    return NextResponse.json({
      message: "Custom image deleted. Reverted to default.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete custom image" },
      { status: 500 }
    );
  }
}