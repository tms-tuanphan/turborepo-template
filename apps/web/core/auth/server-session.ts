import { cookies } from 'next/headers';

import type { AuthUser } from '@repo/api/client';

import { getAccessJwtExpMs } from './upstream-session-refresh';
import { applyUpstreamSetCookies } from './upstream-set-cookie';
import { getAuthCookieName, getRefreshCookieName } from './session-cookie';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

/** Align with upstream-session-refresh skew. */
const ACCESS_REFRESH_SKEW_MS = 30_000;

export type AdminSession = {
  user: AuthUser & { name: string | null };
};

function accessNeedsRefresh(token: string | undefined): boolean {
  if (!token) return true;
  const exp = getAccessJwtExpMs(token);
  if (exp === null) return true;
  return Date.now() >= exp - ACCESS_REFRESH_SKEW_MS;
}

async function tryRefreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshName = getRefreshCookieName();
  const refresh = cookieStore.get(refreshName)?.value;
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { Cookie: `${refreshName}=${refresh}` },
    cache: 'no-store',
  });

  if (!response.ok) return null;

  await applyUpstreamSetCookies(response);

  const updated = await cookies();
  return updated.get(getAuthCookieName())?.value ?? null;
}

/**
 * Resolves the current admin session from the Nest JWT cookie (via GET /api/auth/me).
 * Refreshes access_token when missing/expired but refresh_token is present (API routes
 * do not run proxy middleware).
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const cookieName = getAuthCookieName();
  let token = cookieStore.get(cookieName)?.value;

  if (accessNeedsRefresh(token)) {
    token = (await tryRefreshAccessToken()) ?? undefined;
  }

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
