import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { setSessionCookie } from "@/lib/auth";
import { AUTH_ERRORS } from "@/lib/errorCodes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, mobile, email, password, confirmPassword } =
      body;

    // ✅ Validation
    if (!firstName || !lastName || !mobile || !email || !password) {
      return NextResponse.json(
        { code: AUTH_ERRORS.MISSING_FIELDS },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { code: AUTH_ERRORS.PASSWORDS_MISMATCH },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { code: AUTH_ERRORS.WEAK_PASSWORD },
        { status: 400 },
      );
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(mobile)) {
      return NextResponse.json(
        { code: AUTH_ERRORS.INVALID_MOBILE },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("Abdullah_Poshak_Ghor");

    // ✅ Email আগে থেকে আছে কিনা চেক
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { code: AUTH_ERRORS.EMAIL_EXISTS },
        { status: 409 },
      );
    }

    // ✅ Password hash করুন
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Unique UID তৈরি করুন
    const uid = crypto.randomUUID();

    const newUser = {
      uid,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      provider: "email",
      photoURL: "",
      role: "user", // ✅ Public register সবসময় "user" role
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

    await db.collection("users").insertOne(newUser);

    // ✅ Session cookie set করুন (auto-login after register)
    await setSessionCookie({
      uid,
      email,
      role: "user",
      status: "active",
    });

    return NextResponse.json(
      {
        code: AUTH_ERRORS.REGISTER_SUCCESS,
        user: { uid, role: "user", status: "active" },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { code: AUTH_ERRORS.SERVER_ERROR },
      { status: 500 },
    );
  }
}
