import { SetMetadata } from '@nestjs/common';

import type { AuthUserRole } from '@repo/api';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: AuthUserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
