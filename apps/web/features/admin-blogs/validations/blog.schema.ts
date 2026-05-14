import { z } from 'zod';

import { BLOG_CATEGORIES } from '@/shared/types/blog';

export const ADMIN_BLOG_STATUSES = ['DRAFT', 'PUBLISHED'] as const;

export type AdminBlogStatus = (typeof ADMIN_BLOG_STATUSES)[number];

export const adminBlogSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.string().min(1),
  category: z.enum(BLOG_CATEGORIES),
  status: z.enum(ADMIN_BLOG_STATUSES),
  coverImage: z.union([z.string().url(), z.literal('')]),
});

export type AdminBlogInput = z.infer<typeof adminBlogSchema>;
