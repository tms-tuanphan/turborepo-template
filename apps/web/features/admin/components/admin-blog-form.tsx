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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BLOG_CATEGORIES, BLOG_STATUSES } from '@/shared/types/blog';
import type { BlogPost } from '@/shared/types/blog';
import type { Locale, Messages } from '@/shared/i18n';
import { slugify } from '@/shared/utils/slugify';

import { AdminBlogMarkdownEditor } from './admin-blog-markdown-editor';
import { AdminBlogTagsInput } from './admin-blog-tags-input';

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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
  const ts = messages.admin.blogs.status;

  const actionFn = mode === 'create' ? createBlogAction : updateBlogAction;
  const [state, action, pending] = useActionState(
    actionFn,
    initialBlogFormActionState,
  );

  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [content, setContent] = useState(initial?.content ?? '# \n\n');
  const [category, setCategory] = useState(
    initial?.category ?? 'IT_PARTNERSHIP',
  );
  const [status, setStatus] = useState(initial?.status ?? 'DRAFT');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '');
  const [scheduledAt, setScheduledAt] = useState(
    toDatetimeLocalValue(initial?.scheduledAt ?? null),
  );
  const [seoTitle, setSeoTitle] = useState(initial?.seo.metaTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(
    initial?.seo.metaDescription ?? '',
  );

  const slugTouched = useRef(Boolean(initial?.slug));
  const skipFirstSaved = useRef(true);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (status !== 'SCHEDULED') {
      setScheduledAt('');
    }
  }, [status]);

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
    <form action={action} className="flex flex-col gap-8">
      <input type="hidden" name="locale" value={locale} />
      {mode === 'edit' && initial ? (
        <input type="hidden" name="id" value={initial.id} />
      ) : null}
      <input type="hidden" name="tags" value={JSON.stringify(tags)} />
      <textarea
        name="content"
        value={content}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="sr-only"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link href={listHref}>{messages.admin.blogs.actions.cancel}</Link>
        </Button>
        <div className="flex items-center gap-2">
          {savedFlash ? (
            <p
              className="text-sm text-emerald-600 dark:text-emerald-400"
              role="status"
            >
              {t.saved}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? t.saving : messages.admin.blogs.actions.save}
          </Button>
        </div>
      </div>

      {formErrorText ? (
        <p className="text-sm text-destructive" role="alert">
          {formErrorText}
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{t.sectionContent}</h2>
            <p className="text-sm text-muted-foreground">
              {t.sectionContentHint}
            </p>
          </div>

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
              aria-invalid={Boolean(
                firstFieldError(state.fieldErrors, 'title'),
              )}
              aria-describedby={
                firstFieldError(state.fieldErrors, 'title')
                  ? 'err-title'
                  : undefined
              }
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
              <p
                id="err-slug"
                className="text-sm text-destructive"
                role="alert"
              >
                {firstFieldError(state.fieldErrors, 'slug')}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="blog-description" className="text-sm font-medium">
              {t.descriptionLabel}
            </label>
            <textarea
              id="blog-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={Boolean(
                firstFieldError(state.fieldErrors, 'description'),
              )}
              aria-describedby={
                firstFieldError(state.fieldErrors, 'description')
                  ? 'err-description'
                  : undefined
              }
            />
            {firstFieldError(state.fieldErrors, 'description') ? (
              <p
                id="err-description"
                className="text-sm text-destructive"
                role="alert"
              >
                {firstFieldError(state.fieldErrors, 'description')}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">{t.contentLabel}</span>
            <AdminBlogMarkdownEditor
              value={content}
              onChange={setContent}
              loadingLabel={t.editorLoading}
              labels={{
                write: t.editorWrite,
                preview: t.editorPreview,
                split: t.editorSplit,
              }}
              aria-label={t.contentLabel}
            />
            {firstFieldError(state.fieldErrors, 'content') ? (
              <p className="text-sm text-destructive" role="alert">
                {firstFieldError(state.fieldErrors, 'content')}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{t.sectionMetadata}</h2>
            <p className="text-sm text-muted-foreground">
              {t.sectionMetadataHint}
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t.publishSettings}</CardTitle>
              <CardDescription>{t.publishSettingsHint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="category" value={category} />
              <input type="hidden" name="status" value={status} />

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
                <span className="text-sm font-medium">{t.statusLabel}</span>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as typeof status)}
                >
                  <SelectTrigger aria-label={t.statusLabel}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === 'DRAFT'
                          ? ts.draft
                          : s === 'REVIEWING'
                            ? ts.reviewing
                            : s === 'SCHEDULED'
                              ? ts.scheduled
                              : s === 'PUBLISHED'
                                ? ts.published
                                : ts.archived}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="blog-scheduled" className="text-sm font-medium">
                  {t.scheduledAtLabel}
                </label>
                <Input
                  id="blog-scheduled"
                  name="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  readOnly={status !== 'SCHEDULED'}
                  className={status !== 'SCHEDULED' ? 'opacity-60' : undefined}
                  aria-invalid={Boolean(
                    firstFieldError(state.fieldErrors, 'scheduledAt'),
                  )}
                  aria-describedby={
                    firstFieldError(state.fieldErrors, 'scheduledAt')
                      ? 'err-scheduled'
                      : undefined
                  }
                />
                {firstFieldError(state.fieldErrors, 'scheduledAt') ? (
                  <p
                    id="err-scheduled"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {firstFieldError(state.fieldErrors, 'scheduledAt') ===
                    'scheduledRequired'
                      ? t.errors.scheduledRequired
                      : firstFieldError(state.fieldErrors, 'scheduledAt')}
                  </p>
                ) : null}
              </div>

              {initial ? (
                <p className="text-xs text-muted-foreground">
                  {t.created}:{' '}
                  <time dateTime={initial.createdAt}>
                    {new Date(initial.createdAt).toLocaleString()}
                  </time>
                  <br />
                  {t.updated}:{' '}
                  <time dateTime={initial.updatedAt}>
                    {new Date(initial.updatedAt).toLocaleString()}
                  </time>
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t.featuredImageLabel}
              </CardTitle>
              <CardDescription>{t.featuredImageHint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                name="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://"
                aria-invalid={Boolean(
                  firstFieldError(state.fieldErrors, 'coverImage'),
                )}
              />
              {firstFieldError(state.fieldErrors, 'coverImage') ? (
                <p className="text-sm text-destructive" role="alert">
                  {firstFieldError(state.fieldErrors, 'coverImage')}
                </p>
              ) : null}
              {coverImage ? (
                <div className="relative aspect-video w-full max-h-40 overflow-hidden rounded-md border">
                  <Image
                    src={coverImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="320px"
                    unoptimized
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>

          <AdminBlogTagsInput
            value={tags}
            onChange={setTags}
            placeholder={t.tagsPlaceholder}
            label={t.tagsLabel}
            maxTagsMessage={t.tagsMax}
          />
          {firstFieldError(state.fieldErrors, 'tags') ? (
            <p className="text-sm text-destructive" role="alert">
              {firstFieldError(state.fieldErrors, 'tags')}
            </p>
          ) : null}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t.seoSectionTitle}</CardTitle>
              <CardDescription>{t.seoHint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="seo-title" className="text-sm font-medium">
                  {t.seoTitle}
                </label>
                <Input
                  id="seo-title"
                  name="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  maxLength={70}
                  aria-invalid={Boolean(
                    firstFieldError(state.fieldErrors, 'seoTitle'),
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {seoTitle.length}/70
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="seo-desc" className="text-sm font-medium">
                  {t.seoDescription}
                </label>
                <textarea
                  id="seo-desc"
                  name="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={4}
                  maxLength={160}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-invalid={Boolean(
                    firstFieldError(state.fieldErrors, 'seoDescription'),
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {seoDescription.length}/160
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}
