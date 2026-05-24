import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/storage';

export async function POST(request) {
  try {
    const { username, password, type } = await request.json();

    if (type === 'admin') {
      const admins = readDataFile('admin');
      const matchedAdmin = admins.find(
        a => a.username.toLowerCase() === username.toLowerCase() && a.password === password
      );

      if (matchedAdmin) {
        return NextResponse.json({
          success: true,
          user: {
            username: matchedAdmin.username,
            role: 'admin'
          }
        });
      } else {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }
    } else {
      // User login
      const users = readDataFile('users');
      // users are stored with fields: name, email, phone, password
      const matchedUser = users.find(
        u => (u.phone === username || u.email.toLowerCase() === username.toLowerCase()) && u.password === password
      );

      if (matchedUser) {
        // Don't return password in response
        const { password: _, ...safeUser } = matchedUser;
        return NextResponse.json({
          success: true,
          user: safeUser
        });
      } else {
        return NextResponse.json({ error: 'Invalid phone/email or password' }, { status: 401 });
      }
    }
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
