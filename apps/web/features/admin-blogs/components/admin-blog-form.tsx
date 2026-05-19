'use client';

import {
  ArrowLeftIcon,
  CheckIcon,
  FileTextIcon,
  SendHorizontalIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';

import type { MDXEditorMethods } from '@mdxeditor/editor';

import {
  createBlogAction,
  initialBlogFormActionState,
  updateBlogAction,
  type BlogFormActionState,
} from '@/app/[locale]/(admin)/admin/(main)/blogs/_actions/blog-actions';
import { Button } from '@/components/ui/button';
import type { BlogPost, BlogStatus } from '@/shared/types/blog';
import type { Locale, Messages } from '@/shared/i18n';
import { slugify } from '@/shared/utils/slugify';

import { AdminBlogAiToolbar } from './admin-blog-ai-toolbar';
import { AdminBlogEditorSidebar } from './admin-blog-editor-sidebar';
import { AdminBlogMarkdownEditor } from './admin-blog-markdown-editor';

function firstFieldError(
  fieldErrors: BlogFormActionState['fieldErrors'],
  key: string,
): string | undefined {
  const arr = fieldErrors?.[key];
  return arr?.[0];
}

type PublishMode = 'now' | 'scheduled';

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  const [content, setContent] = useState(initial?.content ?? '');
  const [excerpt, setExcerpt] = useState(initial?.description ?? '');
  const [category, setCategory] = useState(
    initial?.category ?? 'IT_PARTNERSHIP',
  );
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [workflowStatus, setWorkflowStatus] = useState<BlogStatus>(
    initial?.status ?? 'DRAFT',
  );
  const [publishMode, setPublishMode] = useState<PublishMode>(
    initial?.scheduledAt ? 'scheduled' : 'now',
  );
  const [scheduleDate, setScheduleDate] = useState(
    toDatetimeLocalValue(initial?.scheduledAt),
  );
  const [keyword, setKeyword] = useState(initial?.seo.primaryKeyword ?? '');
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const slugTouched = useRef(Boolean(initial?.slug));
  const skipFirstSaved = useRef(true);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (publishMode === 'scheduled') {
      setWorkflowStatus('SCHEDULED');
    }
  }, [publishMode]);

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

  const aiToolbar = (
    <AdminBlogAiToolbar
      variant="inline"
      title={title}
      content={content}
      editorRef={editorRef}
      onContentChange={setContent}
      labels={t.ai}
    />
  );

  return (
    <form action={action} className="flex min-h-0 flex-1 flex-col">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="status" value={workflowStatus} />
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
      <textarea
        name="excerpt"
        value={excerpt}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="sr-only"
      />

      <div className="mx-auto flex w-full items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
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
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card text-primary"
          aria-hidden
        >
          <FileTextIcon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
            {heroTitle}
          </h1>
          {mode === 'edit' && savedFlash ? (
            <p
              className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"
              role="status"
            >
              <CheckIcon className="size-3.5 shrink-0" aria-hidden />
              {t.saved}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={pending}
            onClick={() => setWorkflowStatus('DRAFT')}
          >
            {pending ? t.saving : tActions.saveDraft}
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={pending}
            className="gap-1.5"
            onClick={() => {
              setPublishMode('now');
              setWorkflowStatus('PUBLISHED');
            }}
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

      <div className="mx-auto grid w-full flex-1 grid-cols-1 gap-6 px-4 py-6 sm:gap-8 sm:px-6 xl:grid-cols-[minmax(0,1fr)_min(100%,360px)] xl:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          {formErrorText ? (
            <p className="text-sm text-destructive" role="alert">
              {formErrorText}
            </p>
          ) : null}

          <AdminBlogMarkdownEditor
            toolbarExtra={aiToolbar}
            editorRef={editorRef}
            title={title}
            onTitleChange={setTitle}
            onTitleBlur={onTitleBlur}
            titleLabel={t.titleLabel}
            titlePlaceholder={t.titlePlaceholder}
            excerptLabel={t.excerptLabel}
            excerptPlaceholder={t.excerptPlaceholder}
            titleInputId="blog-title"
            titleError={firstFieldError(state.fieldErrors, 'title')}
            titleErrorId="err-title"
            excerpt={excerpt}
            onExcerptChange={setExcerpt}
            keyword={keyword}
            seoScoreLabel={t.seoScore}
            value={content}
            onChange={setContent}
            loadingLabel={t.editorLoading}
            stats={{
              wordsLabel: t.stats.words,
              charactersLabel: t.stats.characters,
              readingTimeLabel: t.stats.readingTime,
              headingsLabel: t.stats.headings,
              minutesLabel: t.stats.minutes,
            }}
            editorLabels={{
              titleLabel: t.titleLabel,
              titlePlaceholder: t.titlePlaceholder,
              excerptLabel: t.excerptLabel,
              excerptPlaceholder: t.excerptPlaceholder,
              contentAriaLabel: t.contentLabel,
              emptyTitle: t.editorSurface.emptyTitle,
              emptyHint: t.editorSurface.emptyHint,
              quickHeading: t.editorSurface.quickHeading,
              quickCode: t.editorSurface.quickCode,
              quickImage: t.editorSurface.quickImage,
              quickQuote: t.editorSurface.quickQuote,
              quickTable: t.editorSurface.quickTable,
              slashTip: t.editorSurface.slashTip,
              toolbarBlockquote: t.editorSurface.toolbarBlockquote,
              formatMarkdown: t.editorSurface.formatMarkdown,
              fullscreenEnter: t.editorSurface.fullscreenEnter,
              fullscreenExit: t.editorSurface.fullscreenExit,
            }}
            contentPlaceholder={t.editorSurface.contentPlaceholder}
            aria-label={t.contentLabel}
          />
          {firstFieldError(state.fieldErrors, 'content') ? (
            <p className="text-sm text-destructive" role="alert">
              {firstFieldError(state.fieldErrors, 'content')}
            </p>
          ) : null}
        </div>

        <AdminBlogEditorSidebar
          locale={locale}
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
          excerpt={excerpt}
          tags={tags}
          onTagsChange={setTags}
          status={workflowStatus}
          onStatusChange={setWorkflowStatus}
          publishMode={publishMode}
          onPublishModeChange={setPublishMode}
          scheduleDate={scheduleDate}
          onScheduleDateChange={setScheduleDate}
          keyword={keyword}
          onKeywordChange={setKeyword}
          slugError={firstFieldError(state.fieldErrors, 'slug')}
          coverError={firstFieldError(state.fieldErrors, 'coverImage')}
        />
      </div>
    </form>
  );
}
