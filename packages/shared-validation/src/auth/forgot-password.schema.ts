import { z } from 'zod';

/** API / BE forgot-password body. */
export const forgotPasswordRequestSchema = z.object({
  email: z.string().trim().min(1).email(),
});

export type ForgotPasswordRequestInput = z.infer<
  typeof forgotPasswordRequestSchema
>;
