'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';

import { slugify } from '@/shared/utils/slugify';

import type {
  AdminBlogCategoryOption,
  AdminBlogPost,
} from '../types/admin-blog';
import { apiStatusToFormStatus } from '../types/admin-blog';
import {
  type BlogFormValidationMessages,
  type BlogPostFormInput,
  type SubmitIntent,
  validateBlogFormForSubmit,
} from '../validations/blog.schema';

const AUTOSAVE_MS = 30_000;

export type UseAdminBlogFormOptions = {
  mode: 'create' | 'edit';
  postId?: string;
  initial?: AdminBlogPost;
  categories: AdminBlogCategoryOption[];
  validationMessages: BlogFormValidationMessages;
};

function buildDefaultValues(
  initial: AdminBlogPost | undefined,
  categories: AdminBlogCategoryOption[],
): BlogPostFormInput {
  const defaultCategoryId = categories[0]?.id ?? '';
  return {
    title: initial?.title ?? '',
    excerpt: initial?.description ?? '',
    content: initial?.content ?? '',
    status: apiStatusToFormStatus(initial?.status ?? 'UNPUBLISHED'),
    categoryId: initial?.category.id ?? defaultCategoryId,
    coverImage: initial?.coverImage ?? '',
    slug: initial?.slug ?? '',
  };
}

function storageKey(mode: 'create' | 'edit', postId?: string): string {
  return `admin-blog-draft:${mode}:${postId ?? 'new'}`;
}

export function applyZodErrorsToForm(
  setError: ReturnType<typeof useForm<BlogPostFormInput>>['setError'],
  zodError: {
    issues: ReadonlyArray<{
      path: ReadonlyArray<PropertyKey>;
      message: string;
    }>;
  },
) {
  for (const issue of zodError.issues) {
    const field = issue.path[0];
    if (typeof field === 'string') {
      setError(field as keyof BlogPostFormInput, {
        type: 'manual',
        message: issue.message,
      });
    }
  }
}

export function scrollToFirstFieldError() {
  const el = document.querySelector<HTMLElement>('[aria-invalid="true"]');
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function useAdminBlogForm({
  mode,
  postId,
  initial,
  categories,
  validationMessages,
}: UseAdminBlogFormOptions) {
  const submitIntentRef = useRef<SubmitIntent>('draft');
  const slugTouched = useRef(Boolean(initial?.slug));
  const autosaveKey = storageKey(mode, postId);

  const form = useForm<BlogPostFormInput>({
    defaultValues: buildDefaultValues(initial, categories),
    mode: 'onBlur',
  });

  const { reset, setValue, watch, setError, clearErrors, getValues } = form;

  useEffect(() => {
    if (mode !== 'create' || initial) return;
    try {
      const raw = localStorage.getItem(autosaveKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as BlogPostFormInput;
      reset({
        ...buildDefaultValues(undefined, categories),
        ...parsed,
      });
    } catch {
      /* ignore corrupt draft */
    }
  }, [autosaveKey, categories, initial, mode, reset]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      try {
        localStorage.setItem(autosaveKey, JSON.stringify(getValues()));
      } catch {
        /* quota exceeded */
      }
    }, AUTOSAVE_MS);
    return () => window.clearInterval(timer);
  }, [autosaveKey, getValues]);

  const clearDraftStorage = useCallback(() => {
    try {
      localStorage.removeItem(autosaveKey);
    } catch {
      /* ignore */
    }
  }, [autosaveKey]);

  const onTitleBlur = useCallback(() => {
    if (slugTouched.current) return;
    const title = getValues('title').trim();
    if (title) {
      setValue('slug', slugify(title), { shouldDirty: true });
    }
  }, [getValues, setValue]);

  const syncSlugFromTitle = useCallback(() => {
    const title = getValues('title').trim();
    const slug = getValues('slug').trim();
    if (!slug && title) {
      return slugify(title);
    }
    return slug;
  }, [getValues]);

  const validateAndGetData = useCallback(
    (intent: SubmitIntent) => {
      clearErrors();
      const data: BlogPostFormInput = {
        ...getValues(),
        slug: syncSlugFromTitle(),
      };
      const result = validateBlogFormForSubmit(
        data,
        intent,
        validationMessages,
      );
      if (!result.success) {
        applyZodErrorsToForm(setError, result.errors);
        scrollToFirstFieldError();
        return null;
      }
      return result.data;
    },
    [clearErrors, getValues, setError, syncSlugFromTitle, validationMessages],
  );

  const setSubmitIntent = useCallback((intent: SubmitIntent) => {
    submitIntentRef.current = intent;
  }, []);

  const getSubmitIntent = useCallback(() => submitIntentRef.current, []);

  const buildFormData = useCallback(
    (
      data: BlogPostFormInput,
      extras: { locale: string; submitIntent: SubmitIntent; postId?: string },
    ) => {
      const fd = new FormData();
      fd.set('locale', extras.locale);
      fd.set('submitIntent', extras.submitIntent);
      fd.set('title', data.title);
      fd.set('slug', data.slug?.trim() || slugify(data.title));
      fd.set('content', data.content);
      fd.set('excerpt', data.excerpt ?? '');
      fd.set('status', data.status);
      fd.set('categoryId', data.categoryId);
      fd.set('coverImage', data.coverImage ?? '');
      fd.set('primaryKeyword', '');
      if (extras.postId) fd.set('id', extras.postId);
      return fd;
    },
    [],
  );

  return {
    form,
    watch,
    setValue,
    setError,
    clearErrors,
    onTitleBlur,
    slugTouched,
    setSubmitIntent,
    getSubmitIntent,
    validateAndGetData,
    clearDraftStorage,
    buildFormData,
  };
}

export type AdminBlogFormFieldErrors = FieldErrors<BlogPostFormInput>;
