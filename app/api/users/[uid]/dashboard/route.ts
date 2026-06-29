import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RouteParams {
  params: {
    uid: string;
  };
}

interface Address {
  division: string;
  district: string;
  thana: string;
  address: string;
}

interface UserUpdateData {
  updatedAt: Date;
  name?: string;
  email?: string;
  phone?: string;
  address?: Address;
  photoURL?: string;
}

interface Order {
  _id: ObjectId;
  orderStatus: string;
  totalAmount: number;
  createdAt: Date;
}

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  wishlistCount: number;
  recentOrders: Order[];
  pendingOrders: number;
  deliveredOrders: number;
}

// GET - ইউজারের ড্যাশবোর্ড ডাটা
export async function GET(request: NextRequest, context: any) {
  try {
    const params = await (context?.params ?? {});
    const { uid } = params || {};
    const userId = uid;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    // Get user
    const user = await db.collection("users").findOne({
      $or: [{ uid: userId }, { _id: new ObjectId(userId) }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Get user orders
    const orders = (await db
      .collection("orders")
      .find({ userId: user.uid })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()) as Order[];

    // Get wishlist items
    const wishlist = await db
      .collection("wishlist")
      .find({ userId: user.uid })
      .toArray();

    // Calculate stats
    const stats: DashboardStats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0,
      ),
      wishlistCount: wishlist.length,
      recentOrders: orders.slice(0, 5),
      pendingOrders: orders.filter((o: Order) => o.orderStatus === "pending")
        .length,
      deliveredOrders: orders.filter(
        (o: Order) => o.orderStatus === "delivered",
      ).length,
    };

    // Format response
    const formattedUser = {
      ...user,
      _id: user._id.toString(),
      id: user._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        user: formattedUser,
        stats,
        recentOrders: stats.recentOrders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}


// 🆕 POST - নতুন ইউজার ডেটাবেজে সেভ বা আপডেট করা
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, name, email, mobile, provider, photoURL } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "UID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    // ইউজার আগে থেকেই আছে কিনা চেক করি
    const existingUser = await db.collection("users").findOne({ uid });

    if (existingUser) {
      // ইউজার থাকলে শুধু তথ্য আপডেট করি (যেমন: লাস্ট লগইন বা প্রোফাইল পিকচার)
      await db.collection("users").updateOne(
        { uid },
        {
          $set: {
            name: name || existingUser.name,
            email: email || existingUser.email,
            mobile: mobile || existingUser.mobile,
            photoURL: photoURL || existingUser.photoURL,
            updatedAt: new Date(),
          },
        }
      );

      const updatedUser = await db.collection("users").findOne({ uid });
      return NextResponse.json(
        { success: true, message: "User updated successfully", user: updatedUser },
        { status: 200 }
      );
    }

    // ইউজার একদম নতুন হলে নতুন ডকুমেন্ট তৈরি করি
    const newUser = {
      uid,
      name: name || "Anonymous User",
      email: email || "",
      mobile: mobile || "",
      photoURL: photoURL || "",
      provider: provider || "email",
      role: "user", // Default role
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully in database",
        user: { ...newUser, _id: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST User Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save user to database" },
      { status: 500 }
    );
  }
}

// PUT - ইউজারের ড্যাশবোর্ড আপডেট (প্রোফাইল)
export async function PUT(request: NextRequest, context: any) {
  try {
    const params = await (context?.params ?? {});
    const { uid } = params || {};
    const userId = uid;
    const body = await request.json();
    const { name, email, phone, address, photoURL } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    // ✅ 'any' সরানো হয়েছে - proper type definition
    const updateData: UserUpdateData = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (photoURL) updateData.photoURL = photoURL;

    const result = await db
      .collection("users")
      .updateOne(
        { $or: [{ uid: userId }, { _id: new ObjectId(userId) }] },
        { $set: updateData },
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Get updated user
    const updatedUser = await db.collection("users").findOne({
      $or: [{ uid: userId }, { _id: new ObjectId(userId) }],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
          ? {
            ...updatedUser,
            _id: updatedUser._id.toString(),
            id: updatedUser._id.toString(),
          }
          : null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
