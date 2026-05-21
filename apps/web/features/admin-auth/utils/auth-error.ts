import { I18nKey, type ApiErrorPayload } from '@repo/api/client';

import type { Messages } from '@/shared/i18n';

export type AdminAuthMessageSection =
  | 'login'
  | 'forgotPassword'
  | 'resetPassword'
  | 'register';

export type AuthErrorInput = ApiErrorPayload | 'network' | null | undefined;

function getSectionMessages(
  messages: Messages,
  section: AdminAuthMessageSection,
) {
  switch (section) {
    case 'login':
      return messages.admin.login;
    case 'forgotPassword':
      return messages.admin.forgotPassword;
    case 'resetPassword':
      return messages.admin.resetPassword;
    case 'register':
      return messages.admin.register;
  }
}

/**
 * Maps auth API errors (I18nKey) or network failures to user-facing messages.
 */
export function getAuthErrorMessage(
  input: AuthErrorInput,
  messages: Messages,
  section: AdminAuthMessageSection = 'login',
): string {
  const t = getSectionMessages(messages, section);

  if (input === 'network') {
    return 'errorNetwork' in t && typeof t.errorNetwork === 'string'
      ? t.errorNetwork
      : messages.admin.login.errorNetwork;
  }

  const code = input?.code;

  if (code === I18nKey.Errors.Auth.InvalidCredentials) {
    return 'errorCredentials' in t && typeof t.errorCredentials === 'string'
      ? t.errorCredentials
      : messages.admin.login.errorCredentials;
  }

  if (code === I18nKey.Errors.Auth.AccountDisabled) {
    return 'errorAccountDisabled' in t &&
      typeof t.errorAccountDisabled === 'string'
      ? t.errorAccountDisabled
      : messages.admin.login.errorAccountDisabled;
  }

  if (code === I18nKey.Errors.Auth.EmailAlreadyExists) {
    return 'errorEmailExists' in t && typeof t.errorEmailExists === 'string'
      ? t.errorEmailExists
      : messages.admin.register.errorEmailExists;
  }

  if (code === I18nKey.Errors.Auth.InvalidResetToken) {
    return 'errorInvalidToken' in t && typeof t.errorInvalidToken === 'string'
      ? t.errorInvalidToken
      : messages.admin.resetPassword.errorInvalidToken;
  }

  if (code === I18nKey.Errors.Auth.WeakPassword) {
    return 'errorWeakPassword' in t && typeof t.errorWeakPassword === 'string'
      ? t.errorWeakPassword
      : messages.admin.resetPassword.errorWeakPassword;
  }

  if (code === I18nKey.Errors.Auth.RateLimited) {
    return 'errorRateLimited' in t && typeof t.errorRateLimited === 'string'
      ? t.errorRateLimited
      : messages.admin.forgotPassword.errorRateLimited;
  }

  if (code === I18nKey.Errors.Common.Unauthorized) {
    if (section === 'login') {
      return messages.admin.login.errorCredentials;
    }
    if (section === 'resetPassword') {
      return messages.admin.resetPassword.errorInvalidToken;
    }
  }

  return t.errorGeneric;
}

/** @deprecated Use getAuthErrorMessage */
export function mapAuthErrorToMessage(
  payload: ApiErrorPayload | null | undefined,
  messages: Messages,
  section: AdminAuthMessageSection = 'login',
): string {
  return getAuthErrorMessage(payload, messages, section);
}
