// app/api/banner/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Banner } from "@/models/Banner";
import mongoose from "mongoose";

async function connectDb() {
  await clientPromise;
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

// ─── GET Banner ──────────────────────────────────────────────────────────────
export async function GET() {
  try {
    await connectDb();
    
    let banner = await Banner.findOne({ isActive: true });
    
    // If no banner exists, create default
    if (!banner) {
      banner = await Banner.create({
        title: "Crafted for Comfort",
        image: "https://i.ibb.co.com/4RCn5y67/discount.webp",
        link: "/shop",
        isActive: true,
      });
    }
    
    return NextResponse.json({ success: true, banner }, { status: 200 });
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// ─── UPDATE Banner ───────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    await connectDb();
    const { title, image, link, isActive } = await req.json();

    let banner = await Banner.findOne({ isActive: true });

    if (!banner) {
      // Create new if not exists
      banner = await Banner.create({
        title: title || "Crafted for Comfort",
        image: image || "https://i.ibb.co.com/4RCn5y67/discount.webp",
        link: link || "/shop",
        isActive: true,
      });
    } else {
      // Update existing
      banner.title = title || banner.title;
      banner.image = image || banner.image;
      banner.link = link || banner.link;
      banner.isActive = isActive !== undefined ? isActive : banner.isActive;
      banner.updatedAt = new Date();
      await banner.save();
    }

    return NextResponse.json({ success: true, banner }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update banner" },
      { status: 500 }
    );
  }
}