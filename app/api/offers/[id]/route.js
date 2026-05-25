import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/storage';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const offers = readDataFile('offers');
    const offer = offers.find(o => o.id === id);
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }
    return NextResponse.json(offer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const offers = readDataFile('offers');
    const index = offers.findIndex(o => o.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    offers[index] = {
      ...offers[index],
      title: body.title ?? offers[index].title,
      description: body.description ?? offers[index].description,
      discount: body.discount ?? offers[index].discount,
      validTill: body.validTill ?? offers[index].validTill,
      badge: body.badge ?? offers[index].badge,
      link: body.link ?? offers[index].link,
      colorTheme: body.colorTheme ?? offers[index].colorTheme,
      active: body.active ?? offers[index].active,
    };

    writeDataFile('offers', offers);
    return NextResponse.json(offers[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    let offers = readDataFile('offers');
    const index = offers.findIndex(o => o.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    offers.splice(index, 1);
    writeDataFile('offers', offers);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
