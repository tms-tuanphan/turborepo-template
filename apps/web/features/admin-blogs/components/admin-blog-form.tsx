'use client';

import type { MDXEditorMethods } from '@mdxeditor/editor';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import type { Locale, Messages } from '@/shared/i18n';

import {
  submitCreateBlogClient,
  submitUpdateBlogClient,
} from '../lib/admin-blogs-client-api';
import type {
  AdminBlogCategoryOption,
  AdminBlogPost,
} from '../types/admin-blog';
import {
  initialBlogFormActionState,
  type BlogFormActionState,
} from '../actions/blog-form-action-state';
import { useAdminBlogForm } from '../hooks/use-admin-blog-form';
import type { SubmitIntent } from '../validations/blog.schema';

import { AdminBlogAiToolbar } from './admin-blog-ai-toolbar';
import { AdminBlogMarkdownEditor } from './admin-blog-markdown-editor';
import { AdminBlogEditorHeader } from './editor/admin-blog-editor-header';
import { AdminBlogEditorLayout } from './editor/admin-blog-editor-layout';
import { AdminBlogMobilePublishBar } from './editor/admin-blog-mobile-publish-bar';
import { AdminBlogSidebar } from './metadata/admin-blog-sidebar';

function firstFieldError(
  fieldErrors: BlogFormActionState['fieldErrors'],
  key: string,
): string | undefined {
  const arr = fieldErrors?.[key];
  return arr?.[0];
}

type AdminBlogFormProps = {
  mode: 'create' | 'edit';
  locale: Locale;
  messages: Messages;
  categories: AdminBlogCategoryOption[];
  initial?: AdminBlogPost;
  postId?: string;
};

