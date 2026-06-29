import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface RouteParams {
  params: {
    uid: string;
  };
}

interface UpdateData {
  updatedAt: Date;
  role?: string;
  status?: string;
  name?: string;
  email?: string;
  mobile?: string;
  photoURL?: string;
}

// GET - নির্দিষ্ট ইউজার পাওয়া
export async function GET(request: NextRequest, context: any) {
  try {
    const params = await (context?.params ?? {});
    const { uid } = params || {};

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    const user = await db.collection("users").findOne({ uid });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Format user data
    const formattedUser = {
      ...user,
      _id: user._id.toString(),
      id: user._id.toString(),
    };

    return NextResponse.json(
      { success: true, user: formattedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET User Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

// PUT - নির্দিষ্ট ইউজার আপডেট করুন
export async function PUT(request: NextRequest, context: any) {
  try {
    const params = await (context?.params ?? {});
    const { uid } = params || {};
    const body = await request.json();
    const { role, status, name, email, mobile, photoURL } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    // ✅ 'any' সরানো হয়েছে - টাইপ ডিফাইন করা হয়েছে
    const updateData: UpdateData = {
      updatedAt: new Date(),
    };

    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;
    if (photoURL) updateData.photoURL = photoURL;

    const result = await db
      .collection("users")
      .updateOne({ uid }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Get updated user
    const updatedUser = await db.collection("users").findOne({ uid });
    const formattedUser = updatedUser
      ? {
        ...updatedUser,
        _id: updatedUser._id.toString(),
        id: updatedUser._id.toString(),
      }
      : null;

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: formattedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 },
    );
  }
}

// DELETE - নির্দিষ্ট ইউজার ডিলিট করুন
export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await (context?.params ?? {});
    const { uid } = params || {};

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    const result = await db.collection("users").deleteOne({ uid });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
