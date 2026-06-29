// app/api/admin/dashboard/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    // Get total orders
    const totalOrders = await db.collection("orders").countDocuments();
    
    // Get pending orders
    const pendingOrders = await db.collection("orders").countDocuments({
      orderStatus: "pending"
    });
    
    // Get total revenue
    const revenueResult = await db.collection("orders").aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]).toArray();
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Get total users
    const totalUsers = await db.collection("users").countDocuments();

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalUsers
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}