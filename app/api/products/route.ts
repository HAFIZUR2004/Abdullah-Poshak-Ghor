// app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

// ============================================================
// GET - Fetch products for Shop page
// ============================================================

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      $or: [
        { status: { $exists: false } },
        { status: "Active" },
        { status: "Trending" },
        { status: "Featured" },
      ],
    })
      .select(
        "_id name price originalPrice category image stock status rating discount createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products, {
      status: 200,

      headers: {
        // Browser cache
        "Cache-Control":
          "public, max-age=60, s-maxage=300, stale-while-revalidate=600",

        // CDN/proxy friendly
        Vary: "Accept-Encoding",
      },
    });
  } catch (error) {
    console.error("GET products error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

// ============================================================
// POST - Create new product
// ============================================================

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.name || body.price === undefined || !body.image) {
      return NextResponse.json(
        {
          error: "Name, price and image are required",
        },
        {
          status: 400,
        }
      );
    }

    const product = await Product.create({
      name: body.name,
      description: body.description || "",
      price: body.price,
      originalPrice: body.originalPrice,
      category: body.category,
      image: body.image,
      images: body.images || [],
      stock: body.stock || 0,
      status: body.status || "Active",
      rating: body.rating || 0,
      discount: body.discount || 0,
      materials: body.materials || [],
      colors: body.colors || [],
      sizes: body.sizes || [],
      warrantyInfo:
        body.warrantyInfo ||
        "1 Year Service Warranty",
      returnPolicy:
        body.returnPolicy ||
        "3 Days Easy Return & Replacement",
      note: body.note || "",
      fabricEnabled: body.fabricEnabled || false,
      fabricName: body.fabricName || "",
      fabricColors: body.fabricColors || [],

      isBestSeller: body.isBestSeller || false,
      isTodayDeal: body.isTodayDeal || false,
      isNewArrival: body.isNewArrival || false,
      isDealOfTheWeek: body.isDealOfTheWeek || false,
      isTopRated: body.isTopRated || false,
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST product error:", error);

    return NextResponse.json(
      {
        error: "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// PUT - Update product
// ============================================================

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          error: "Product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const updateData = {
      name: body.name,
      description: body.description || "",
      price: body.price,
      originalPrice: body.originalPrice,
      category: body.category,
      image: body.image,
      images: body.images || [],
      stock: body.stock || 0,
      status: body.status || "Active",
      rating: body.rating || 0,
      discount: body.discount || 0,
      materials: body.materials || [],
      colors: body.colors || [],
      sizes: body.sizes || [],
      warrantyInfo:
        body.warrantyInfo ||
        "1 Year Service Warranty",
      returnPolicy:
        body.returnPolicy ||
        "3 Days Easy Return & Replacement",
      note: body.note || "",
      fabricEnabled: body.fabricEnabled || false,
      fabricName: body.fabricName || "",
      fabricColors: body.fabricColors || [],

      isBestSeller: body.isBestSeller || false,
      isTodayDeal: body.isTodayDeal || false,
      isNewArrival: body.isNewArrival || false,
      isDealOfTheWeek:
        body.isDealOfTheWeek || false,
      isTopRated: body.isTopRated || false,

      updatedAt: new Date(),
    };

    const product =
      await Product.findByIdAndUpdate(
        body.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Product updated successfully",
        product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("PUT product error:", error);

    return NextResponse.json(
      {
        error: "Failed to update product",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// DELETE - Delete product
// ============================================================

export async function DELETE(
  request: NextRequest
) {
  try {
    await connectDB();

    const url = new URL(request.url);

    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Product deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE product error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}