import { bdLocationData } from '@/lib/bd-location';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return the divisions array directly
    return NextResponse.json(bdLocationData.divisions);
  } catch (error) {
    console.error('Error fetching divisions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch divisions' },
      { status: 500 }
    );
  }
}