import { NextResponse } from 'next/server';

import { getSetCookieHeaders } from '@/core/auth/upstream-set-cookie';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

export type AuthProxyPath =
  | 'login'
  | 'logout'
  | 'refresh'
  | 'register'
  | 'forgot-password'
  | 'reset-password';

/**
 * Proxies POST to Nest auth endpoints and forwards Set-Cookie / Clear-Cookie when present.
 * Auth authority remains in NestJS; BFF is transport only.
 */
export async function proxyAuthPost(
  path: AuthProxyPath,
  init?: RequestInit,
): Promise<NextResponse> {
  const upstream = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
    method: 'POST',
    ...init,
  });

  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });

  const contentType = upstream.headers.get('content-type');
  if (contentType) {
    response.headers.set('Content-Type', contentType);
  }

  const traceId = upstream.headers.get('x-request-id');
  if (traceId) {
    response.headers.set('x-request-id', traceId);
  }

  for (const cookie of getSetCookieHeaders(upstream)) {
    response.headers.append('Set-Cookie', cookie);
  }

  return response;
}
