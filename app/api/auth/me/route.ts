import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { AUTH_ERRORS } from "@/lib/errorCodes";

export async function GET() {
  try {
    // Session cookie থেকে session নেওয়া হবে
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { code: AUTH_ERRORS.NOT_AUTHENTICATED },
        { status: 401 },
      );
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture");

    const user = await db
      .collection("users")
      .findOne({ uid: session.uid });

    if (!user) {
      return NextResponse.json(
        { code: AUTH_ERRORS.USER_NOT_FOUND },
        { status: 404 },
      );
    }

    // Account status check
    if (user.status === "suspended") {
      return NextResponse.json(
        { code: AUTH_ERRORS.ACCOUNT_SUSPENDED },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        user: {
          uid: user.uid,
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
          photoURL: user.photoURL || "",

          // Important:
          // DB role-টাই return হবে
          role: user.role || "user",

          status: user.status || "active",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Me Route Error:", error);

    return NextResponse.json(
      { code: AUTH_ERRORS.SERVER_ERROR },
      { status: 500 },
    );
  }
}