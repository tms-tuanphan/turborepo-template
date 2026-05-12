'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import {
  adminBlogSchema,
  type AdminBlogInput,
} from '@/features/admin/validations/blog.schema';
import {
  createBlogInStore,
  deleteBlogInStore,
  getBlogById,
  getBlogBySlug,
  updateBlogInStore,
} from '@/features/blogs';
import { defaultLocale, isLocale, type Locale } from '@/shared/i18n';
import type { BlogPost } from '@/shared/types/blog';

export type BlogFormActionState = {
  ok: boolean;
  fieldErrors?: Partial<Record<string, string[]>>;
  formError?: 'unauthorized' | 'slugTaken' | 'notFound' | 'invalid';
};

export const initialBlogFormActionState: BlogFormActionState = { ok: true };

function pickString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v : '';
}

function parseTagsJson(raw: string): string[] {
  if (!raw.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t): t is string => typeof t === 'string');
  } catch {
    return [];
  }
}

function formDataToBlogInput(formData: FormData): Record<string, unknown> {
  return {
    title: pickString(formData, 'title'),
    slug: pickString(formData, 'slug'),
    description: pickString(formData, 'description'),
    content: pickString(formData, 'content'),
    category: pickString(formData, 'category'),
    tags: parseTagsJson(pickString(formData, 'tags')),
    status: pickString(formData, 'status'),
    coverImage: pickString(formData, 'coverImage'),
    scheduledAt: pickString(formData, 'scheduledAt'),
    seoTitle: pickString(formData, 'seoTitle'),
    seoDescription: pickString(formData, 'seoDescription'),
  };
}

function resolveAuthor(session: {
  user?: { name?: string | null; email?: string | null } | null;
}): string {
  return session.user?.name?.trim() || session.user?.email?.trim() || 'Admin';
}

function toBlogPayload(
  data: AdminBlogInput,
  ctx: { author: string; existing?: BlogPost },
): Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> {
  const existing = ctx.existing;
  const today = new Date().toISOString().slice(0, 10);

  let publishedAt: string | null = null;
  if (data.status === 'PUBLISHED') {
    publishedAt = existing?.publishedAt ?? today;
  } else if (data.status === 'ARCHIVED') {
    publishedAt = existing?.publishedAt ?? null;
  }

  const scheduledAt =
    data.status === 'SCHEDULED' && data.scheduledAt
      ? new Date(data.scheduledAt).toISOString()
      : null;

  const seo = {
    metaTitle:
      data.seoTitle.length > 0 ? data.seoTitle : data.title.slice(0, 70),
    metaDescription:
      data.seoDescription.length > 0
        ? data.seoDescription
        : data.description.slice(0, 160),
  };

  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    content: data.content,
    category: data.category,
    tags: data.tags,
    status: data.status,
    coverImage: data.coverImage,
    author: ctx.author,
    views: existing?.views ?? 0,
    publishedAt,
    scheduledAt,
    seo,
  };
}

function isSlugTaken(slug: string, excludeId: string | undefined): boolean {
  const hit = getBlogBySlug(slug);
  if (!hit) return false;
  if (excludeId && hit.id === excludeId) return false;
  return true;
}

export async function createBlogAction(
  _prev: BlogFormActionState,
  formData: FormData,
): Promise<BlogFormActionState> {
  const session = await auth();
  if (!session) {
    return { ok: false, formError: 'unauthorized' };
  }

  const localeRaw = pickString(formData, 'locale');
  if (!isLocale(localeRaw)) {
    return { ok: false, formError: 'invalid' };
  }
  const locale: Locale = localeRaw;

  const parsed = adminBlogSchema.safeParse(formDataToBlogInput(formData));
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (isSlugTaken(parsed.data.slug, undefined)) {
    return { ok: false, formError: 'slugTaken' };
  }

  const author = resolveAuthor(session);
  const payload = toBlogPayload(parsed.data, { author });
  const id = createBlogInStore(payload);

  revalidatePath(`/${locale}/admin/blogs`);
  revalidatePath(`/${locale}/resources/blogs`);
  redirect(`/${locale}/admin/blogs/${id}/edit`);
}

export async function updateBlogAction(
  _prev: BlogFormActionState,
  formData: FormData,
): Promise<BlogFormActionState> {
  const session = await auth();
  if (!session) {
    return { ok: false, formError: 'unauthorized' };
  }

  const localeRaw = pickString(formData, 'locale');
  if (!isLocale(localeRaw)) {
    return { ok: false, formError: 'invalid' };
  }
  const locale: Locale = localeRaw;

  const id = pickString(formData, 'id');
  if (!id) {
    return { ok: false, formError: 'invalid' };
  }

  const existing = getBlogById(id);
  if (!existing) {
    return { ok: false, formError: 'notFound' };
  }

  const parsed = adminBlogSchema.safeParse(formDataToBlogInput(formData));
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (isSlugTaken(parsed.data.slug, id)) {
    return { ok: false, formError: 'slugTaken' };
  }

  const author = resolveAuthor(session);
  const payload = toBlogPayload(parsed.data, { author, existing });
  const ok = updateBlogInStore(id, payload);
  if (!ok) {
    return { ok: false, formError: 'notFound' };
  }

  revalidatePath(`/${locale}/admin/blogs`);
  revalidatePath(`/${locale}/admin/blogs/${id}/edit`);
  revalidatePath(`/${locale}/resources/blogs`);
  return { ok: true };
}

export async function deleteBlogAction(formData: FormData): Promise<void> {
  const localeRaw = pickString(formData, 'locale');
  if (!isLocale(localeRaw)) {
    redirect(`/${defaultLocale}/admin/blogs`);
  }
  const locale: Locale = localeRaw;

  const session = await auth();
  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const id = pickString(formData, 'id');
  if (id) {
    deleteBlogInStore(id);
  }

  revalidatePath(`/${locale}/admin/blogs`);
  revalidatePath(`/${locale}/resources/blogs`);
  redirect(`/${locale}/admin/blogs`);
}
