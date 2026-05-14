import { z } from 'zod';

import { BLOG_CATEGORIES } from '@/shared/types/blog';

export const ADMIN_BLOG_STATUSES = ['DRAFT', 'PUBLISHED'] as const;

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
  coverImage: z
    .string()
    .refine(isValidCoverImage, { message: 'Invalid cover image' }),
});

export type AdminBlogInput = z.infer<typeof adminBlogSchema>;
