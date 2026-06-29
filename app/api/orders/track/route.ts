import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const phone = searchParams.get("phone");

    if (!orderId || !phone) {
      return NextResponse.json(
        { error: "Order ID and Phone number required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    // অর্ডার খুঁজুন
    const order = await db.collection("orders").findOne({
      orderId: orderId,
      "formData.phone": phone
    });

    if (!order) {
      return NextResponse.json(
        { error: "No order found with this ID and phone number" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}