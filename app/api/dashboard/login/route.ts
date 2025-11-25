import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

// --- Environment Variables ---
const DASHBOARD_EMAIL =
  process.env.NEXT_PUBLIC_DASHBOARD_EMAIL || 'admin@example.com';
const DASHBOARD_PASSWORD =
  process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || 'admin123';
const JWT_SECRET = process.env.DASHBOARD_JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '1h';

export async function POST(req: Request) {
  try {
    // 1. Destructure both email and password from the request body
    const { email, password } = await req.json();

    // 2. Validate Credentials

    // Check if email is missing
    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'Email is required' },
        { status: 400 },
      );
    }

    // Check if password is missing
    if (!password) {
      return NextResponse.json(
        { ok: false, error: 'Password is required' },
        { status: 400 },
      );
    }

    // Check if both email and password match the expected environment variables
    if (email !== DASHBOARD_EMAIL || password !== DASHBOARD_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // 3. Sign JWT (include email in the payload for logging/identification)
    const token = jwt.sign(
      { authorized: true, email: email }, // Include email in payload
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // 4. Set JWT in HTTP-only cookie
    const cookie = serialize('dashboard_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json(
      { ok: true },
      { headers: { 'Set-Cookie': cookie } },
    );
  } catch (err) {
    // Catch JSON parsing errors or other unexpected errors
    console.error('Login API error:', err);
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
