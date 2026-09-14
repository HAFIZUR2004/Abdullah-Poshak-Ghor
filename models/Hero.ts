import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IHero extends Document {
  heroImages: string[]; // exactly 3টি image URL
}

const HeroSchema = new Schema<IHero>(
  {
    heroImages: {
      type: [String],
      required: true,
      default: [
        "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
        "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
        "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
      ],
      validate: {
        validator: (arr: string[]) => arr.length === 3,
        message: "Exactly 3 hero images are required",
      },
    },
  },
  { timestamps: true }
);

const Hero = models.Hero || model<IHero>("Hero", HeroSchema);
export default Hero;