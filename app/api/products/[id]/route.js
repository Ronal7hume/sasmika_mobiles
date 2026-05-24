import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/storage';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const products = readDataFile('products');
    const product = products.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const products = readDataFile('products');
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = {
      ...products[index],
      name: body.name !== undefined ? body.name : products[index].name,
      category: body.category !== undefined ? body.category : products[index].category,
      type: body.type !== undefined ? body.type : products[index].type,
      brand: body.brand !== undefined ? body.brand : products[index].brand,
      price: body.price !== undefined ? parseFloat(body.price) || 0 : products[index].price,
      offerPrice: body.offerPrice !== undefined ? parseFloat(body.offerPrice) || null : products[index].offerPrice,
      offerPercent: body.offerPercent !== undefined ? parseInt(body.offerPercent) || 0 : products[index].offerPercent,
      color: body.color !== undefined ? body.color : products[index].color,
      specs: body.specs !== undefined ? body.specs : products[index].specs,
      rating: body.rating !== undefined ? parseFloat(body.rating) || 5.0 : products[index].rating,
      image: body.image !== undefined ? body.image : products[index].image,
      featured: body.featured !== undefined ? (body.featured === true || body.featured === 'true') : products[index].featured,
      stock: body.stock !== undefined ? parseInt(body.stock) || 0 : products[index].stock
    };

    products[index] = updatedProduct;
    writeDataFile('products', products);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const products = readDataFile('products');
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const deletedProduct = products[index];
    const filteredProducts = products.filter(p => p.id !== id);
    writeDataFile('products', filteredProducts);

    return NextResponse.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
