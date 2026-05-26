import { cookies } from 'next/headers';

import type { ApiErrorPayload } from '@repo/api/client';

import { getAuthCookieName } from '@/core/auth/session-cookie';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

export class AdminApiError extends Error {
  readonly status: number;
  readonly payload?: ApiErrorPayload;

  constructor(status: number, payload?: ApiErrorPayload) {
    super(payload?.message ?? `Admin API error (${status})`);
    this.name = 'AdminApiError';
    this.status = status;
    this.payload = payload;
  }
}

function buildAdminUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}/api${normalized}`;
}

async function getSessionCookieHeader(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieName = getAuthCookieName();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;
  return `${cookieName}=${token}`;
}

export async function fetchAdminApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const cookie = await getSessionCookieHeader();
  if (!cookie) {
    throw new AdminApiError(401);
  }

  const headers = new Headers(init?.headers);
  headers.set('Cookie', cookie);
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildAdminUrl(path), {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    throw new AdminApiError(response.status, body as ApiErrorPayload | undefined);
  }

  return body as T;
}

export function isAdminApiConflict(error: unknown): boolean {
  return error instanceof AdminApiError && error.status === 409;
}
