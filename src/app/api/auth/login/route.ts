import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
const IS_PROD = process.env.NODE_ENV === 'production';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic input validation
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Sanitize email
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);

    await connectToDatabase();

    // Find the user and fetch password separately since it is select: false by default
    const user = await User.findOne({ email: sanitizedEmail }).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: 'Logged in successfully',
      user: { id: user._id, name: user.name, email: user.email }
    }, { status: 200 });

    // Set token as HttpOnly, Secure cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
