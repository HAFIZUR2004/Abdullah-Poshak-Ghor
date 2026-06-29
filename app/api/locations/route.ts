// app/api/locations/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'ecommerce');
    const divisions = await db.collection('locations').find({}).toArray();
    return NextResponse.json(divisions);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' }, 
      { status: 500 }
    );
  }
}