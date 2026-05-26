/**
 * i18n keys dùng chung FE/BE (source of truth).
 *
 * Quy ước:
 * - Key là "machine-friendly" và ổn định theo thời gian.
 * - Không hardcode text theo ngôn ngữ trong service/controller; FE (hoặc BE) sẽ map key -> bản dịch.
 */
export const I18nKey = {
  Errors: {
    Common: {
      Unauthorized: 'errors.common.unauthorized',
      Forbidden: 'errors.common.forbidden',
      NotFound: 'errors.common.notFound',
      Conflict: 'errors.common.conflict',
      BadRequest: 'errors.common.badRequest',
      InternalServerError: 'errors.common.internalServerError',
    },
    Blogs: {
      CategoryInUse: 'errors.blogs.categoryInUse',
    },
    Auth: {
      InvalidCredentials: 'errors.auth.invalidCredentials',
      AccountDisabled: 'errors.auth.accountDisabled',
      TokenExpired: 'errors.auth.tokenExpired',
      EmailAlreadyExists: 'errors.auth.emailAlreadyExists',
      InvalidResetToken: 'errors.auth.invalidResetToken',
      WeakPassword: 'errors.auth.weakPassword',
      RateLimited: 'errors.auth.rateLimited',
    },
  },
  Validation: {
    Common: {
      Required: 'validation.common.required',
      Min: 'validation.common.min',
      Max: 'validation.common.max',
      InvalidFormat: 'validation.common.invalidFormat',
    },
  },
} as const;

export type I18nKeyValue = (typeof I18nKey)[keyof typeof I18nKey];
