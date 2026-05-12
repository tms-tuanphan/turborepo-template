import { z } from 'zod';

import { BLOG_CATEGORIES, BLOG_STATUSES } from '@/shared/types/blog';

export const adminBlogSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().min(1).max(300),
    content: z.string().min(1),
    category: z.enum(BLOG_CATEGORIES),
    tags: z.array(z.string().trim().min(1)).max(10).default([]),
    status: z.enum(BLOG_STATUSES),
    coverImage: z.union([z.string().url(), z.literal('')]),
    scheduledAt: z
      .string()
      .trim()
      .optional()
      .transform((s) => (s && s.length > 0 ? s : null)),
    seoTitle: z.string().trim().max(70),
    seoDescription: z.string().trim().max(160),
  })
  .refine(
    (d) =>
      d.status !== 'SCHEDULED' ||
      (d.scheduledAt !== null && d.scheduledAt.length > 0),
    { path: ['scheduledAt'], message: 'scheduledRequired' },
  );

export type AdminBlogInput = z.infer<typeof adminBlogSchema>;
