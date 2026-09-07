import mongoose, { Schema, Document } from "mongoose";

export interface ICustomSection extends Document {
  imageUrl: string;
  updatedAt: Date;
}

const CustomSectionSchema: Schema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      default: "/images/customizesection.jpeg",
    },
  },
  { timestamps: true }
);

export default mongoose.models.CustomSection ||
  mongoose.model<ICustomSection>("CustomSection", CustomSectionSchema);