export type AuthUserRole = 'admin' | 'sub_admin';

export class AuthUserDto {
  id!: string;
  email!: string;
  role!: AuthUserRole;
}
