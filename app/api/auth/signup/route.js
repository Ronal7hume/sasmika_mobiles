import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/storage';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, address } = body;

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Name, phone, and password are required' }, { status: 400 });
    }

    const users = readDataFile('users');

    // Check if user already exists
    const duplicate = users.find(u => u.phone === phone || (email && u.email.toLowerCase() === email.toLowerCase()));
    if (duplicate) {
      return NextResponse.json({ error: 'A user with this phone or email already exists' }, { status: 409 });
    }

    const newUser = {
      id: `u${Date.now()}`,
      name,
      email: email || '',
      phone,
      password,
      address: address || '',
      dateJoined: new Date().toISOString()
    };

    users.push(newUser);
    writeDataFile('users', users);

    // Return safe user details
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
  }
}
