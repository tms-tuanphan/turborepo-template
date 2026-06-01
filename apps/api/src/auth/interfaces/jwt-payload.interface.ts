import type { AuthUserRole } from '@repo/api';

export type JwtTokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;
  email: string;
  role: AuthUserRole;
  /** Present on refresh tokens; access tokens omit or set to `access`. */
  tokenType?: JwtTokenType;
}