export function AdminBlogForm({
  mode,
  locale,
  messages,
  categories,
  initial,
  postId,
}: AdminBlogFormProps) {
  const router = useRouter();
  const t = messages.admin.blogs.form;
  const tActions = messages.admin.blogs.actions;
  const tv = t.validation;

  const [state, setState] = useState(initialBlogFormActionState);
  const [pending, setPending] = useState(false);

  const blogForm = useAdminBlogForm({
    mode,
    postId: initial?.id,
    initial,
    categories,
    validationMessages: {
      titleRequired: tv.titleRequired,
      titleMax: tv.titleMax,
      excerptMax: tv.excerptMax,
      contentRequiredPublish: tv.contentRequiredPublish,
      coverInvalid: tv.coverInvalid,
    },
  });

  const {
    form,
    watch,
    setValue,
    setError,
    onTitleBlur,
    validateAndGetData,
    clearDraftStorage,
    buildFormData,
    setSubmitIntent,
  } = blogForm;

  const { formState } = form;
  const title = watch('title');
  const excerpt = watch('excerpt');
  const content = watch('content');
  const status = watch('status');
  const categoryId = watch('categoryId');
  const coverImage = watch('coverImage');

  const editorRef = useRef<MDXEditorMethods | null>(null);
  const outlineHandlerRef = useRef<(() => void) | null>(null);
  const skipFirstSaved = useRef(true);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (skipFirstSaved.current) {
      skipFirstSaved.current = false;
      return;
    }
    if (state.ok && mode === 'edit') {
      setSavedFlash(true);
      toast.success(t.toast.saveSuccess);
      const timer = window.setTimeout(() => setSavedFlash(false), 2500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [state, mode, t.toast.saveSuccess]);

  useEffect(() => {
    if (state.fieldErrors) {
      for (const [field, messagesArr] of Object.entries(state.fieldErrors)) {
        const msg = messagesArr?.[0];
        if (msg) {
          setError(
            field as
              | 'title'
              | 'content'
              | 'excerpt'
              | 'status'
              | 'categoryId'
              | 'coverImage'
              | 'slug',
            {
              type: 'server',
              message: msg,
            },
          );
        }
      }
    }
  }, [state.fieldErrors, setError]);

  useEffect(() => {
    if (!state.ok && state.formError) {
      const formErrorText =
        state.formError === 'unauthorized'
          ? t.errors.unauthorized
          : state.formError === 'slugTaken'
            ? t.errors.slugTaken
            : state.formError === 'notFound'
              ? t.errors.notFound
              : t.errors.invalid;
      toast.error(formErrorText);
    }
  }, [state, t.errors]);

  const submitWithIntent = useCallback(
    async (intent: SubmitIntent) => {
      setSubmitIntent(intent);
      const data = validateAndGetData(intent);
      if (!data) return;

      const fd = buildFormData(data, {
        locale,
        submitIntent: intent,
        postId: initial?.id ?? postId,
      });

      setPending(true);
      try {
        if (mode === 'create') {
          const result = await submitCreateBlogClient(fd);
          setState(result);
          if (result.ok && result.createdId) {
            clearDraftStorage();
            router.push(`/${locale}/admin/blogs/${result.createdId}/edit`);
            router.refresh();
          }
        } else {
          const id = postId ?? initial?.id;
          if (!id) return;
          const result = await submitUpdateBlogClient(id, fd);
          setState(result);
        }
      } finally {
        setPending(false);
      }
    },
    [
      buildFormData,
      clearDraftStorage,
      initial?.id,
      locale,
      mode,
      postId,
      router,
      setSubmitIntent,
      validateAndGetData,
    ],
  );

  const onSaveDraft = useCallback(() => {
    submitWithIntent(mode === 'create' ? 'draft' : 'save');
  }, [mode, submitWithIntent]);

  const onPublish = useCallback(() => {
    submitWithIntent('publish');
  }, [submitWithIntent]);

  useEffect(() => {
    if (state.ok && mode === 'create') {
      clearDraftStorage();
    }
  }, [state.ok, mode, clearDraftStorage]);

  const formErrorText =
    state.formError === 'unauthorized'
      ? t.errors.unauthorized
      : state.formError === 'slugTaken'
        ? t.errors.slugTaken
        : state.formError === 'notFound'
          ? t.errors.notFound
          : state.formError === 'invalid'
            ? t.errors.invalid
            : undefined;

  const listHref = `/${locale}/admin/blogs`;
  const primarySaveLabel =
    mode === 'create' ? tActions.saveDraft : tActions.save;

  const titleError =
    formState.errors.title?.message ??
    firstFieldError(state.fieldErrors, 'title');
  const contentError =
    formState.errors.content?.message ??
    firstFieldError(state.fieldErrors, 'content');
  const coverError =
    formState.errors.coverImage?.message ??
    firstFieldError(state.fieldErrors, 'coverImage');

  const aiToolbar = (
    <AdminBlogAiToolbar
      variant="compact"
      title={title}
      content={content}
      editorRef={editorRef}
      onContentChange={(next) => {
        setValue('content', next, { shouldDirty: true });
        void form.trigger('content');
      }}
      labels={t.ai}
      onRegisterOutline={(fn) => {
        outlineHandlerRef.current = fn;
      }}
    />
  );

  const displayStatus = status;
  const statusLabel = t.sidebar.statusLabels[displayStatus];

  return (
    <form
      className="flex min-h-0 flex-1 flex-col pb-16 xl:pb-0"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <AdminBlogEditorHeader
        listHref={listHref}
        backLabel={t.backToBlogs}
        status={displayStatus}
        statusLabel={statusLabel}
        saved={mode === 'edit' && savedFlash}
        savedLabel={t.saved}
        saveDraftLabel={primarySaveLabel}
        savingLabel={t.saving}
        publishLabel={tActions.publishNow}
        pending={pending}
        onSaveDraft={onSaveDraft}
        onPublish={onPublish}
      />

      <AdminBlogEditorLayout
        settingsLabel={t.editorSettingsLabel}
        editor={
          <>
            {formErrorText ? (
              <p className="text-sm text-destructive" role="alert">
                {formErrorText}
              </p>
            ) : null}
            <AdminBlogMarkdownEditor
              toolbarExtra={aiToolbar}
              editorRef={editorRef}
              title={title}
              onTitleChange={(v) =>
                setValue('title', v, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onTitleBlur={onTitleBlur}
              titleLabel={t.titleLabel}
              titlePlaceholder={t.titlePlaceholder}
              excerptLabel={t.excerptLabel}
              excerptPlaceholder={t.excerptPlaceholder}
              titleInputId="blog-title"
              titleError={titleError}
              titleErrorId="err-title"
              excerpt={excerpt}
              onExcerptChange={(v) =>
                setValue('excerpt', v.slice(0, 200), { shouldDirty: true })
              }
              value={content}
              onChange={(v) => setValue('content', v, { shouldDirty: true })}
              loadingLabel={t.editorLoading}
              stats={{
                wordsLabel: t.stats.words,
                charactersLabel: t.stats.characters,
                readingTimeLabel: t.stats.readingTime,
                headingsLabel: t.stats.headings,
                minutesLabel: t.stats.minutes,
              }}
              editorLabels={{
                contentAriaLabel: t.contentLabel,
                slashTip: t.editorSurface.slashTip,
                toolbarBlockquote: t.editorSurface.toolbarBlockquote,
                toolbarAriaLabel: t.editorSurface.toolbarAriaLabel,
                fullscreenEnter: t.editorSurface.fullscreenEnter,
                fullscreenExit: t.editorSurface.fullscreenExit,
                quickTitle: t.editorSurface.quickTitle,
                quickSlash: t.editorSurface.quickSlash,
                quickOutline: t.editorSurface.quickOutline,
                quickCode: t.editorSurface.quickCode,
              }}
              contentPlaceholder={t.editorSurface.contentPlaceholder}
              onOutlineRequest={() => outlineHandlerRef.current?.()}
              aria-label={t.contentLabel}
            />
            {contentError ? (
              <p
                id="err-content"
                className="px-4 text-sm text-destructive sm:px-6"
                role="alert"
              >
                {contentError}
              </p>
            ) : null}
          </>
        }
        sidebar={
          <AdminBlogSidebar
            messages={t}
            categories={categories}
            status={status}
            onStatusChange={(v) => setValue('status', v, { shouldDirty: true })}
            categoryId={categoryId}
            onCategoryIdChange={(v) =>
              setValue('categoryId', v, { shouldDirty: true })
            }
            coverImage={coverImage}
            onCoverImageChange={(v) =>
              setValue('coverImage', v, { shouldDirty: true })
            }
            statusError={formState.errors.status?.message}
            categoryError={formState.errors.categoryId?.message}
            coverError={coverError}
          />
        }
        mobilePublishBar={
          <AdminBlogMobilePublishBar
            saveDraftLabel={primarySaveLabel}
            publishLabel={tActions.publishNow}
            savingLabel={t.saving}
            pending={pending}
            onSaveDraft={onSaveDraft}
            onPublish={onPublish}
          />
        }
      />
    </form>
  );
}
