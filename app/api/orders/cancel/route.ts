// app/api/orders/cancel/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, userId } = body;

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: "Order ID and User ID are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    // Find the order
    const order = await db.collection("orders").findOne({
      orderId: orderId
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if order can be cancelled (only pending orders)
    if (order.orderStatus !== "pending") {
      return NextResponse.json(
        { error: "Order cannot be cancelled. It is already processed." },
        { status: 400 }
      );
    }

    // Cancel the order
    const result = await db.collection("orders").updateOne(
      { orderId: orderId },
      { 
        $set: { 
          orderStatus: "cancelled",
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to cancel order" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Order cancelled successfully",
        orderId: orderId,
        status: "cancelled"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Order cancellation error:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}