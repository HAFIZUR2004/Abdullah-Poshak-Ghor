import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "sareng_furniture";
const COLLECTION = "showrooms";

// GET ALL SHOWROOMS
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    const showrooms = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, data: showrooms }, { status: 200 });
  } catch (error: any) {
    console.error("GET Showrooms Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch showrooms" },
      { status: 500 }
    );
  }
}

// CREATE NEW SHOWROOM
export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    const body = await req.json();
    const { city, address, phone } = body;

    if (!city || !address || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newShowroom = {
      city: city.trim(),
      address: address.trim(),
      phone: phone.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newShowroom);
    const insertedShowroom = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json(
      { success: true, data: insertedShowroom },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Showroom Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create showroom" },
      { status: 500 }
    );
  }
}