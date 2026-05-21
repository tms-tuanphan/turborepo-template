import { z } from 'zod';

import type { Messages } from '@/shared/i18n';

export type AdminLoginValidationMessages = Messages['admin']['login'];

export function createAdminLoginSchema(messages: AdminLoginValidationMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.validationEmailRequired)
      .email(messages.validationEmailInvalid),
    password: z
      .string()
      .min(1, messages.validationPasswordRequired)
      .min(6, messages.validationPasswordMin),
  });
}

export type AdminLoginInput = z.infer<
  ReturnType<typeof createAdminLoginSchema>
>;

export type AdminLoginField = keyof AdminLoginInput;

export function mapAdminLoginZodErrors(
  error: z.ZodError,
): Partial<Record<AdminLoginField, string>> {
  const fieldErrors: Partial<Record<AdminLoginField, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === 'email' || field === 'password') &&
      fieldErrors[field] === undefined
    ) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
