export function adminLoginPath(locale: string): string {
  return `/${locale}/admin/login`;
}

export function adminForgotPasswordPath(locale: string): string {
  return `/${locale}/admin/forgot-password`;
}

export function adminForgotPasswordSentPath(locale: string): string {
  return `/${locale}/admin/forgot-password/sent`;
}

export function adminResetPasswordPath(locale: string): string {
  return `/${locale}/admin/reset-password`;
}

export function adminResetPasswordSuccessPath(locale: string): string {
  return `/${locale}/admin/reset-password/success`;
}

export function adminRegisterPath(locale: string): string {
  return `/${locale}/admin/register`;
}
