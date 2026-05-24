import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/storage';

export async function GET(request) {
  try {
    const orders = readDataFile('orders');
    // Sort orders by date descending (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orders = readDataFile('orders');
    const products = readDataFile('products');

    const orderId = `ord${Date.now()}`;

    const newOrder = {
      id: orderId,
      customerName: body.customerName || 'Guest Customer',
      customerPhone: body.customerPhone || '',
      customerAddress: body.customerAddress || '',
      customerEmail: body.customerEmail || '',
      items: body.items || [], // array of { productId, name, price, quantity, type, customDetails }
      subtotal: parseFloat(body.subtotal) || 0,
      discount: parseFloat(body.discount) || 0,
      deliveryCharge: parseFloat(body.deliveryCharge) || 0,
      total: parseFloat(body.total) || 0,
      status: 'Pending', // Pending, Processing, Completed, Cancelled
      date: new Date().toISOString()
    };

    // Deduct stock for products
    newOrder.items.forEach(item => {
      if (item.productId && !item.productId.startsWith('s')) { // only for products, not printing services
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          const currentStock = products[productIndex].stock || 0;
          products[productIndex].stock = Math.max(0, currentStock - item.quantity);
        }
      }
    });

    // Save updated products and orders
    writeDataFile('products', products);
    orders.push(newOrder);
    writeDataFile('orders', orders);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
