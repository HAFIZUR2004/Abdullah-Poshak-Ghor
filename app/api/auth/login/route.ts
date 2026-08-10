// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { setSessionCookie } from "@/lib/auth";
import { AUTH_ERRORS } from "@/lib/errorCodes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { code: AUTH_ERRORS.MISSING_FIELDS },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture");

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { code: AUTH_ERRORS.INVALID_CREDENTIALS },
        { status: 401 },
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { code: AUTH_ERRORS.NO_PASSWORD_SET },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { code: AUTH_ERRORS.INVALID_CREDENTIALS },
        { status: 401 },
      );
    }

    if (user.status === "blocked" || user.status === "suspended") {
      return NextResponse.json(
        { code: AUTH_ERRORS.ACCOUNT_SUSPENDED },
        { status: 403 },
      );
    }

    await db
      .collection("users")
      .updateOne({ uid: user.uid }, { $set: { lastLogin: new Date() } });

    await setSessionCookie({
      uid: user.uid,
      email: user.email,
      role: user.role || "user",
      status: user.status || "active",
    });

    return NextResponse.json(
      {
        code: AUTH_ERRORS.LOGIN_SUCCESS,
        user: {
          uid: user.uid,
          role: user.role || "user",
          status: user.status || "active",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { code: AUTH_ERRORS.SERVER_ERROR },
      { status: 500 },
    );
  }
}
