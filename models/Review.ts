// models/Review.ts
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      maxlength: [500, "Review text cannot exceed 500 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
      default: 5,
    },
    image: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    verified: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ এখানে export default ব্যবহার করুন
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;