import { z } from 'zod';

export const adminForgotPasswordSchema = z.object({
  email: z.string().trim().min(1).email(),
});

export type AdminForgotPasswordInput = z.infer<
  typeof adminForgotPasswordSchema
>;
