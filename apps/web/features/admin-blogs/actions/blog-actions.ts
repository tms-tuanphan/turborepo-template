'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import {
  createBlogInStore,
  deleteBlogInStore,
  getBlogById,
  getBlogBySlug,
  updateBlogInStore,
} from '@/features/blogs';
import { defaultLocale, isLocale, type Locale } from '@/shared/i18n';
import type { BlogPost } from '@/shared/types/blog';

import { deriveStoredSeo } from '../lib/blog-meta';
import {
  adminBlogSchema,
  type AdminBlogInput,
} from '../validations/blog.schema';

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

function formDataToBlogInput(formData: FormData): Record<string, unknown> {
  return {
    title: pickString(formData, 'title'),
    slug: pickString(formData, 'slug'),
    content: pickString(formData, 'content'),
    excerpt: pickString(formData, 'excerpt'),
    tags: pickString(formData, 'tags'),
    category: pickString(formData, 'category'),
    status: pickString(formData, 'status'),
    coverImage: pickString(formData, 'coverImage'),
    scheduledAt: pickString(formData, 'scheduledAt'),
    primaryKeyword: pickString(formData, 'primaryKeyword'),
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

  const {
    description: derivedDescription,
    metaTitle,
    metaDescription,
  } = deriveStoredSeo(data.title, data.content);

  const description =
    data.excerpt.trim().length > 0 ? data.excerpt.trim() : derivedDescription;

  const publishedAt =
    data.status === 'PUBLISHED' ? (existing?.publishedAt ?? today) : null;

  const scheduledAtRaw = data.scheduledAt.trim();
  const scheduledAt =
    data.status === 'SCHEDULED' && scheduledAtRaw.length > 0
      ? new Date(scheduledAtRaw).toISOString()
      : null;

  const seo = {
    metaTitle,
    metaDescription:
      data.excerpt.trim().length > 0
        ? data.excerpt.trim().slice(0, 160)
        : metaDescription,
    ...(data.primaryKeyword.trim().length > 0
      ? { primaryKeyword: data.primaryKeyword.trim() }
      : {}),
  };

  return {
    slug: data.slug,
    title: data.title,
    description,
    content: data.content,
    category: data.category,
    tags: data.tags.length > 0 ? data.tags : (existing?.tags ?? []),
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
