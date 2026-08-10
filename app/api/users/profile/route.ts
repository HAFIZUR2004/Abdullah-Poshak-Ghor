import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ code: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const { name, mobile } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ code: "MISSING_FIELDS" }, { status: 400 });
    }

    if (mobile && !/^01[3-9]\d{8}$/.test(mobile)) {
      return NextResponse.json({ code: "INVALID_MOBILE" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("sareng_furniture");
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { uid: session.uid },
      {
        $set: {
          name: name.trim(),
          mobile: mobile || "",
          updatedAt: new Date().toISOString(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ code: "USER_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({
      code: "UPDATE_SUCCESS",
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ code: "SERVER_ERROR" }, { status: 500 });
  }
}
