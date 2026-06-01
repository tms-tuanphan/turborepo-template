import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { AuthUser, AuthUserRole } from '@repo/api/client';

import { applyUpstreamSetCookies } from '@/core/auth/upstream-set-cookie';
import {
  DEFAULT_AUTH_COOKIE_NAME,
  getAuthCookieName,
  getRefreshCookieName,
} from '@/core/auth/session-cookie';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

const ACCESS_TTL_MS = 14 * 60 * 1000;

type NestLoginResponse = { user?: AuthUser };

async function nestLogin(
  email: string,
  password: string,
): Promise<NestLoginResponse | null> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  await applyUpstreamSetCookies(response);

  try {
    return (await response.json()) as NestLoginResponse;
  } catch {
    return null;
  }
}

async function nestRefresh(): Promise<boolean> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const refreshName = getRefreshCookieName();
  const refresh = cookieStore.get(refreshName)?.value;

  if (!refresh) {
    return false;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      Cookie: `${refreshName}=${refresh}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return false;
  }

  await applyUpstreamSetCookies(response);
  return true;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === 'string' ? credentials.email : '';
        const password =
          typeof credentials?.password === 'string' ? credentials.password : '';

        if (!email || !password) {
          return null;
        }

        const body = await nestLogin(email, password);
        const user = body?.user;

        if (!user?.id || !user.email) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.role = (user as { role?: AuthUserRole }).role;
        token.accessExpiresAt = Date.now() + ACCESS_TTL_MS;
        return token;
      }

      const expiresAt =
        typeof token.accessExpiresAt === 'number' ? token.accessExpiresAt : 0;

      if (Date.now() < expiresAt) {
        return token;
      }

      const refreshed = await nestRefresh();
      if (refreshed) {
        token.accessExpiresAt = Date.now() + ACCESS_TTL_MS;
        return token;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.email = token.email ?? '';
        session.user.role = token.role as AuthUserRole;
      }
      return session;
    },
  },
  trustHost: true,
});

export { DEFAULT_AUTH_COOKIE_NAME, getAuthCookieName, getRefreshCookieName };
