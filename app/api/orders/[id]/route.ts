import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    // URL থেকে কুয়েরি প্যারামিটারগুলো নেওয়া
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const phone = searchParams.get("phone");

    if (!orderId || !phone) {
      return NextResponse.json(
        { error: "Order ID and Phone number are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    // ডাটাবেজে Order ID এবং Phone Number দিয়ে সার্চ করা
    // আপনার Schema অনুযায়ী formData.phone চেক করা হচ্ছে
    const order = await db.collection("orders").findOne({
      orderId: orderId,
      "formData.phone": phone,
    });

    if (!order) {
      return NextResponse.json(
        { error: "অর্ডারটি পাওয়া যায়নি। সঠিক তথ্য দিন।" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Tracking Error:", error);
    return NextResponse.json(
      { error: "সার্ভারে সমস্যা হয়েছে, পরে চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}