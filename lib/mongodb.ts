// lib/mongodb.ts

import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("❌ MONGODB_URI is missing in .env.local");
}

const options = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

/* =========================================================
   1️⃣ MongoClient (raw driver) — auth/login এর জন্য
   ========================================================= */

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;

  // eslint-disable-next-line no-var
  var _mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Default export — MongoClient promise
 * ব্যবহার: `import clientPromise from "@/lib/mongodb"`
 */
export default clientPromise;

/* =========================================================
   2️⃣ Mongoose connection — models (Hero, Product, Banner) এর জন্য
   ========================================================= */

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

/**
 * ✅ Named export — mongoose connect
 * ব্যবহার: `import { dbConnect } from "@/lib/mongodb"`
 */
export async function dbConnect() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(uri!, options);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}