import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  registerRequestSchema,
} from '@repo/shared-validation';
import { z } from 'zod';

import type { Messages } from '@/shared/i18n';

export type AdminUserValidationMessages = Messages['admin']['users'];

function emailField(messages: AdminUserValidationMessages) {
  return z
    .string()
    .trim()
    .min(1, messages.validationEmailRequired)
    .email(messages.validationEmailInvalid);
}

function passwordField(messages: AdminUserValidationMessages) {
  return z
    .string()
    .min(1, messages.validationPasswordRequired)
    .min(PASSWORD_MIN_LENGTH, messages.validationPasswordMin)
    .regex(PASSWORD_REGEX, messages.validationPasswordFormat);
}

/** Form + client dialog (includes confirmPassword). */
export function createAdminUserCreateSchema(
  messages: AdminUserValidationMessages,
) {
  return z
    .object({
      email: emailField(messages),
      password: passwordField(messages),
      confirmPassword: z.string().min(1, messages.validationConfirmRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.validationConfirmMismatch,
      path: ['confirmPassword'],
    });
}

/** BFF POST /api/admin/users — body is email + password only. */
export function createAdminUserCreateApiSchema(
  messages: AdminUserValidationMessages,
) {
  return z.object({
    email: emailField(messages),
    password: passwordField(messages),
  });
}

export function createAdminUserUpdateSchema(
  messages: AdminUserValidationMessages,
) {
  return z
    .object({
      email: z
        .string()
        .trim()
        .min(1, messages.validationEmailRequired)
        .email(messages.validationEmailInvalid),
      status: z.enum(['active', 'disabled']),
      password: z
        .string()
        .optional()
        .refine(
          (value) =>
            value === undefined ||
            value === '' ||
            (value.length >= PASSWORD_MIN_LENGTH && PASSWORD_REGEX.test(value)),
          { message: messages.validationPasswordFormat },
        ),
      confirmPassword: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!data.password) return true;
        return data.password === data.confirmPassword;
      },
      {
        message: messages.validationConfirmMismatch,
        path: ['confirmPassword'],
      },
    );
}

export type AdminUserCreateInput = z.infer<
  ReturnType<typeof createAdminUserCreateSchema>
>;

export type AdminUserCreateApiInput = z.infer<
  ReturnType<typeof createAdminUserCreateApiSchema>
>;

export type AdminUserUpdateInput = z.infer<
  ReturnType<typeof createAdminUserUpdateSchema>
>;

export function toCreateAdminUserBody(
  input:
    | Pick<AdminUserCreateInput, 'email' | 'password'>
    | AdminUserCreateApiInput,
) {
  return registerRequestSchema.parse({
    email: input.email.trim(),
    password: input.password,
  });
}
