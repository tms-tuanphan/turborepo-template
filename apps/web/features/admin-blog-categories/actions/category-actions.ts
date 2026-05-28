'use server';

import { revalidatePath } from 'next/cache';

import { isAdminApiConflict } from '@/core/api/fetch-admin-api';
import { getAdminSession } from '@/core/auth/server-session';
import { isLocale, type Locale } from '@/shared/i18n';

import {
  createBlogCategory,
  deleteBlogCategory,
  isCategoryInUseError,
  updateBlogCategory,
} from '../lib/blog-categories-api';
import { blogCategoryFormSchema } from '../validations/category.schema';

import type { CategoryFormActionState } from './category-form-action-state';

function pickString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v : '';
}

function revalidateCategoryPaths(locale: Locale) {
  revalidatePath(`/${locale}/admin/blog-categories`);
  revalidatePath(`/${locale}/admin/blogs`);
}

export async function createCategoryAction(
  _prev: CategoryFormActionState,
  formData: FormData,
): Promise<CategoryFormActionState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, formError: 'unauthorized' };
  }
  if (session.user.role !== 'admin') {
    return { ok: false, formError: 'forbidden' };
  }

  const localeRaw = pickString(formData, 'locale');
  if (!isLocale(localeRaw)) {
    return { ok: false, formError: 'invalid' };
  }
  const locale: Locale = localeRaw;

  const parsed = blogCategoryFormSchema.safeParse({
    displayName: pickString(formData, 'displayName'),
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createBlogCategory(parsed.data);
    revalidateCategoryPaths(locale);
    return { ok: true };
  } catch (error) {
    if (isAdminApiConflict(error)) {
      return { ok: false, formError: 'conflict' };
    }
    return { ok: false, formError: 'invalid' };
  }
}

export async function updateCategoryAction(
  _prev: CategoryFormActionState,
  formData: FormData,
): Promise<CategoryFormActionState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, formError: 'unauthorized' };
  }
  if (session.user.role !== 'admin') {
    return { ok: false, formError: 'forbidden' };
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

  const parsed = blogCategoryFormSchema.safeParse({
    displayName: pickString(formData, 'displayName'),
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateBlogCategory(id, parsed.data);
    revalidateCategoryPaths(locale);
    return { ok: true };
  } catch (error) {
    if (isCategoryInUseError(error)) {
      return { ok: false, formError: 'inUse' };
    }
    if (isAdminApiConflict(error)) {
      return { ok: false, formError: 'conflict' };
    }
    return { ok: false, formError: 'notFound' };
  }
}

export async function deleteCategoryAction(
  formData: FormData,
): Promise<CategoryFormActionState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, formError: 'unauthorized' };
  }
  if (session.user.role !== 'admin') {
    return { ok: false, formError: 'forbidden' };
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

  try {
    await deleteBlogCategory(id);
    revalidateCategoryPaths(locale);
    return { ok: true };
  } catch (error) {
    if (isCategoryInUseError(error)) {
      return { ok: false, formError: 'inUse' };
    }
    return { ok: false, formError: 'notFound' };
  }
}
