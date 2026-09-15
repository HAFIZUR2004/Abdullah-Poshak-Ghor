// app/api/banner/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Banner from "@/models/Banner";

// ডিফল্ট ব্যানার ডেটা
const DEFAULT_BANNER = {
  title: "Crafted for Comfort",
  image: "https://i.ibb.co.com/4RCn5y67/discount.webp",
  link: "/shop",
  isActive: true,
};

// ────────────────────────────────────────────────────────────
// GET — ব্যানার ডেটা পাওয়ার জন্য
// ────────────────────────────────────────────────────────────
export async function GET() {
  try {
    await dbConnect();
    let bannerData = await Banner.findOne();

    // ডাটাবেজে ব্যানার না থাকলে ডিফল্ট ব্যানার ক্রিয়েট করবে
    if (!bannerData) {
      bannerData = await Banner.create(DEFAULT_BANNER);
    }

    return NextResponse.json(
      { success: true, banner: bannerData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET Banner Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch banner data" },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────────────
// PUT — ব্যানার আপডেট করার জন্য
// ────────────────────────────────────────────────────────────
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { title, image, link, isActive } = body || {};

    // ছবি চেক করা
    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 }
      );
    }

    // পুরোনো ডাটা মুছে নতুন ফ্রেস ব্যানার সেট করা
    await Banner.deleteMany({});
    const updatedBanner = await Banner.create({
      title: title || "",
      image: image.trim(),
      link: link || "/shop",
      isActive: isActive ?? true,
    });

    return NextResponse.json(
      { success: true, banner: updatedBanner },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT Banner Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update banner" },
      { status: 500 }
    );
  }
}