import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const DASHBOARD_PASSWORD =
  process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || 'admin123';
const JWT_SECRET = process.env.DASHBOARD_JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '1h'; 

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password !== DASHBOARD_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: 'Incorrect password' },
        { status: 401 },
      );
    }

    // Sign JWT
    const token = jwt.sign({ authorized: true }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Set JWT in HTTP-only cookie
    const cookie = serialize('dashboard_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json(
      { ok: true },
      { headers: { 'Set-Cookie': cookie } },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
