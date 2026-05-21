import { NextResponse, type NextRequest } from 'next/server';

import { getAuthCookieName } from '@/core/auth/session-cookie';
import { defaultLocale, isLocale, locales } from '@/shared/i18n';

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Admin route guard: cookie presence only (no JWT decode/verify).
 * Authentication authority remains in NestJS.
 */
export function proxy(request: NextRequest) {
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
  const isPublicAuthRoute =
    authSegment === 'login' ||
    authSegment === 'forgot-password' ||
    authSegment === 'reset-password' ||
    authSegment === 'register';

  if (isPublicAuthRoute) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(getAuthCookieName());

  if (!hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/admin/login`;
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
