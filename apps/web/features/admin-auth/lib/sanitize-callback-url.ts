/**
 * Restricts post-login redirects to same-origin admin paths for the given locale.
 * Prevents open redirects via callbackUrl query params.
 */
export function sanitizeAdminCallbackUrl(
  raw: string | null | undefined,
  locale: string,
): string {
  const fallback = `/${locale}/admin/blogs`;

  if (!raw || typeof raw !== 'string') {
    return fallback;
  }

  const trimmed = raw.trim();
  if (!trimmed.startsWith('/')) {
    return fallback;
  }

  if (trimmed.startsWith('//') || trimmed.includes('://')) {
    return fallback;
  }

  const adminPrefix = `/${locale}/admin`;
  if (trimmed === adminPrefix || trimmed.startsWith(`${adminPrefix}/`)) {
    return trimmed;
  }

  return fallback;
}
