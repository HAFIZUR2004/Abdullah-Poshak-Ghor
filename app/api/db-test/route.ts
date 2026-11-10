import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected Successfully!",
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      readyState: mongoose.connection.readyState,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.error("MongoDB Test Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB Connection Failed!",
        error: message,
        readyState: mongoose.connection.readyState,
      },
      { status: 500 }
    );
  }
}