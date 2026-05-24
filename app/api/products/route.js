import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let products = readDataFile('products');

    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (type) {
      products = products.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }
    if (featured === 'true') {
      products = products.filter(p => p.featured === true || p.featured === 'true');
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q)
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const products = readDataFile('products');

    // Generate incremental id
    const ids = products.map(p => parseInt(p.id.replace('p', '')) || 0);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const newId = `p${String(maxId + 1).padStart(3, '0')}`;

    const newProduct = {
      id: newId,
      name: body.name || 'Unnamed Product',
      category: body.category || '',
      type: body.type || '',
      brand: body.brand || '',
      price: parseFloat(body.price) || 0,
      offerPrice: parseFloat(body.offerPrice) || null,
      offerPercent: parseInt(body.offerPercent) || 0,
      color: body.color || '',
      specs: body.specs || '',
      rating: parseFloat(body.rating) || 5.0,
      image: body.image || '',
      featured: body.featured === true || body.featured === 'true',
      stock: parseInt(body.stock) || 0
    };

    products.push(newProduct);
    writeDataFile('products', products);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
