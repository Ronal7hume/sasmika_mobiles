import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/storage';

export async function GET() {
  try {
    const categories = readDataFile('categories');
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
