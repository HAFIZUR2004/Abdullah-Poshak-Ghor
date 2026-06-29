import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Get user favorites
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    const user = await db.collection("users").findOne({ uid: userId });
    const favoriteIds = user?.favorites || [];

    // Get product details
    const products = await db
      .collection("products")
      .find({ _id: { $in: favoriteIds.map((id: string) => new ObjectId(id)) } })
      .toArray();

    return NextResponse.json({ success: true, favorites: products });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 },
    );
  }
}

// POST - Add to favorites
export async function POST(request: Request) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    await db
      .collection("users")
      .updateOne({ uid: userId }, { $addToSet: { favorites: productId } });

    return NextResponse.json({ success: true, message: "Added to favorites" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 },
    );
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: Request) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    await db
      .collection("users")
      .updateOne({ uid: userId }, { $pull: { favorites: productId } });

    return NextResponse.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 },
    );
  }
}
