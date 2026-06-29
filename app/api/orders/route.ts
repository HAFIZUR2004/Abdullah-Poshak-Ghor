import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    const newOrder = {
      orderId: body.orderId || `ORD-${Date.now()}`,
      cartItems: body.cartItems || [],
      formData: body.formData || {},
      subtotal: body.subtotal || 0,
      deliveryCharge: body.deliveryCharge || 0,
      totalAmount: body.totalAmount || 0,
      paymentMethod: body.paymentMethod || "cod",
      orderStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(newOrder);
    return NextResponse.json({ ...newOrder, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    let query: Record<string, unknown> = {};
    if (status && status !== "all") {
      query.orderStatus = status;
    }

    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Format orders with default values
    const formattedOrders = orders.map(order => ({
      ...order,
      totalAmount: order.totalAmount || (Number(order.subtotal || 0) + Number(order.deliveryCharge || 0)),
      orderStatus: order.orderStatus || "pending",
      _id: order._id.toString()
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}