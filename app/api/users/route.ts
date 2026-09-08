import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const DB_NAME = "sareng_furniture";

const ALLOWED_ROLES = [
  "user",
  "admin",
  "super_admin",
] as const;

const ALLOWED_STATUS = [
  "pending",
  "active",
  "suspended",
] as const;

type UserRole = (typeof ALLOWED_ROLES)[number];
type UserStatus = (typeof ALLOWED_STATUS)[number];

/* =========================================================
   GET CURRENT SUPER ADMIN
========================================================= */

async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return {
      error: NextResponse.json(
        {
          code: "NOT_AUTHENTICATED",
          message: "You are not authenticated.",
        },
        { status: 401 },
      ),
    };
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const usersCollection = db.collection("users");

  const sessionUser = await usersCollection.findOne({
    uid: session.uid,
  });

  if (!sessionUser) {
    return {
      error: NextResponse.json(
        {
          code: "USER_NOT_FOUND",
          message: "User account not found.",
        },
        { status: 404 },
      ),
    };
  }

  /*
   * ONLY SUPER ADMIN
   * can access user management API.
   */
  if (sessionUser.role !== "super_admin") {
    return {
      error: NextResponse.json(
        {
          code: "FORBIDDEN",
          message:
            "Only super admin can manage users.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    session,
    sessionUser,
    usersCollection,
  };
}

/* =========================================================
   GET /api/users
========================================================= */

export async function GET(req: NextRequest) {
  try {
    const auth = await getCurrentUser();

    if ("error" in auth) {
      return auth.error;
    }

    const { usersCollection } = auth;

    const { searchParams } = new URL(req.url);

    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};

    /* Role */
    if (role && role !== "all") {
      if (
        !ALLOWED_ROLES.includes(
          role as UserRole,
        )
      ) {
        return NextResponse.json(
          {
            code: "INVALID_ROLE",
            message: "Invalid role.",
          },
          { status: 400 },
        );
      }

      filter.role = role;
    }

    /* Status */
    if (status && status !== "all") {
      if (
        !ALLOWED_STATUS.includes(
          status as UserStatus,
        )
      ) {
        return NextResponse.json(
          {
            code: "INVALID_STATUS",
            message: "Invalid status.",
          },
          { status: 400 },
        );
      }

      filter.status = status;
    }

    /* Search */
    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        {
          email: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          name: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          mobile: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          uid: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    const users = await usersCollection
      .find(filter, {
        projection: {
          password: 0,
        },
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Get users error:", error);

    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message: "Failed to fetch users.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   POST /api/users
   SUPER ADMIN CREATE USER
========================================================= */

export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUser();

    if ("error" in auth) {
      return auth.error;
    }

    const { usersCollection } = auth;

    const body = await req.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const mobile =
      typeof body.mobile === "string"
        ? body.mobile.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const role =
      typeof body.role === "string"
        ? body.role
        : "user";

    /* Required */
    if (!email || !name || !password) {
      return NextResponse.json(
        {
          code: "MISSING_FIELDS",
          message:
            "Name, email and password are required.",
        },
        { status: 400 },
      );
    }

    /* Email */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          code: "INVALID_EMAIL",
          message: "Invalid email address.",
        },
        { status: 400 },
      );
    }

    /* Mobile */
    if (
      mobile &&
      !/^01[3-9]\d{8}$/.test(mobile)
    ) {
      return NextResponse.json(
        {
          code: "INVALID_MOBILE",
          message:
            "Invalid Bangladesh mobile number.",
        },
        { status: 400 },
      );
    }

    /* Password */
    if (password.length < 6) {
      return NextResponse.json(
        {
          code: "WEAK_PASSWORD",
          message:
            "Password must be at least 6 characters.",
        },
        { status: 400 },
      );
    }

    /* Role */
    if (
      !ALLOWED_ROLES.includes(
        role as UserRole,
      )
    ) {
      return NextResponse.json(
        {
          code: "INVALID_ROLE",
          message: "Invalid role.",
        },
        { status: 400 },
      );
    }

    /* Existing email */
    const existingUser =
      await usersCollection.findOne({
        email,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          code: "EMAIL_EXISTS",
          message:
            "A user with this email already exists.",
        },
        { status: 409 },
      );
    }

    const hashedPassword =
      await bcryptjs.hash(password, 10);

    const now = new Date().toISOString();

    const newUser = {
      uid: crypto.randomUUID(),
      email,
      name,
      mobile,
      password: hashedPassword,
      role: role as UserRole,
      status: "active" as UserStatus,
      provider: "email",
      photoURL: "",
      createdAt: now,
      updatedAt: now,
      lastLogin: "",
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json(
      {
        code: "USER_CREATED",
        message: "User created successfully.",
        user: {
          uid: newUser.uid,
          email: newUser.email,
          name: newUser.name,
          mobile: newUser.mobile,
          role: newUser.role,
          status: newUser.status,
          provider: newUser.provider,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create user error:", error);

    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message: "Failed to create user.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   PUT /api/users?uid=...
   SUPER ADMIN UPDATE
========================================================= */

export async function PUT(req: NextRequest) {
  try {
    const auth = await getCurrentUser();

    if ("error" in auth) {
      return auth.error;
    }

    const {
      usersCollection,
      sessionUser,
    } = auth;

    const { searchParams } = new URL(req.url);

    const targetUid =
      searchParams.get("uid");

    if (!targetUid) {
      return NextResponse.json(
        {
          code: "MISSING_UID",
          message: "User UID is required.",
        },
        { status: 400 },
      );
    }

    const body = await req.json();

    const role =
      typeof body.role === "string"
        ? body.role
        : undefined;

    const status =
      typeof body.status === "string"
        ? body.status
        : undefined;

    /* Validate role */
    if (role !== undefined) {
      if (
        !ALLOWED_ROLES.includes(
          role as UserRole,
        )
      ) {
        return NextResponse.json(
          {
            code: "INVALID_ROLE",
            message: "Invalid role.",
          },
          { status: 400 },
        );
      }
    }

    /* Validate status */
    if (status !== undefined) {
      if (
        !ALLOWED_STATUS.includes(
          status as UserStatus,
        )
      ) {
        return NextResponse.json(
          {
            code: "INVALID_STATUS",
            message: "Invalid status.",
          },
          { status: 400 },
        );
      }
    }

    if (
      role === undefined &&
      status === undefined
    ) {
      return NextResponse.json(
        {
          code: "NO_UPDATE_FIELDS",
          message:
            "Nothing to update.",
        },
        { status: 400 },
      );
    }

    /* Prevent self suspension */
    if (
      targetUid === sessionUser.uid &&
      status === "suspended"
    ) {
      return NextResponse.json(
        {
          code: "CANNOT_SUSPEND_SELF",
          message:
            "You cannot suspend yourself.",
        },
        { status: 400 },
      );
    }

    /* Prevent own role downgrade */
    if (
      targetUid === sessionUser.uid &&
      role !== undefined &&
      role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          code: "CANNOT_CHANGE_OWN_ROLE",
          message:
            "You cannot remove your own super admin role.",
        },
        { status: 400 },
      );
    }

    const updateData: Record<
      string,
      unknown
    > = {
      updatedAt:
        new Date().toISOString(),
    };

    if (role !== undefined) {
      updateData.role =
        role as UserRole;
    }

    if (status !== undefined) {
      updateData.status =
        status as UserStatus;
    }

    const result =
      await usersCollection.updateOne(
        { uid: targetUid },
        {
          $set: updateData,
        },
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          code: "USER_NOT_FOUND",
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      code: "USER_UPDATED",
      message:
        "User updated successfully.",
    });
  } catch (error) {
    console.error("Update user error:", error);

    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message:
          "Failed to update user.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   DELETE /api/users?uid=...
========================================================= */

export async function DELETE(
  req: NextRequest,
) {
  try {
    const auth =
      await getCurrentUser();

    if ("error" in auth) {
      return auth.error;
    }

    const {
      usersCollection,
      sessionUser,
    } = auth;

    const { searchParams } =
      new URL(req.url);

    const targetUid =
      searchParams.get("uid");

    if (!targetUid) {
      return NextResponse.json(
        {
          code: "MISSING_UID",
          message:
            "User UID is required.",
        },
        { status: 400 },
      );
    }

    /* Prevent self deletion */
    if (
      targetUid === sessionUser.uid
    ) {
      return NextResponse.json(
        {
          code: "CANNOT_DELETE_SELF",
          message:
            "You cannot delete your own account.",
        },
        { status: 400 },
      );
    }

    const result =
      await usersCollection.deleteOne({
        uid: targetUid,
      });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          code: "USER_NOT_FOUND",
          message:
            "User not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      code: "USER_DELETED",
      message:
        "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error,
    );

    return NextResponse.json(
      {
        code: "SERVER_ERROR",
        message:
          "Failed to delete user.",
      },
      { status: 500 },
    );
  }
}