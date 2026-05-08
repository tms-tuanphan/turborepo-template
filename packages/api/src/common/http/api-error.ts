import type { I18nKeyValue } from '../i18n/keys';

export type ApiErrorDetails =
  | {
      field?: string;
      constraint?: string;
      [key: string]: unknown;
    }
  | unknown;

/**
 * Shape lỗi tối thiểu cho BE trả về và FE tiêu thụ.
 * `code` là i18n key ổn định; FE có thể dịch dựa trên `code` + `params`.
 */
export type ApiErrorPayload = {
  code: I18nKeyValue | string;
  message?: string;
  params?: Record<string, unknown>;
  details?: ApiErrorDetails;
  traceId?: string;
};
