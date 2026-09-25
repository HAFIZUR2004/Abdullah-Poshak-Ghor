// app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

/* ============================================================ */
/* CONFIG                                                       */
/* ============================================================ */

export const dynamic = "force-dynamic"; // always fresh (change to "force-static" + revalidate if you want caching)

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 100;

/* ============================================================ */
/* HELPERS                                                      */
/* ============================================================ */

/** Escape regex special chars for safe $regex search */
const escapeRegex = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Validate Mongo ObjectId without throwing */
const isValidObjectId = (id: unknown): id is string =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

/** Normalize a product doc for client (adds `id`, removes __v) */
type LeanProduct = Record<string, unknown> & { _id?: unknown };

const serializeProduct = (doc: LeanProduct) => {
  const { __v, ...rest } = doc as Record<string, unknown>;
  void __v;
  return {
    ...rest,
    _id: String(rest._id),
    id: String(rest._id),
  };
};

/** Pick only defined fields from body — prevents accidental reset of flags */
const buildProductPayload = (body: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {};

  const stringFields = [
    "name",
    "description",
    "category",
    "image",
    "warrantyInfo",
    "returnPolicy",
    "note",
    "fabricName",
  ] as const;

  const numberFields = [
    "price",
    "originalPrice",
    "stock",
    "rating",
    "discount",
  ] as const;

  const arrayFields = [
    "images",
    "materials",
    "colors",
    "sizes",
    "fabricColors",
  ] as const;

  const booleanFields = [
    "fabricEnabled",
    "isBestSeller",
    "isTodayDeal",
    "isNewArrival",
    "isDealOfTheWeek",
    "isTopRated",
  ] as const;

  for (const key of stringFields) {
    if (body[key] !== undefined) payload[key] = body[key];
  }

  for (const key of numberFields) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
      const n = Number(body[key]);
      if (Number.isFinite(n)) payload[key] = n;
    }
  }

  for (const key of arrayFields) {
    if (Array.isArray(body[key])) payload[key] = body[key];
  }

  for (const key of booleanFields) {
    if (typeof body[key] === "boolean") payload[key] = body[key];
  }

  // status: validate against enum
  if (typeof body.status === "string") {
    const allowed = ["Active", "Draft", "Trending", "Featured", "OutOfStock"];
    if (allowed.includes(body.status)) payload.status = body.status;
  }

  return payload;
};

/* ============================================================ */
/* GET — list products with optional query params               */
/* ============================================================ */
/**
 * Query params (all optional):
 *   ?category=Sofa
 *   ?status=Active
 *   ?q=luxury sofa
 *   ?limit=50
 *   ?skip=0
 *   ?fields=name,price,image   (projection)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");
    const q = url.searchParams.get("q");
    const limit = Math.min(
      Math.max(Number(url.searchParams.get("limit")) || DEFAULT_LIMIT, 1),
      MAX_LIMIT
    );
    const skip = Math.max(Number(url.searchParams.get("skip")) || 0, 0);
    const fields = url.searchParams.get("fields");

    const filter: Record<string, unknown> = {};

    if (category && category !== "all") filter.category = category;
    if (status && status !== "all") filter.status = status;
    if (q && q.trim()) {
      filter.name = { $regex: escapeRegex(q.trim()), $options: "i" };
    }

    // Build projection
    let projection: Record<string, 0 | 1> | undefined;
    if (fields) {
      projection = {};
      fields.split(",").forEach((f) => {
        const key = f.trim();
        if (key) projection![key] = 1;
      });
    }

    // lean() = plain JS objects (≈5-10x faster than Mongoose docs)
    let query = Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (projection) query = query.select(projection);

    const products = await query.exec();

    return NextResponse.json(products.map(serializeProduct), {
      status: 200,
      headers: {
        // browser + CDN cache for 60s, serve stale for 5min while revalidating
        "Cache-Control":
          "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* ============================================================ */
/* POST — create product                                        */
/* ============================================================ */

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = (await request.json()) as Record<string, unknown>;

    if (!body.name || !body.price || !body.image) {
      return NextResponse.json(
        { error: "Name, price and image are required" },
        { status: 400 }
      );
    }

    const payload = buildProductPayload(body);

    // Apply defaults for missing fields on create
    const created = await Product.create({
      description: "",
      images: [],
      stock: 0,
      status: "Active",
      rating: 0,
      discount: 0,
      materials: [],
      colors: [],
      sizes: [],
      warrantyInfo: "1 Year Service Warranty",
      returnPolicy: "3 Days Easy Return & Replacement",
      note: "",
      fabricEnabled: false,
      fabricName: "",
      fabricColors: [],
      isBestSeller: false,
      isTodayDeal: false,
      isNewArrival: false,
      isDealOfTheWeek: false,
      isTopRated: false,
      ...payload,
    });

    const plain = created.toObject();
    return NextResponse.json(
      {
        message: "Product created successfully",
        product: serializeProduct(plain as LeanProduct),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST product error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ============================================================ */
/* PUT — update product                                         */
/* ============================================================ */

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = (await request.json()) as Record<string, unknown>;

    if (!isValidObjectId(body.id)) {
      return NextResponse.json(
        { error: "Valid product ID is required" },
        { status: 400 }
      );
    }

    const payload = buildProductPayload(body);

    // Partial update — only defined fields, flags preserved
    const product = await Product.findByIdAndUpdate(
      body.id,
      { $set: { ...payload, updatedAt: new Date() } },
      { new: true, runValidators: true, lean: true }
    ).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Product updated successfully",
        product: serializeProduct(product as LeanProduct),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT product error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ============================================================ */
/* PATCH — toggle a single collection flag (fast path)          */
/* ============================================================ */
/**
 * Body: { id: string, field: "isBestSeller" | ..., value: boolean }
 * Useful for the collection toggle buttons — avoids sending the
 * whole product just to flip one boolean.
 */
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = (await request.json()) as {
      id?: string;
      field?: string;
      value?: boolean;
    };

    if (!isValidObjectId(body.id)) {
      return NextResponse.json(
        { error: "Valid product ID is required" },
        { status: 400 }
      );
    }

    const allowed = [
      "isBestSeller",
      "isTodayDeal",
      "isNewArrival",
      "isDealOfTheWeek",
      "isTopRated",
    ];

    if (!body.field || !allowed.includes(body.field)) {
      return NextResponse.json(
        { error: "Invalid field" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      body.id,
      { $set: { [body.field]: Boolean(body.value), updatedAt: new Date() } },
      { new: true, lean: true }
    ).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Product updated",
        product: serializeProduct(product as LeanProduct),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/* ============================================================ */
/* DELETE — remove product                                      */
/* ============================================================ */

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Valid product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}