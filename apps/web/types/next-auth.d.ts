import type { AuthUserRole } from '@repo/api/client';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: AuthUserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: AuthUserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AuthUserRole;
    accessExpiresAt?: number;
    error?: 'RefreshAccessTokenError';
  }
}
