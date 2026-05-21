import { cookies } from 'next/headers';

import type { AuthUser } from '@repo/api/client';

import { getAuthCookieName, hasAdminSessionCookie } from './session-cookie';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

export type AdminSession = {
  user: AuthUser & { name: string | null };
};

/**
 * Resolves the current admin session from the Nest JWT cookie (via GET /api/auth/me).
 * Returns null when the cookie is missing or invalid.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();

  if (!hasAdminSessionCookie(cookieStore)) {
    return null;
  }

  const cookieName = getAuthCookieName();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Cookie: `${cookieName}=${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  try {
    const data = (await response.json()) as { user?: AuthUser };
    if (!data.user?.id || !data.user.email) {
      return null;
    }

    return {
      user: {
        ...data.user,
        name: null,
      },
    };
  } catch {
    return null;
  }
}
