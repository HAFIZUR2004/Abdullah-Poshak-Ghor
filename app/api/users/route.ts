import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

// GET /api/users?role=admin&status=active&search=email@example.com
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ code: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture");
    const usersCollection = db.collection("users");

    const sessionUser = await usersCollection.findOne({ uid: session.uid });
    if (
      !sessionUser ||
      (sessionUser.role !== "admin" && sessionUser.role !== "super_admin")
    ) {
      return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const users = await usersCollection
      .find(filter, {
        projection: {
          password: 0,
        },
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}

// POST /api/users (Admin creates new user)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ code: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture");
    const usersCollection = db.collection("users");

    const sessionUser = await usersCollection.findOne({ uid: session.uid });
    if (!sessionUser || sessionUser.role !== "super_admin") {
      return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
    }

    const { email, name, mobile, role, password } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ code: "INVALID_EMAIL" }, { status: 400 });
    }

    if (mobile && !/^01[3-9]\d{8}$/.test(mobile)) {
      return NextResponse.json({ code: "INVALID_MOBILE" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ code: "WEAK_PASSWORD" }, { status: 400 });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ code: "EMAIL_EXISTS" }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = {
      uid: crypto.randomUUID(),
      email,
      name: name.trim(),
      mobile: mobile || "",
      password: hashedPassword,
      role: role || "user",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json({
      code: "USER_CREATED",
      user: {
        uid: newUser.uid,
        email: newUser.email,
        name: newUser.name,
        mobile: newUser.mobile,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}

// PUT /api/users?uid=abc123 (Admin updates user status/role)
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ code: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture");
    const usersCollection = db.collection("users");

    const sessionUser = await usersCollection.findOne({ uid: session.uid });
    if (
      !sessionUser ||
      (sessionUser.role !== "admin" && sessionUser.role !== "super_admin")
    ) {
      return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const targetUid = searchParams.get("uid");

    if (!targetUid) {
      return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
    }

    const { role, status } = await req.json();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (role) {
      if (sessionUser.role !== "super_admin") {
        return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
      }
      updateData.role = role;
    }

    if (status) {
      updateData.status = status;
    }

    const result = await usersCollection.updateOne(
      { uid: targetUid },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ code: "USER_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({
      code: "USER_UPDATED",
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}

// DELETE /api/users?uid=abc123
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ code: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture");
    const usersCollection = db.collection("users");

    const sessionUser = await usersCollection.findOne({ uid: session.uid });
    if (!sessionUser || sessionUser.role !== "super_admin") {
      return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const targetUid = searchParams.get("uid");

    if (!targetUid) {
      return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
    }

    if (targetUid === session.uid) {
      return NextResponse.json({ code: "CANNOT_DELETE_SELF" }, { status: 400 });
    }

    const result = await usersCollection.deleteOne({ uid: targetUid });

    if (result.deletedCount === 0) {
      return NextResponse.json({ code: "USER_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({
      code: "USER_DELETED",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}
