// models/Banner.ts
import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Crafted for Comfort",
    },
    image: {
      type: String,
      required: true,
      default: "https://i.ibb.co.com/4RCn5y67/discount.webp",
    },
    link: {
      type: String,
      default: "/shop",
    },
    isActive: {
      type: Boolean,
      default: true,
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

export const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);