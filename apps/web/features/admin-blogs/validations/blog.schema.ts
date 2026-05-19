import { z } from 'zod';

import { BLOG_CATEGORIES, BLOG_STATUSES } from '@/shared/types/blog';

export const ADMIN_BLOG_STATUSES = ['DRAFT', 'PUBLISHED'] as const;
export const ADMIN_BLOG_WORKFLOW_STATUSES = [
  'DRAFT',
  'REVIEWING',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
] as const;

export type AdminBlogStatus = (typeof ADMIN_BLOG_STATUSES)[number];

/** Base64 data URLs for ~2 MB files expand beyond raw bytes; cap total string length. */
const COVER_IMAGE_MAX_LENGTH = 3_500_000;

const DATA_IMAGE_COVER_REGEX =
  /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/;

function isValidCoverImage(value: string): boolean {
  if (value === '') {
    return true;
  }
  if (value.length > COVER_IMAGE_MAX_LENGTH) {
    return false;
  }
  if (value.startsWith('data:image/')) {
    return DATA_IMAGE_COVER_REGEX.test(value);
  }
  if (value.length > 4096) {
    return false;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseTags(raw: string): string[] {
  return raw
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export const adminBlogSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.string().min(1),
  excerpt: z.string().trim().max(200).optional().default(''),
  tags: z
    .string()
    .optional()
    .default('')
    .transform((v) => parseTags(v)),
  category: z.enum(BLOG_CATEGORIES),
  status: z.enum(BLOG_STATUSES),
  coverImage: z
    .string()
    .refine(isValidCoverImage, { message: 'Invalid cover image' }),
  scheduledAt: z.string().optional().default(''),
  primaryKeyword: z.string().trim().max(60).optional().default(''),
});

export type AdminBlogInput = z.infer<typeof adminBlogSchema>;
