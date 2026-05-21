import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

type AuthProxyPath = 'login' | 'logout';

/**
 * Proxies POST to Nest auth endpoints and forwards Set-Cookie / Clear-Cookie unchanged.
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

  const setCookies =
    typeof upstream.headers.getSetCookie === 'function'
      ? upstream.headers.getSetCookie()
      : parseSetCookieFallback(upstream.headers.get('set-cookie'));

  for (const cookie of setCookies) {
    response.headers.append('Set-Cookie', cookie);
  }

  return response;
}

function parseSetCookieFallback(header: string | null): string[] {
  if (!header) return [];
  // Single cookie per header in simple dev responses; split combined headers if needed later.
  return [header];
}
