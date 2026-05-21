import { I18nKey, type ApiErrorPayload } from '@repo/api/client';

import type { Messages } from '@/shared/i18n';

/**
 * Maps Nest ApiErrorPayload.code (I18nKey) to admin login UI strings.
 */
export function mapAuthErrorToMessage(
  payload: ApiErrorPayload | null | undefined,
  messages: Messages,
): string {
  const t = messages.admin.login;
  const code = payload?.code;

  if (code === I18nKey.Errors.Auth.InvalidCredentials) {
    return t.errorCredentials;
  }

  if (code === I18nKey.Errors.Auth.AccountDisabled) {
    return t.errorAccountDisabled;
  }

  if (code === I18nKey.Errors.Common.Unauthorized) {
    return t.errorCredentials;
  }

  return t.errorGeneric;
}
