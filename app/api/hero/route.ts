import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "sareng_furniture";
const COLLECTION = "heroes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    const heroData = await collection.findOne({});

    const heroImages: string[] = Array.isArray(heroData?.heroImages)
      ? heroData.heroImages.filter(
          (img: unknown) =>
            typeof img === "string" && img.trim().length > 0
        )
      : [];

    return NextResponse.json(
      {
        success: true,
        hero: {
          heroImages,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("GET Hero Error:", error);

    return NextResponse.json(
      {
        success: false,
        hero: {
          heroImages: [],
        },
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

// ==========================================================
// PUT
// ==========================================================

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
          message: "Exactly 3 hero images are required",
        },
        { status: 400 }
      );
    }

    const validImages = heroImages.every(
      (img: unknown) =>
        typeof img === "string" && img.trim().length > 0
    );

    if (!validImages) {
      return NextResponse.json(
        {
          success: false,
          message: "All hero images must have valid URLs",
        },
        { status: 400 }
      );
    }

    const cleanImages = heroImages.map((img: string) => img.trim());

    await collection.deleteMany({});

    const result = await collection.insertOne({
      heroImages: cleanImages,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatedHero = await collection.findOne({
      _id: result.insertedId,
    });

    // Revalidate home page
    const { revalidatePath } = await import("next/cache");

    revalidatePath("/");

    return NextResponse.json(
      {
        success: true,
        hero: updatedHero,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error: any) {
    console.error("PUT Hero Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to update hero",
      },
      {
        status: 500,
      }
    );
  }
}