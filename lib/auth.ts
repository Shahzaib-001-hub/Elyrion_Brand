import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'elyrion_secret_key_luxury_parfums_2026_super_secure';
export const AUTH_COOKIE_NAME = 'elyrion_session';

export type UserRole = 'super_admin' | 'manager' | 'support' | 'content' | 'customer';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(session: AuthSession): string {
  return jwt.sign(session, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSession;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function isStaffRole(role?: UserRole): boolean {
  if (!role) return false;
  return ['super_admin', 'manager', 'support', 'content'].includes(role);
}

export function canManageProducts(role?: UserRole): boolean {
  return ['super_admin', 'manager', 'content'].includes(role || '');
}

export function canManageOrders(role?: UserRole): boolean {
  return ['super_admin', 'manager', 'support'].includes(role || '');
}

export function isSuperAdmin(role?: UserRole): boolean {
  return role === 'super_admin';
}
