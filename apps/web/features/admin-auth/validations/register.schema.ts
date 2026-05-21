import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  registerRequestSchema,
  type RegisterRequestInput,
} from '@repo/shared-validation';
import { z } from 'zod';

import type { Messages } from '@/shared/i18n';

export type AdminRegisterValidationMessages = Messages['admin']['register'];

export function createAdminRegisterSchema(
  messages: AdminRegisterValidationMessages,
) {
  return z
    .object({
      email: z
        .string()
        .trim()
        .min(1, messages.validationEmailRequired)
        .email(messages.validationEmailInvalid),
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

export type AdminRegisterInput = z.infer<
  ReturnType<typeof createAdminRegisterSchema>
>;

export type AdminRegisterField = keyof AdminRegisterInput;

/** Body sent to POST /api/session/register (matches BE registerRequestSchema). */
export function toRegisterRequestBody(
  input: Pick<AdminRegisterInput, 'email' | 'password'>,
): RegisterRequestInput {
  return registerRequestSchema.parse({
    email: input.email.trim(),
    password: input.password,
  });
}
