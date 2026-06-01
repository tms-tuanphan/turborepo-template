import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { AuthUser, AuthUserRole } from '@repo/api/client';

import { getAccessTtlMs } from '@/core/auth/access-ttl';
import { getAccessJwtExpMs } from '@/core/auth/upstream-session-refresh';
import { applyUpstreamSetCookies } from '@/core/auth/upstream-set-cookie';
import {
  DEFAULT_AUTH_COOKIE_NAME,
  getAuthCookieName,
  getRefreshCookieName,
} from '@/core/auth/session-cookie';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

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
        token.accessExpiresAt = Date.now() + getAccessTtlMs();
        return token;
      }

      if (token.error === 'RefreshAccessTokenError') {
        return token;
      }

      const expiresAt =
        typeof token.accessExpiresAt === 'number' ? token.accessExpiresAt : 0;

      if (Date.now() < expiresAt) {
        return token;
      }

      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const access = cookieStore.get(getAuthCookieName())?.value;

      if (access) {
        const accessExp = getAccessJwtExpMs(access);
        if (accessExp !== null && Date.now() < accessExp) {
          token.accessExpiresAt = Date.now() + getAccessTtlMs();
          return token;
        }
      }

      return { ...token, error: 'RefreshAccessTokenError' as const };
    },
    session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        return { ...session, expires: '1970-01-01T00:00:00.000Z' };
      }

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
