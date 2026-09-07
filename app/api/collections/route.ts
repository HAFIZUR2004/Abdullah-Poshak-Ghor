// app/api/collections/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import Product from "@/models/Product";

// GET - Fetch collection by type
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    
    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }
    
    const validTypes = [
      "best-seller", 
      "today-deal", 
      "new-arrival",
      "deal-of-the-week",
      "top-rated"
    ];
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid collection type" },
        { status: 400 }
      );
    }
    
    const collection = await Collection.findOne({ type }).populate("productIds");
    
    if (!collection) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(collection.productIds || []);
  } catch (error) {
    console.error("GET collection error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

// POST - Add/Remove products from collection
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { type, productIds, action } = body;
    
    if (!type || !productIds) {
      return NextResponse.json(
        { error: "Type and productIds are required" },
        { status: 400 }
      );
    }
    
    const validTypes = [
      "best-seller", 
      "today-deal", 
      "new-arrival",
      "deal-of-the-week",
      "top-rated"
    ];
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid collection type" },
        { status: 400 }
      );
    }
    
    // Get current collection
    let collection = await Collection.findOne({ type });
    
    if (!collection) {
      // Create new collection if not exists
      collection = new Collection({
        type,
        productIds: [],
      });
    }
    
    // Update productIds based on action
    let updatedProductIds: string[];
    
    if (action === "remove") {
      // Remove products from collection
      updatedProductIds = collection.productIds.filter(
        (id: string) => !productIds.includes(id.toString())
      );
    } else {
      // Add products to collection (deduplicate)
      const currentIds = collection.productIds.map((id: any) => id.toString());
      const newIds = productIds.filter(
        (id: string) => !currentIds.includes(id)
      );
      updatedProductIds = [...collection.productIds, ...newIds];
    }
    
    // Update collection
    collection.productIds = updatedProductIds;
    collection.updatedAt = new Date();
    await collection.save();
    
    // Update product flags - শুধু সিলেক্ট করা প্রোডাক্টের ফ্ল্যাগ পরিবর্তন করবে
    const flagMap: Record<string, string> = {
      "best-seller": "isBestSeller",
      "today-deal": "isTodayDeal",
      "new-arrival": "isNewArrival",
      "deal-of-the-week": "isDealOfTheWeek",
      "top-rated": "isTopRated"
    };
    
    const flagField = flagMap[type];
    
    if (flagField) {
      if (action === "remove") {
        // Remove করে দিলে flag false করবে
        await Product.updateMany(
          { _id: { $in: productIds } },
          { [flagField]: false }
        );
      } else {
        // Add করলে flag true করবে
        await Product.updateMany(
          { _id: { $in: productIds } },
          { [flagField]: true }
        );
      }
    }
    
    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.error("POST collection error:", error);
    return NextResponse.json(
      { error: "Failed to save collection" },
      { status: 500 }
    );
  }
}