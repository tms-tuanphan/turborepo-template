import type { Locale } from '@/shared/i18n';
import { getMessages, isLocale } from '@/shared/i18n';
import { slugify } from '@/shared/utils/slugify';

import { isAdminApiConflict } from '@/core/api/fetch-admin-api';
import { getAdminSession } from '@/core/auth/server-session';

import type { BlogFormActionState } from '../actions/blog-form-action-state';
import type { BlogFormFormError } from '../actions/blog-form-action-state';
import {
  checkAdminBlogSlug,
  createAdminBlog,
  getAdminBlogById,
  updateAdminBlog,
} from './admin-blogs-api';
import { deriveStoredSeo } from './blog-meta';
import { formStatusToApiStatus } from '../types/admin-blog';
import {
  ADMIN_BLOG_STATUSES,
  createAdminBlogSchema,
  type AdminBlogInput,
} from '../validations/blog.schema';
import type { SubmitIntent } from '../validations/blog.schema';

const SUBMIT_INTENTS = ['draft', 'publish', 'schedule', 'save'] as const;

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
    categoryId: pickString(formData, 'categoryId'),
    status: pickString(formData, 'status'),
    coverImage: pickString(formData, 'coverImage'),
    primaryKeyword: pickString(formData, 'primaryKeyword'),
  };
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
): { status: AdminBlogInput['status'] } | { error: BlogFormFormError } {
  switch (intent) {
    case 'draft':
      return { status: 'DRAFT' };
    case 'publish':
      return { status: 'PUBLISHED' };
    case 'save': {
      if (!(ADMIN_BLOG_STATUSES as readonly string[]).includes(sidebarStatus)) {
        return { error: 'invalid' };
      }
      return { status: sidebarStatus as AdminBlogInput['status'] };
    }
    default:
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

export function parseBlogFormInput(
  formData: FormData,
  locale: Locale,
): ParseBlogFormResult {
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
  const tv = getMessages(locale).admin.blogs.form.validation;
  const parsed = createAdminBlogSchema({
    contentRequiredPublish: tv.contentRequiredPublish,
    coverInvalid: tv.coverInvalid,
  }).safeParse(raw);
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

function toApiBlogBody(data: AdminBlogInput) {
  const { description: derivedDescription } = deriveStoredSeo(
    data.title,
    data.content,
  );

  const description =
    data.excerpt.trim().length > 0 ? data.excerpt.trim() : derivedDescription;

  return {
    title: data.title,
    slug: data.slug,
    content: data.content,
    description,
    categoryId: data.categoryId,
    status: formStatusToApiStatus(data.status),
    coverImage: data.coverImage,
    ...(data.primaryKeyword.trim().length > 0
      ? { primaryKeyword: data.primaryKeyword.trim() }
      : {}),
  };
}

async function isSlugTaken(
  slug: string,
  excludeId: string | undefined,
): Promise<boolean> {
  const result = await checkAdminBlogSlug(slug, excludeId);
  return !result.available;
}

export async function mutateCreateBlog(
  formData: FormData,
): Promise<BlogFormActionState & { createdId?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, formError: 'unauthorized' };
  }

  const localeRaw = pickString(formData, 'locale');
  if (!isLocale(localeRaw)) {
    return { ok: false, formError: 'invalid' };
  }
  const locale: Locale = localeRaw;

  const parsedInput = parseBlogFormInput(formData, locale);
  if (!parsedInput.ok) {
    return {
      ok: false,
      formError: parsedInput.formError,
      fieldErrors: parsedInput.fieldErrors,
    };
  }

  const { data } = parsedInput;

  try {
    if (await isSlugTaken(data.slug, undefined)) {
      return { ok: false, formError: 'slugTaken' };
    }

    const body = toApiBlogBody(data);
    const created = await createAdminBlog({
      title: body.title,
      slug: body.slug,
      content: body.content,
      description: body.description,
      categoryId: body.categoryId,
      status: body.status,
      coverImage: body.coverImage,
      primaryKeyword: body.primaryKeyword,
    });

    return { ok: true, createdId: created.id };
  } catch (error) {
    if (isAdminApiConflict(error)) {
      return { ok: false, formError: 'slugTaken' };
    }
    return { ok: false, formError: 'invalid' };
  }
}

export async function mutateUpdateBlog(
  formData: FormData,
): Promise<BlogFormActionState> {
  const session = await getAdminSession();
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

  const existing = await getAdminBlogById(id);
  if (!existing) {
    return { ok: false, formError: 'notFound' };
  }

  const parsedInput = parseBlogFormInput(formData, locale);
  if (!parsedInput.ok) {
    return {
      ok: false,
      formError: parsedInput.formError,
      fieldErrors: parsedInput.fieldErrors,
    };
  }

  const { data } = parsedInput;

  try {
    if (await isSlugTaken(data.slug, id)) {
      return { ok: false, formError: 'slugTaken' };
    }

    const body = toApiBlogBody(data);
    await updateAdminBlog(id, {
      title: body.title,
      slug: body.slug,
      content: body.content,
      description: body.description,
      categoryId: body.categoryId,
      status: body.status,
      coverImage: body.coverImage,
      ...(body.primaryKeyword !== undefined
        ? { primaryKeyword: body.primaryKeyword }
        : {}),
    });

    return { ok: true };
  } catch (error) {
    if (isAdminApiConflict(error)) {
      return { ok: false, formError: 'slugTaken' };
    }
    return { ok: false, formError: 'notFound' };
  }
}
