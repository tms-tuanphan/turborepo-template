import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export const adminResetPasswordSchema = z
  .object({
    password: z.string().min(MIN_PASSWORD_LENGTH),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'mismatch',
    path: ['confirmPassword'],
  });

export type AdminResetPasswordInput = z.infer<typeof adminResetPasswordSchema>;
