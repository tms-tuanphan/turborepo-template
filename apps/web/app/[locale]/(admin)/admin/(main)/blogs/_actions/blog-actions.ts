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

const DESCRIPTION_MAX = 300;
const META_TITLE_MAX = 70;
const META_DESCRIPTION_MAX = 160;

function pickString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v : '';
}

function formDataToBlogInput(formData: FormData): Record<string, unknown> {
  return {
    title: pickString(formData, 'title'),
    slug: pickString(formData, 'slug'),
    content: pickString(formData, 'content'),
    category: pickString(formData, 'category'),
    status: pickString(formData, 'status'),
    coverImage: pickString(formData, 'coverImage'),
  };
}

function resolveAuthor(session: {
  user?: { name?: string | null; email?: string | null } | null;
}): string {
  return session.user?.name?.trim() || session.user?.email?.trim() || 'Admin';
}

/**
 * Derive a plain-text excerpt from markdown so list/detail pages keep a
 * meaningful description after the dedicated field was removed from the form.
 * Picks the first non-heading paragraph and strips markdown syntax.
 */
function deriveDescription(markdown: string): string {
  const paragraph = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !/^#{1,6}\s+/.test(block));

  if (!paragraph) return '';

  const plain = paragraph
    .replace(/^>\s?/gm, '')
    .replace(/[*_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return '';
  return plain.length > DESCRIPTION_MAX
    ? plain.slice(0, DESCRIPTION_MAX).trimEnd()
    : plain;
}

function toBlogPayload(
  data: AdminBlogInput,
  ctx: { author: string; existing?: BlogPost },
): Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> {
  const existing = ctx.existing;
  const today = new Date().toISOString().slice(0, 10);

  const description = deriveDescription(data.content);

  const publishedAt =
    data.status === 'PUBLISHED' ? (existing?.publishedAt ?? today) : null;

  const seo = {
    metaTitle: data.title.slice(0, META_TITLE_MAX),
    metaDescription: description.slice(0, META_DESCRIPTION_MAX),
  };

  return {
    slug: data.slug,
    title: data.title,
    description,
    content: data.content,
    category: data.category,
    tags: existing?.tags ?? [],
    status: data.status,
    coverImage: data.coverImage,
    author: ctx.author,
    views: existing?.views ?? 0,
    publishedAt,
    scheduledAt: null,
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
