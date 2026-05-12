import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const adminEmail = process.env.ADMIN_DEMO_EMAIL ?? '';
const adminPassword = process.env.ADMIN_DEMO_PASSWORD ?? '';

/**
 * Auth.js requires a secret to sign cookies/JWTs. Missing `AUTH_SECRET` surfaces
 * as ClientFetchError ("server configuration") on the client.
 * Set `AUTH_SECRET` or `NEXTAUTH_SECRET` in all deployed environments.
 */
function resolveAuthSecret(): string {
  const fromEnv = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? '';
  if (fromEnv.length > 0) {
    return fromEnv;
  }

  const fallback =
    process.env.NODE_ENV === 'development'
      ? 'local-dev-only-auth-secret-min-32-chars-do-not-use-in-prod'
      : 'unsafe-fallback-set-auth-secret-in-env-min-32-chars!!!!!!!!!!';

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[auth] AUTH_SECRET / NEXTAUTH_SECRET is not set. JWTs and cookies use an insecure built-in fallback. Set AUTH_SECRET before any real deployment.',
    );
  }

  return fallback;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: resolveAuthSecret(),
  providers: [
    Credentials({
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== 'string' || typeof password !== 'string') {
          return null;
        }
        if (!adminEmail || !adminPassword) {
          return null;
        }
        if (email === adminEmail && password === adminPassword) {
          return {
            id: 'admin',
            name: 'Admin',
            email,
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
});
