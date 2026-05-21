import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  resetPasswordRequestSchema,
  type ResetPasswordRequestInput,
} from '@repo/shared-validation';
import { z } from 'zod';

import type { Messages } from '@/shared/i18n';

export type AdminResetPasswordValidationMessages =
  Messages['admin']['resetPassword'];

export function createAdminResetPasswordSchema(
  messages: AdminResetPasswordValidationMessages,
) {
  return z
    .object({
      password: z
        .string()
        .min(1, messages.validationPasswordRequired)
        .min(PASSWORD_MIN_LENGTH, messages.validationPasswordMin)
        .regex(PASSWORD_REGEX, messages.validationPasswordFormat),
      confirmPassword: z.string().min(1, messages.validationConfirmRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.validationConfirmMismatch,
      path: ['confirmPassword'],
    });
}

export type AdminResetPasswordInput = z.infer<
  ReturnType<typeof createAdminResetPasswordSchema>
>;

/** Body sent to POST /api/session/reset-password (matches BE ResetPasswordDto). */
export function toResetPasswordRequestBody(
  token: string,
  input: Pick<AdminResetPasswordInput, 'password'>,
): ResetPasswordRequestInput {
  return resetPasswordRequestSchema.parse({
    token: token.trim(),
    newPassword: input.password,
  });
}
