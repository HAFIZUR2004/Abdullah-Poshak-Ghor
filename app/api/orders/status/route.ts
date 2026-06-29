// app/api/orders/status/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    // অর্ডার স্ট্যাটাস আপডেট করুন
    const result = await db.collection("orders").updateOne(
      { orderId: orderId },
      { 
        $set: { 
          orderStatus: status,
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Order status updated successfully",
        orderId: orderId,
        status: status
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}