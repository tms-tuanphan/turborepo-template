'use client';

import Image from 'next/image';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BLOG_CATEGORIES } from '@/shared/types/blog';
import type { BlogPost } from '@/shared/types/blog';
import type { Locale, Messages } from '@/shared/i18n';
import { slugify } from '@/shared/utils/slugify';

import { AdminBlogAiToolbar } from './admin-blog-ai-toolbar';
import {
  AdminBlogMarkdownEditor,
  type AdminBlogEditorSelection,
} from './admin-blog-markdown-editor';
import { AdminBlogStats } from './admin-blog-stats';

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

  return (
    <form action={action} className="flex flex-col gap-6">
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

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link href={listHref}>{tActions.cancel}</Link>
        </Button>
        {savedFlash ? (
          <p
            className="text-sm text-emerald-600 dark:text-emerald-400"
            role="status"
          >
            {t.saved}
          </p>
        ) : null}
      </div>

      {formErrorText ? (
        <p className="text-sm text-destructive" role="alert">
          {formErrorText}
        </p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="blog-title" className="text-sm font-medium">
          {t.titleLabel}
        </label>
        <Input
          id="blog-title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={onTitleBlur}
          aria-invalid={Boolean(firstFieldError(state.fieldErrors, 'title'))}
          aria-describedby={
            firstFieldError(state.fieldErrors, 'title')
              ? 'err-title'
              : undefined
          }
        />
        {firstFieldError(state.fieldErrors, 'title') ? (
          <p id="err-title" className="text-sm text-destructive" role="alert">
            {firstFieldError(state.fieldErrors, 'title')}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="blog-slug" className="text-sm font-medium">
          {t.slugLabel}
        </label>
        <Input
          id="blog-slug"
          name="slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          className="font-mono text-sm"
          aria-invalid={Boolean(firstFieldError(state.fieldErrors, 'slug'))}
          aria-describedby={
            firstFieldError(state.fieldErrors, 'slug')
              ? 'err-slug'
              : 'slug-hint'
          }
        />
        <p id="slug-hint" className="text-xs text-muted-foreground">
          {t.slugHint}
        </p>
        {firstFieldError(state.fieldErrors, 'slug') ? (
          <p id="err-slug" className="text-sm text-destructive" role="alert">
            {firstFieldError(state.fieldErrors, 'slug')}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">{t.categoryLabel}</span>
        <Select
          value={category}
          onValueChange={(v) => setCategory(v as typeof category)}
        >
          <SelectTrigger aria-label={t.categoryLabel}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BLOG_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {tc[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="blog-cover" className="text-sm font-medium">
          {t.featuredImageLabel}
        </label>
        <Input
          id="blog-cover"
          name="coverImage"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://"
          aria-invalid={Boolean(
            firstFieldError(state.fieldErrors, 'coverImage'),
          )}
          aria-describedby="cover-hint"
        />
        <p id="cover-hint" className="text-xs text-muted-foreground">
          {t.featuredImageHint}
        </p>
        {firstFieldError(state.fieldErrors, 'coverImage') ? (
          <p className="text-sm text-destructive" role="alert">
            {firstFieldError(state.fieldErrors, 'coverImage')}
          </p>
        ) : null}
        {coverImage ? (
          <div className="relative aspect-video w-full max-h-56 overflow-hidden rounded-md border">
            <Image
              src={coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 768px, 100vw"
              unoptimized
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">{t.contentLabel}</span>
        <AdminBlogAiToolbar
          title={title}
          content={content}
          selection={selection}
          onContentChange={setContent}
          labels={t.ai}
        />
        <AdminBlogMarkdownEditor
          value={content}
          onChange={setContent}
          loadingLabel={t.editorLoading}
          labels={{
            write: t.editorWrite,
            preview: t.editorPreview,
            split: t.editorSplit,
          }}
          onSelectionChange={setSelection}
          aria-label={t.contentLabel}
        />
        <AdminBlogStats
          content={content}
          wordsLabel={t.stats.words}
          readingTimeLabel={t.stats.readingTime}
          headingsLabel={t.stats.headings}
          minutesLabel={t.stats.minutes}
        />
        {firstFieldError(state.fieldErrors, 'content') ? (
          <p className="text-sm text-destructive" role="alert">
            {firstFieldError(state.fieldErrors, 'content')}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
        <Button
          type="submit"
          name="status"
          value="DRAFT"
          variant="secondary"
          disabled={pending}
        >
          {pending ? t.saving : tActions.saveDraft}
        </Button>
        <Button
          type="submit"
          name="status"
          value="PUBLISHED"
          disabled={pending}
        >
          {pending ? t.saving : tActions.publishNow}
        </Button>
      </div>
    </form>
  );
}
