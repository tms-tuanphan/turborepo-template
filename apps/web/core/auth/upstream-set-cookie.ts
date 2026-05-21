import { cookies } from 'next/headers';

type ParsedSetCookie = {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
  maxAge?: number;
  expires?: Date;
};

export function getSetCookieHeaders(response: Response): string[] {
  if (typeof response.headers.getSetCookie === 'function') {
    return response.headers.getSetCookie();
  }
  const header = response.headers.get('set-cookie');
  return header ? [header] : [];
}

function parseSetCookieHeader(header: string): ParsedSetCookie | null {
  const segments = header.split(';').map((part) => part.trim());
  const namePart = segments[0];
  if (!namePart) return null;

  const equalsIndex = namePart.indexOf('=');
  if (equalsIndex <= 0) return null;

  const parsed: ParsedSetCookie = {
    name: namePart.slice(0, equalsIndex),
    value: namePart.slice(equalsIndex + 1),
  };

  for (const attr of segments.slice(1)) {
    const lower = attr.toLowerCase();
    if (lower === 'httponly') {
      parsed.httpOnly = true;
    } else if (lower === 'secure') {
      parsed.secure = true;
    } else if (lower.startsWith('path=')) {
      parsed.path = attr.slice(5);
    } else if (lower.startsWith('max-age=')) {
      parsed.maxAge = Number.parseInt(attr.slice(8), 10);
    } else if (lower.startsWith('samesite=')) {
      const value = attr.slice(9).toLowerCase();
      if (value === 'lax' || value === 'strict' || value === 'none') {
        parsed.sameSite = value;
      }
    } else if (lower.startsWith('expires=')) {
      const date = new Date(attr.slice(8));
      if (!Number.isNaN(date.getTime())) {
        parsed.expires = date;
      }
    }
  }

  return parsed;
}

/**
 * Applies Set-Cookie headers from a Nest auth response onto the Next.js cookie store.
 */
export async function applyUpstreamSetCookies(
  response: Response,
): Promise<void> {
  const cookieStore = await cookies();

  for (const header of getSetCookieHeaders(response)) {
    const parsed = parseSetCookieHeader(header);
    if (!parsed) continue;

    cookieStore.set(parsed.name, parsed.value, {
      httpOnly: parsed.httpOnly ?? true,
      secure: parsed.secure,
      sameSite: parsed.sameSite ?? 'lax',
      path: parsed.path ?? '/',
      ...(parsed.maxAge !== undefined && !Number.isNaN(parsed.maxAge)
        ? { maxAge: parsed.maxAge }
        : {}),
      ...(parsed.expires ? { expires: parsed.expires } : {}),
    });
  }
}
