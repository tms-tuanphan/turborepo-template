import type { NextRequest, NextResponse } from 'next/server';

import { getSetCookieHeaders } from '@/core/auth/upstream-set-cookie';
import {
  getAuthCookieName,
  getRefreshCookieName,
} from '@/core/auth/session-cookie';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

/** Refresh slightly before JWT exp to avoid races with the NextAuth session clock. */
const REFRESH_SKEW_MS = 30_000;

export function getAccessJwtExpMs(accessToken: string): number | null {
  const parts = accessToken.split('.');
  const payloadPart = parts[1];
  if (parts.length !== 3 || !payloadPart) {
    return null;
  }

  try {
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );
    const json =
      typeof atob !== 'undefined'
        ? atob(padded)
        : Buffer.from(padded, 'base64').toString('utf8');
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function shouldRefreshUpstreamAccess(request: NextRequest): boolean {
  const refreshName = getRefreshCookieName();
  if (!request.cookies.has(refreshName)) {
    return false;
  }

  const accessName = getAuthCookieName();
  const access = request.cookies.get(accessName)?.value;
  if (!access) {
    return true;
  }

  const exp = getAccessJwtExpMs(access);
  if (exp === null) {
    return true;
  }

  return Date.now() >= exp - REFRESH_SKEW_MS;
}

export async function fetchUpstreamRefreshSetCookies(
  request: NextRequest,
): Promise<string[]> {
  const refreshName = getRefreshCookieName();
  const refresh = request.cookies.get(refreshName)?.value;
  if (!refresh) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { Cookie: `${refreshName}=${refresh}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    return [];
  }

  return getSetCookieHeaders(response);
}

export function applySetCookieHeaders(
  response: NextResponse,
  setCookieHeaders: string[],
): void {
  for (const header of setCookieHeaders) {
    response.headers.append('Set-Cookie', header);
  }
}

export async function refreshUpstreamAccessIfNeeded(
  request: NextRequest,
  response: NextResponse,
): Promise<void> {
  if (!shouldRefreshUpstreamAccess(request)) {
    return;
  }

  const setCookieHeaders = await fetchUpstreamRefreshSetCookies(request);
  applySetCookieHeaders(response, setCookieHeaders);
}
