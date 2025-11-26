import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.DASHBOARD_JWT_SECRET || 'supersecretkey';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('dashboard_token')?.value;

  try {
    if (!token) throw new Error('No token');
    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
