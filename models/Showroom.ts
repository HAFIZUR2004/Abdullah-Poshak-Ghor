import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IShowroom extends Document {
  city: string;
  address: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ShowroomSchema = new Schema<IShowroom>(
  {
    city: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Showroom || model<IShowroom>("Showroom", ShowroomSchema);