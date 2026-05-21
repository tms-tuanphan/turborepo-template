/** Default must match Nest `AUTH_COOKIE_NAME` (apps/api/.env). */
export const DEFAULT_AUTH_COOKIE_NAME = 'access_token';

/**
 * Session cookie name for admin BFF + middleware (presence check only; no JWT verify).
 */
export function getAuthCookieName(): string {
  return process.env.AUTH_COOKIE_NAME ?? DEFAULT_AUTH_COOKIE_NAME;
}

export function hasAdminSessionCookie(cookieStore: {
  has: (name: string) => boolean;
}): boolean {
  return cookieStore.has(getAuthCookieName());
}
