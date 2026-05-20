import type { AuthUserRole } from '@repo/api';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: AuthUserRole;
}
