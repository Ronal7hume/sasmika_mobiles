import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/storage';

export async function GET() {
  try {
    const offers = readDataFile('offers');
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const offers = readDataFile('offers');

    // Generate incremental id
    const ids = offers.map(o => parseInt(o.id.replace('o', '')) || 0);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const newId = `o${String(maxId + 1).padStart(3, '0')}`;

    const newOffer = {
      id: newId,
      title: body.title || 'Untitled Offer',
      description: body.description || '',
      discount: body.discount || '',
      validTill: body.validTill || '',
      badge: body.badge || '',
      link: body.link || '/gallery',
      colorTheme: body.colorTheme || 'pink',
      active: body.active !== false,
    };

    offers.push(newOffer);
    writeDataFile('offers', offers);

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
