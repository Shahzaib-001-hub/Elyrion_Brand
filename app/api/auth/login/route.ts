import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signToken, AUTH_COOKIE_NAME, comparePassword } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = LoginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid credentials format' }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Check default super admin credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'concierge@elyrion.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ElyrionLuxury2026!';

    if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      const session = {
        userId: 'admin_master_01',
        email: adminEmail,
        name: 'Elyrion Master Concierge',
        role: 'super_admin' as const,
      };

      const token = signToken(session);
      const response = NextResponse.json({ success: true, user: session });

      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Check database user
    const db = await connectToDatabase();
    if (db) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        const matches = await comparePassword(password, user.passwordHash);
        if (matches) {
          const session = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
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
      }
    }

    // Default demo customer login for quick evaluation
    if (email === 'client@mayfair.com' && password === 'ElyrionClient123!') {
      const session = {
        userId: 'customer_demo_01',
        email: 'client@mayfair.com',
        name: 'Lord Julian Sterling',
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
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
