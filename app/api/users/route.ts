// app/api/users/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface UserData {
  uid: string;
  name?: string;
  email?: string;
  mobile?: string;
  provider?: string;
  photoURL?: string;
  role?: string;
  adminSecret?: string;
}

// GET - সব ইউজার ফেচ করুন (Admin এর জন্য)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    const client = await clientPromise;
    const db = client.db("sareng_furniture");

    const query: any = {};
    if (uid) query.uid = uid;
    if (email) query.email = email;
    if (role) query.role = role;

    const users = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formattedUsers = users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      id: user._id.toString(),
    }));

    if (uid && formattedUsers.length === 1) {
      return NextResponse.json(
        { success: true, user: formattedUsers[0] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: true, users: formattedUsers },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

// POST - নতুন ইউজার তৈরি বা আপডেট করুন
export async function POST(request: Request) {
  try {
    const body: UserData = await request.json();
    console.log("📦 Received body:", body);

    const { uid, name, email, mobile, provider, photoURL } = body;

    if (!uid) {
      console.error("❌ UID missing");
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture"); // ✅ Correct database name
    console.log("✅ Connected to Sareng_Furniture database");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ uid });
    console.log("🔍 Existing user:", existingUser);

    if (existingUser) {
      // Update existing user
      const updateData = {
        $set: {
          name: name || existingUser.name,
          email: email || existingUser.email,
          mobile: mobile || existingUser.mobile,
          photoURL: photoURL || existingUser.photoURL,
          provider: provider || existingUser.provider,
          updatedAt: new Date(),
          lastLogin: new Date(),
        },
      };

      await db.collection("users").updateOne({ uid }, updateData);
      console.log("✅ User updated");

      const updatedUser = await db.collection("users").findOne({ uid });

      return NextResponse.json(
        {
          success: true,
          message: "User updated successfully",
          user: {
            ...updatedUser,
            _id: updatedUser?._id.toString(),
            id: updatedUser?._id.toString(),
            role: updatedUser?.role || "user",
          },
        },
        { status: 200 },
      );
    }

    // Create new user
    const newUser = {
      uid,
      name: name || "",
      email: email || "",
      mobile: mobile || "",
      provider: provider || "email",
      photoURL: photoURL || "",
      role: "user", // Default role
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      address: {
        division: "",
        district: "",
        thana: "",
        address: "",
      },
    };

    console.log("📝 Creating new user:", newUser);
    await db.collection("users").insertOne(newUser);
    console.log("✅ User created successfully");

    const createdUser = await db.collection("users").findOne({ uid });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          ...createdUser,
          _id: createdUser?._id.toString(),
          id: createdUser?._id.toString(),
          role: createdUser?.role || "user",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ User creation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create user",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

// PUT - ইউজার আপডেট করুন
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { uid, role, name, email, mobile, status, photoURL } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture");

    const updateFields: any = { updatedAt: new Date() };
    if (role) updateFields.role = role;
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (mobile) updateFields.mobile = mobile;
    if (status) updateFields.status = status;
    if (photoURL) updateFields.photoURL = photoURL;

    const result = await db
      .collection("users")
      .updateOne({ uid }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const updatedUser = await db.collection("users").findOne({ uid });

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: updatedUser
          ? { ...updatedUser, _id: updatedUser._id.toString() }
          : null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 },
    );
  }
}

// DELETE - ইউজার ডিলিট করুন
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture");

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
    console.error("User delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 },
    );
  }
}