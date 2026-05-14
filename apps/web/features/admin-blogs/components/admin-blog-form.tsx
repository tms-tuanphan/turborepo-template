'use client';

import {
  ArrowLeftIcon,
  CheckIcon,
  FileTextIcon,
  SendHorizontalIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';

import {
  createBlogAction,
  initialBlogFormActionState,
  updateBlogAction,
  type BlogFormActionState,
} from '@/app/[locale]/(admin)/admin/(main)/blogs/_actions/blog-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BlogPost } from '@/shared/types/blog';
import type { Locale, Messages } from '@/shared/i18n';
import { slugify } from '@/shared/utils/slugify';

import { AdminBlogAiToolbar } from './admin-blog-ai-toolbar';
import { AdminBlogEditorSidebar } from './admin-blog-editor-sidebar';
import {
  AdminBlogMarkdownEditor,
  type AdminBlogEditorSelection,
} from './admin-blog-markdown-editor';

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
  initial?: BlogPost;
};

export function AdminBlogForm({
  mode,
  locale,
  messages,
  initial,
}: AdminBlogFormProps) {
  const t = messages.admin.blogs.form;
  const tc = messages.blogs.categories;
  const tActions = messages.admin.blogs.actions;
  const tb = messages.admin.blogs;

  const actionFn = mode === 'create' ? createBlogAction : updateBlogAction;
  const [state, action, pending] = useActionState(
    actionFn,
    initialBlogFormActionState,
  );

  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [content, setContent] = useState(initial?.content ?? '# \n\n');
  const [category, setCategory] = useState(
    initial?.category ?? 'IT_PARTNERSHIP',
  );
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '');
  const [selection, setSelection] = useState<AdminBlogEditorSelection | null>(
    null,
  );

  const slugTouched = useRef(Boolean(initial?.slug));
  const skipFirstSaved = useRef(true);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (skipFirstSaved.current) {
      skipFirstSaved.current = false;
      return;
    }
    if (state.ok && mode === 'edit') {
      setSavedFlash(true);
      const timer = window.setTimeout(() => setSavedFlash(false), 2500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [state, mode]);

  function onTitleBlur() {
    if (!slugTouched.current && title.trim()) {
      setSlug(slugify(title));
    }
  }

  function onSlugChange(v: string) {
    slugTouched.current = true;
    setSlug(v);
  }

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

  const heroTitle = mode === 'create' ? tb.newPageTitle : tb.editPageTitle;

  const statusDisplayKey = initial?.status ?? 'DRAFT';

  return (
    <form action={action} className="flex min-h-0 flex-1 flex-col">
      <input type="hidden" name="locale" value={locale} />
      {mode === 'edit' && initial ? (
        <input type="hidden" name="id" value={initial.id} />
      ) : null}
      <input type="hidden" name="category" value={category} />
      <textarea
        name="content"
        value={content}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="sr-only"
      />

      <div className="mx-auto flex w-full items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex gap-4 items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            aria-label={t.backToBlogs}
            asChild
          >
            <Link href={listHref}>
              <ArrowLeftIcon className="size-4" aria-hidden />
              <span className="sr-only">{t.backToBlogs}</span>
            </Link>
          </Button>
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-card text-primary shadow-sm"
            aria-hidden
          >
            <FileTextIcon className="size-6" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {heroTitle}
          </h1>
        </div>
        {mode === 'edit' && savedFlash ? (
          <p
            className="inline-flex min-w-0 items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400"
            role="status"
          >
            <CheckIcon className="size-4 shrink-0" aria-hidden />
            {t.saved}
          </p>
        ) : null}
        <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Button
            type="submit"
            name="status"
            value="DRAFT"
            variant="secondary"
            size="sm"
            disabled={pending}
          >
            {pending ? t.saving : tActions.saveDraft}
          </Button>
          <Button
            type="submit"
            name="status"
            value="PUBLISHED"
            size="sm"
            disabled={pending}
            className="gap-1.5"
          >
            {pending ? (
              t.saving
            ) : (
              <>
                <SendHorizontalIcon className="size-4" aria-hidden />
                {tActions.publishNow}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mx-auto grid w-full flex-1 grid-cols-1 gap-6 px-4 py-6 sm:gap-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          {formErrorText ? (
            <p className="text-sm text-destructive" role="alert">
              {formErrorText}
            </p>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="blog-title" className="sr-only">
              {t.titleLabel}
            </label>
            <Input
              id="blog-title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={onTitleBlur}
              placeholder={t.titlePlaceholder}
              aria-invalid={Boolean(
                firstFieldError(state.fieldErrors, 'title'),
              )}
              aria-describedby={
                firstFieldError(state.fieldErrors, 'title')
                  ? 'err-title'
                  : undefined
              }
              className="h-auto py-2 text-2xl font-semibold placeholder:text-muted-foreground/60 sm:text-3xl"
            />
            {firstFieldError(state.fieldErrors, 'title') ? (
              <p
                id="err-title"
                className="text-sm text-destructive"
                role="alert"
              >
                {firstFieldError(state.fieldErrors, 'title')}
              </p>
            ) : null}
          </div>

          <div className="relative">
            <AdminBlogMarkdownEditor
              value={content}
              onChange={setContent}
              loadingLabel={t.editorLoading}
              chromeTitle={t.editorChromeTitle}
              viewModeTriggerAria={t.viewModeTriggerAria}
              labels={{
                write: t.editorWrite,
                preview: t.editorPreview,
                split: t.editorSplit,
              }}
              stats={{
                wordsLabel: t.stats.words,
                charactersLabel: t.stats.characters,
                readingTimeLabel: t.stats.readingTime,
                headingsLabel: t.stats.headings,
                minutesLabel: t.stats.minutes,
              }}
              onSelectionChange={setSelection}
              aria-label={t.contentLabel}
            />
            <AdminBlogAiToolbar
              title={title}
              content={content}
              selection={selection}
              onContentChange={setContent}
              labels={t.ai}
            />
            {firstFieldError(state.fieldErrors, 'content') ? (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {firstFieldError(state.fieldErrors, 'content')}
              </p>
            ) : null}
          </div>
        </div>

        <AdminBlogEditorSidebar
          messages={t}
          categoryMessages={tc}
          category={category}
          onCategoryChange={setCategory}
          coverImage={coverImage}
          onCoverImageChange={setCoverImage}
          slug={slug}
          onSlugChange={onSlugChange}
          title={title}
          content={content}
          statusLabel={t.sidebar.statusLabel}
          statusDisplayKey={statusDisplayKey}
          slugError={firstFieldError(state.fieldErrors, 'slug')}
          coverError={firstFieldError(state.fieldErrors, 'coverImage')}
        />
      </div>
    </form>
  );
}
