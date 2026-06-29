import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ১. GET: সব প্রোডাক্ট রিড করা (✅ _id স্ট্রিং করে পাঠানো)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("demosolidbazar");
    const products = await db.collection("products").find({}).toArray();

    // ✅ _id কে স্ট্রিং এ কনভার্ট করুন
    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
    }));

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// ২. POST: নতুন প্রোডাক্ট অ্যাড করা
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    const newProduct = {
      name: body.name,
      description: body.description || "",
      price: parseFloat(body.price),
      originalPrice: body.originalPrice
        ? parseFloat(body.originalPrice)
        : undefined,
      category: body.category,
      image: body.image,
      stock: parseInt(body.stock) || 0,
      status: body.status || "Active",
      rating: parseFloat(body.rating) || 0,
      discount: body.discount || 0,
      createdAt: new Date(),
    };

    if (!newProduct.image) {
      return NextResponse.json(
        { error: "Product image is required" },
        { status: 400 },
      );
    }

    const result = await db.collection("products").insertOne(newProduct);

    // ✅ রেসপন্সে _id স্ট্রিং করে পাঠান
    return NextResponse.json(
      {
        ...newProduct,
        _id: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST API Error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

// ৩. PUT: প্রোডাক্ট আপডেট করা
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    if (updateData.price !== undefined)
      updateData.price = parseFloat(updateData.price);
    if (updateData.stock !== undefined)
      updateData.stock = parseInt(updateData.stock);

    await db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json(
      { message: "Product updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// ৪. DELETE: প্রোডাক্ট ডিলিট করা
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("demosolidbazar");

    await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
