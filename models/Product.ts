// models/Product.ts - আপডেট

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: undefined,
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      required: [true, "Main image is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Draft", "Trending", "Featured", "OutOfStock"],
      default: "Active",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    materials: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    warrantyInfo: {
      type: String,
      default: "1 Year Service Warranty",
    },
    returnPolicy: {
      type: String,
      default: "3 Days Easy Return & Replacement",
    },
    note: {
      type: String,
      default: "",
    },
    fabricEnabled: {
      type: Boolean,
      default: false,
    },
    fabricName: {
      type: String,
      default: "",
    },
    fabricColors: {
      type: [String],
      default: [],
    },
    // নতুন ফিল্ড - Collection Flags
     isBestSeller: {
      type: Boolean,
      default: false,
    },
    isTodayDeal: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isDealOfTheWeek: {
      type: Boolean,
      default: false,
    },
    isTopRated: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

export default Product;