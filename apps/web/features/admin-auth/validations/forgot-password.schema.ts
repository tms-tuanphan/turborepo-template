import {
  forgotPasswordRequestSchema,
  type ForgotPasswordRequestInput,
} from '@repo/shared-validation';
import { z } from 'zod';

import type { Messages } from '@/shared/i18n';

export type AdminForgotPasswordValidationMessages =
  Messages['admin']['forgotPassword'];

export function createAdminForgotPasswordSchema(
  messages: AdminForgotPasswordValidationMessages,
) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.validationEmailRequired)
      .email(messages.validationEmailInvalid),
  });
}

export type AdminForgotPasswordInput = z.infer<
  ReturnType<typeof createAdminForgotPasswordSchema>
>;

/** Body sent to POST /api/session/forgot-password (matches BE ForgotPasswordDto). */
export function toForgotPasswordRequestBody(
  input: Pick<AdminForgotPasswordInput, 'email'>,
): ForgotPasswordRequestInput {
  return forgotPasswordRequestSchema.parse({
    email: input.email.trim(),
  });
}

/** @deprecated Use createAdminForgotPasswordSchema + toForgotPasswordRequestBody */
export const adminForgotPasswordSchema = z.object({
  email: z.string().trim().min(1).email(),
});
