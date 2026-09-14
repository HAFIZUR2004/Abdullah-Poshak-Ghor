import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DEFAULT_IMAGES = [
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
];

const DB_NAME = "sareng_furniture";
const COLLECTION = "heroes";

// GET
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    let heroData = await collection.findOne({});

    if (!heroData) {
      const result = await collection.insertOne({
        heroImages: DEFAULT_IMAGES,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      heroData = await collection.findOne({ _id: result.insertedId });
    }

    // Fix broken structure
    if (
      !Array.isArray(heroData?.heroImages) ||
      heroData.heroImages.length !== 3
    ) {
      await collection.updateOne(
        { _id: heroData!._id },
        { $set: { heroImages: DEFAULT_IMAGES, updatedAt: new Date() } }
      );
      heroData = await collection.findOne({ _id: heroData!._id });
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

// PUT
export async function PUT(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

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

    // ✅ পুরোনো document মুছে fresh বানাই
    await collection.deleteMany({});
    const result = await collection.insertOne({
      heroImages,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatedHero = await collection.findOne({ _id: result.insertedId });

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