import { z } from 'zod';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogCategoryFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(SLUG_REGEX, 'Invalid slug format'),
  nameKey: z.string().trim().min(1).max(120),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type BlogCategoryFormInput = z.infer<typeof blogCategoryFormSchema>;
