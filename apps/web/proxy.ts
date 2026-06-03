import { NextResponse, type NextRequest } from 'next/server';

import { refreshUpstreamAccessIfNeeded } from '@/core/auth/upstream-session-refresh';
import {
  getAuthCookieName,
  getRefreshCookieName,
} from '@/core/auth/session-cookie';
import { defaultLocale, isLocale, locales } from '@/shared/i18n';

const PUBLIC_FILE = /\.(.*)$/;

const AUTH_ROUTE_PREFIXES = [
  'login',
  'forgot-password',
  'reset-password',
] as const;

function isPublicAuthRoute(authSegment: string | undefined): boolean {
  if (!authSegment) return false;
  return AUTH_ROUTE_PREFIXES.some(
    (prefix) => authSegment === prefix || authSegment.startsWith(`${prefix}/`),
  );
}

function hasAdminSession(request: NextRequest): boolean {
  const access = getAuthCookieName();
  const refresh = getRefreshCookieName();
  return (
    request.cookies.has(access) ||
    request.cookies.has(refresh) ||
    request.cookies.has('authjs.session-token') ||
    request.cookies.has('__Secure-authjs.session-token')
  );
}

/**
 * Locale redirect + admin route guard (cookie presence; JWT authority in Nest).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  if (!maybeLocale || !isLocale(maybeLocale)) {
    return NextResponse.next();
  }

  const locale = maybeLocale;
  const afterLocale = segments.slice(1);

  if (afterLocale[0] !== 'admin') {
    return NextResponse.next();
  }

  const authSegment = afterLocale[1];
  const isAuthRoute = isPublicAuthRoute(authSegment);
  const loggedIn = hasAdminSession(request);

  if (isAuthRoute && loggedIn) {
    const adminHome = request.nextUrl.clone();
    adminHome.pathname = `/${locale}/admin/blogs`;
    adminHome.search = '';
    return NextResponse.redirect(adminHome);
  }

  if (!isAuthRoute && !loggedIn) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/admin/login`;
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAuthRoute && loggedIn) {
    const response = NextResponse.next();
    await refreshUpstreamAccessIfNeeded(request, response);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
