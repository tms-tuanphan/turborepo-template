import type { AuthUserRole } from '@repo/api';

export interface JwtPayload {
  sub: string;
  email: string;
  role: AuthUserRole;
}
