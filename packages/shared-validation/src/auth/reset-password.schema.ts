import { z } from 'zod';

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from './password.rule';

/** API / BE reset-password body — no confirmPassword. */
export const resetPasswordRequestSchema = z.object({
  token: z.string().trim().min(1),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX),
});

export type ResetPasswordRequestInput = z.infer<
  typeof resetPasswordRequestSchema
>;
