import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { redirect } from 'next/navigation';

import { hasAdminSessionCookie } from '@/core/auth/session-cookie';
import type { Locale } from '@/shared/i18n';

export function redirectIfAdminSession(
  cookieStore: ReadonlyRequestCookies,
  locale: Locale,
): void {
  if (hasAdminSessionCookie(cookieStore)) {
    redirect(`/${locale}/admin/blogs`);
  }
}
