import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/storage';

export async function GET() {
  try {
    const services = readDataFile('services');
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
