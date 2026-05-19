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
import { type BlogPost, type BlogStatus } from '@/shared/types/blog';
import { slugify } from '@/shared/utils/slugify';

import { deriveStoredSeo } from '../lib/blog-meta';
import {
  ADMIN_BLOG_STATUSES,
  adminBlogSchema,
  type AdminBlogInput,
} from '../validations/blog.schema';

import type {
  BlogFormActionState,
  BlogFormFormError,
} from './blog-form-action-state';

const SUBMIT_INTENTS = ['draft', 'publish', 'schedule', 'save'] as const;
type SubmitIntent = (typeof SUBMIT_INTENTS)[number];

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

function pickSubmitIntent(formData: FormData): SubmitIntent {
  const raw = pickString(formData, 'submitIntent');
  if ((SUBMIT_INTENTS as readonly string[]).includes(raw)) {
    return raw as SubmitIntent;
  }
  return 'save';
}

function resolveStatusForSubmit(
  intent: SubmitIntent,
  sidebarStatus: string,
): { status: BlogStatus } | { error: BlogFormFormError } {
  switch (intent) {
    case 'draft':
      return { status: 'DRAFT' };
    case 'publish':
      return { status: 'PUBLISHED' };
    case 'save': {
      if (!(ADMIN_BLOG_STATUSES as readonly string[]).includes(sidebarStatus)) {
        return { error: 'invalid' };
      }
      return { status: sidebarStatus as BlogStatus };
    }
    case 'schedule':
      return { error: 'invalid' };
  }
}

type ParseBlogFormResult =
  | { ok: true; data: AdminBlogInput }
  | {
      ok: false;
      formError?: BlogFormFormError;
      fieldErrors?: BlogFormActionState['fieldErrors'];
    };

function parseBlogFormInput(formData: FormData): ParseBlogFormResult {
  const intent = pickSubmitIntent(formData);
  const resolved = resolveStatusForSubmit(
    intent,
    pickString(formData, 'status'),
  );
  if ('error' in resolved) {
    return { ok: false, formError: resolved.error };
  }

  const title = pickString(formData, 'title');
  const slugRaw = pickString(formData, 'slug').trim();
  const slug = slugRaw.length > 0 ? slugRaw : slugify(title);

  const raw = {
    ...formDataToBlogInput(formData),
    title,
    slug,
    status: resolved.status,
  };
  const parsed = adminBlogSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const data: AdminBlogInput = {
    ...parsed.data,
    slug: parsed.data.slug.trim() || slugify(parsed.data.title),
  };
  return { ok: true, data };
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

  const parsedInput = parseBlogFormInput(formData);
  if (!parsedInput.ok) {
    return {
      ok: false,
      formError: parsedInput.formError,
      fieldErrors: parsedInput.fieldErrors,
    };
  }

  const { data } = parsedInput;

  if (isSlugTaken(data.slug, undefined)) {
    return { ok: false, formError: 'slugTaken' };
  }

  const author = resolveAuthor(session);
  const payload = toBlogPayload(data, { author });
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

  const parsedInput = parseBlogFormInput(formData);
  if (!parsedInput.ok) {
    return {
      ok: false,
      formError: parsedInput.formError,
      fieldErrors: parsedInput.fieldErrors,
    };
  }

  const { data } = parsedInput;

  if (isSlugTaken(data.slug, id)) {
    return { ok: false, formError: 'slugTaken' };
  }

  const author = resolveAuthor(session);
  const payload = toBlogPayload(data, { author, existing });
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
