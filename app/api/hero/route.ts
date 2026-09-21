// app/api/hero/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "sareng_furniture";
const COLLECTION = "heroes";

export const revalidate = 60; // 60 সেকেন্ড cache

// ==================== GET ====================
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    const heroData = await collection.findOne({});

    // ✅ DB তে কিছু না থাকলে empty array পাঠাই, static কিছু না
    const heroImages: string[] = Array.isArray(heroData?.heroImages)
      ? heroData.heroImages.filter(
          (img: unknown) => typeof img === "string" && img.trim() !== ""
        )
      : [];

    return NextResponse.json(
      { success: true, hero: { heroImages } },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, hero: { heroImages: [] } },
      { status: 500 }
    );
  }
}

// ==================== PUT ====================
export async function PUT(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    const body = await req.json();
    const heroImages = body?.heroImages;

    // ✅ Array check (1 থেকে 10 টা image allow)
    if (!Array.isArray(heroImages) || heroImages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "heroImages must be a non-empty array",
        },
        { status: 400 }
      );
    }

    if (heroImages.length > 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum 10 images allowed",
        },
        { status: 400 }
      );
    }

    if (!heroImages.every((img) => typeof img === "string" && img.trim())) {
      return NextResponse.json(
        { success: false, message: "All images must have valid URLs" },
        { status: 400 }
      );
    }

    // ✅ পুরোনো document মুছে fresh বানাই
    await collection.deleteMany({});
    const result = await collection.insertOne({
      heroImages,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatedHero = await collection.findOne({ _id: result.insertedId });

    // ✅ Cache revalidate
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/api/hero");

    return NextResponse.json(
      { success: true, hero: updatedHero },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("PUT Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update hero" },
      { status: 500 }
    );
  }
}