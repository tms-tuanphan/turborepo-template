import { UserRole, UserStatus } from '@repo/database';

export type AuthUserRecord = {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

/**
 * Factory for auth-related User rows (login/select shape).
 */
export class UserFactory {
  static create(overrides?: Partial<AuthUserRecord>): AuthUserRecord {
    const defaultUser: AuthUserRecord = {
      id: 'user-1',
      email: 'admin@example.com',
      password: '$2b$10$hashedpasswordplaceholder',
      role: UserRole.admin,
      status: UserStatus.active,
    };

    return { ...defaultUser, ...overrides };
  }

  static createDisabled(overrides?: Partial<AuthUserRecord>): AuthUserRecord {
    return this.create({
      status: UserStatus.disabled,
      ...overrides,
    });
  }

  static createSubAdmin(overrides?: Partial<AuthUserRecord>): AuthUserRecord {
    return this.create({
      role: UserRole.sub_admin,
      email: 'sub@example.com',
      ...overrides,
    });
  }
}
