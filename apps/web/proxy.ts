import { NextResponse, type NextRequest } from 'next/server';

import { auth } from '@/auth';
import { defaultLocale, isLocale, locales } from '@/shared/i18n';

const PUBLIC_FILE = /\.(.*)$/;

const authProxy = auth((request) => {
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

  const isLogin = afterLocale[1] === 'login' && afterLocale.length === 2;

  if (isLogin) {
    return NextResponse.next();
  }

  if (!request.auth) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/admin/login`;
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export async function proxy(request: NextRequest) {
  return authProxy(request, {} as never);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
