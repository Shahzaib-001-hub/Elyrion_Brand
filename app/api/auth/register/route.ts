import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = RegisterSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid registration form' },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const db = await connectToDatabase();
    if (db) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'customer',
        addresses: [],
        wishlist: [],
      });

      const session = {
        userId: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };

      const token = signToken(session);
      const response = NextResponse.json({ success: true, user: session });
      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // In-memory demo fallback
    const session = {
      userId: `user_${Date.now()}`,
      email,
      name,
      role: 'customer' as const,
    };
    const token = signToken(session);
    const response = NextResponse.json({ success: true, user: session });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
