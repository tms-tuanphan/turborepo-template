import { z } from 'zod';

import { ADMIN_FORM_STATUSES, type AdminFormStatus } from '../types/admin-blog';

export const ADMIN_BLOG_STATUSES = ADMIN_FORM_STATUSES;

export type AdminBlogStatus = AdminFormStatus;

/** Base64 data URLs for ~5 MB files expand beyond raw bytes; cap total string length. */
export const COVER_IMAGE_MAX_LENGTH = 7_000_000;

const DATA_IMAGE_COVER_REGEX =
  /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/;

export function isValidCoverImage(value: string): boolean {
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

/** Client form fields shown in the editor UI. */
export const blogPostFormSchema = z.object({
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().max(200).optional().default(''),
  content: z.string().default(''),
  status: z.enum(ADMIN_BLOG_STATUSES),
  categoryId: z.string().min(1),
  coverImage: z
    .string()
    .default('')
    .refine(isValidCoverImage, { message: 'Invalid cover image' }),
  slug: z.string().trim().max(120).optional().default(''),
});

export type BlogPostFormInput = z.infer<typeof blogPostFormSchema>;

export type BlogFormValidationMessages = {
  titleRequired: string;
  titleMax: string;
  excerptMax: string;
  contentRequiredPublish: string;
  coverInvalid: string;
};

export function createBlogPostFormSchema(messages: BlogFormValidationMessages) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, messages.titleRequired)
      .max(200, messages.titleMax),
    excerpt: z
      .string()
      .trim()
      .max(200, messages.excerptMax)
      .optional()
      .default(''),
    content: z.string().default(''),
    status: z.enum(ADMIN_BLOG_STATUSES),
    categoryId: z.string().min(1),
    coverImage: z
      .string()
      .default('')
      .refine(isValidCoverImage, { message: messages.coverInvalid }),
    slug: z.string().trim().max(120).optional().default(''),
  });
}

export function createPublishFormSchema(messages: BlogFormValidationMessages) {
  return createBlogPostFormSchema(messages).refine(
    (data) => data.content.trim().length > 0,
    { message: messages.contentRequiredPublish, path: ['content'] },
  );
}

export type SubmitIntent = 'draft' | 'publish' | 'save';

export function validateBlogFormForSubmit(
  data: BlogPostFormInput,
  intent: SubmitIntent,
  messages: BlogFormValidationMessages,
):
  | { success: true; data: BlogPostFormInput }
  | { success: false; errors: z.ZodError } {
  const schema =
    intent === 'publish'
      ? createPublishFormSchema(messages)
      : createBlogPostFormSchema(messages);
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export type AdminBlogServerValidationMessages = {
  contentRequiredPublish: string;
  coverInvalid: string;
};

/** Server-side payload after FormData is assembled. */
export function createAdminBlogSchema(
  messages: AdminBlogServerValidationMessages,
) {
  return z
    .object({
      title: z.string().trim().min(1).max(200),
      slug: z
        .string()
        .trim()
        .max(120)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      content: z.string(),
      excerpt: z.string().trim().max(200).optional().default(''),
      categoryId: z.string().min(1),
      status: z.enum(ADMIN_BLOG_STATUSES),
      coverImage: z
        .string()
        .refine(isValidCoverImage, { message: messages.coverInvalid }),
      primaryKeyword: z.string().trim().max(60).optional().default(''),
    })
    .superRefine((data, ctx) => {
      if (data.status === 'PUBLISHED' && data.content.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: messages.contentRequiredPublish,
          path: ['content'],
        });
      }
    });
}

export type AdminBlogInput = z.infer<ReturnType<typeof createAdminBlogSchema>>;
