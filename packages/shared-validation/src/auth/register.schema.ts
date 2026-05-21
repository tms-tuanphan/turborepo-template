import { z } from 'zod';

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from './password.rule';

/** API / BE register body — no confirmPassword. */
export const registerRequestSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX),
});

export type RegisterRequestInput = z.infer<typeof registerRequestSchema>;
