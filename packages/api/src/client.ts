/**
 * Client-safe exports for Next.js (no NestJS / Swagger runtime).
 * Use `@repo/api` in Nest apps; use `@repo/api/client` in browser code.
 */
export { I18nKey } from './common/i18n/keys';
export type { I18nKeyValue } from './common/i18n/keys';
export type { ApiErrorPayload, ApiErrorDetails } from './common/http/api-error';

export type AuthUserRole = 'admin' | 'sub_admin';

export type AuthUser = {
  id: string;
  email: string;
  role: AuthUserRole;
};

export type LoginResponse = {
  user: AuthUser;
};

export type LogoutResponse = {
  success: boolean;
};
