'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';

import type { BlogCategory, BlogPost } from '@/shared/types/blog';
import { slugify } from '@/shared/utils/slugify';

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
  initial?: BlogPost;
  validationMessages: BlogFormValidationMessages;
};

function toFormStatus(
  status: BlogPost['status'] | undefined,
): BlogPostFormInput['status'] {
  return status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
}

function buildDefaultValues(initial?: BlogPost): BlogPostFormInput {
  return {
    title: initial?.title ?? '',
    excerpt: initial?.description ?? '',
    content: initial?.content ?? '',
    status: toFormStatus(initial?.status),
    category: initial?.category ?? 'IT_PARTNERSHIP',
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
  validationMessages,
}: UseAdminBlogFormOptions) {
  const submitIntentRef = useRef<SubmitIntent>('draft');
  const slugTouched = useRef(Boolean(initial?.slug));
  const autosaveKey = storageKey(mode, postId);

  const form = useForm<BlogPostFormInput>({
    defaultValues: buildDefaultValues(initial),
    mode: 'onBlur',
  });

  const { reset, setValue, watch, setError, clearErrors, getValues } = form;

  useEffect(() => {
    if (mode !== 'create' || initial) return;
    try {
      const raw = localStorage.getItem(autosaveKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as BlogPostFormInput;
      reset({ ...buildDefaultValues(), ...parsed });
    } catch {
      /* ignore corrupt draft */
    }
  }, [autosaveKey, initial, mode, reset]);

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
      fd.set('category', data.category ?? 'IT_PARTNERSHIP');
      fd.set('coverImage', data.coverImage ?? '');
      fd.set('tags', '');
      fd.set('scheduledAt', '');
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

export function mapCategory(value: BlogCategory | undefined): BlogCategory {
  return value ?? 'IT_PARTNERSHIP';
}
