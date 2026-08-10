import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { AUTH_ERRORS } from "@/lib/errorCodes";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json(
      { code: AUTH_ERRORS.LOGOUT_SUCCESS },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { code: AUTH_ERRORS.SERVER_ERROR },
      { status: 500 },
    );
  }
}
