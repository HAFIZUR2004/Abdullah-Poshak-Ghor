// app/api/hero/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";  // ✅ named import
import Hero from "@/models/Hero";

const DEFAULT_IMAGES = [
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
];

// ────────────────────────────────────────────────────────────
// GET — 3 hero images
// ────────────────────────────────────────────────────────────
export async function GET() {
  try {
    await dbConnect();   // ✅
    let heroData = await Hero.findOne();

    if (!heroData) {
      heroData = await Hero.create({ heroImages: DEFAULT_IMAGES });
    }

    // পুরোনো / ভাঙা structure হলে fix
    if (
      !Array.isArray(heroData.heroImages) ||
      heroData.heroImages.length !== 3
    ) {
      heroData.heroImages = DEFAULT_IMAGES;
      await heroData.save();
    }

    return NextResponse.json(
      { success: true, hero: heroData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hero data" },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────────────────
// PUT — 3 images update
// ────────────────────────────────────────────────────────────
export async function PUT(req: Request) {
  try {
    await dbConnect();   // ✅ এটাই সঠিক
    const body = await req.json();

    const heroImages = body?.heroImages;

    if (!Array.isArray(heroImages) || heroImages.length !== 3) {
      return NextResponse.json(
        {
          success: false,
          message: "heroImages must be an array of exactly 3 items",
        },
        { status: 400 }
      );
    }

    if (!heroImages.every((img) => typeof img === "string" && img.trim())) {
      return NextResponse.json(
        { success: false, message: "All 3 images must have valid URLs" },
        { status: 400 }
      );
    }

    // ✅ পুরোনো field সব মুছে fresh document বানানো
    await Hero.deleteMany({});
    const updatedHero = await Hero.create({ heroImages });

    return NextResponse.json(
      { success: true, hero: updatedHero },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update hero" },
      { status: 500 }
    );
  }
}