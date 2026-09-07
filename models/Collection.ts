// models/Collection.ts

import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "best-seller", 
        "today-deal", 
        "new-arrival",
        "deal-of-the-week",
        "top-rated"
      ],
      required: true,
      unique: true,
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Collection =
  mongoose.models.Collection ||
  mongoose.model("Collection", CollectionSchema);

export default Collection;