import { z } from 'zod';

export const blogCategoryFormSchema = z.object({
  displayName: z.string().trim().min(1).max(120),
});

export type BlogCategoryFormInput = z.infer<typeof blogCategoryFormSchema>;
