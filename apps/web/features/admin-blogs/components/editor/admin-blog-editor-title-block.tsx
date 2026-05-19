'use client';

const EXCERPT_MAX_LENGTH = 200;

type AdminBlogEditorTitleBlockProps = {
  title: string;
  onTitleChange: (value: string) => void;
  onTitleBlur: () => void;
  titleInputId: string;
  titleLabel: string;
  titlePlaceholder: string;
  titleError?: string;
  titleErrorId?: string;
  excerpt: string;
  onExcerptChange: (value: string) => void;
  excerptLabel: string;
  excerptPlaceholder: string;
};

export function AdminBlogEditorTitleBlock({
  title,
  onTitleChange,
  onTitleBlur,
  titleInputId,
  titleLabel,
  titlePlaceholder,
  titleError,
  titleErrorId,
  excerpt,
  onExcerptChange,
  excerptLabel,
  excerptPlaceholder,
}: AdminBlogEditorTitleBlockProps) {
  return (
    <div className="space-y-4 px-5 pt-5 sm:px-6 sm:pt-6">
      <label htmlFor={titleInputId} className="sr-only">
        {titleLabel}
      </label>
      <input
        id={titleInputId}
        name="title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onBlur={onTitleBlur}
        placeholder={titlePlaceholder}
        aria-invalid={Boolean(titleError)}
        aria-describedby={titleError ? titleErrorId : undefined}
        className="w-full rounded-xl border border-primary/35 bg-background px-4 py-3 text-3xl font-bold tracking-tight text-foreground shadow-none placeholder:text-muted-foreground/60 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      />
      {titleError ? (
        <p id={titleErrorId} className="text-sm text-destructive" role="alert">
          {titleError}
        </p>
      ) : null}
      <div className="space-y-1.5">
        <label htmlFor="blog-excerpt" className="sr-only">
          {excerptLabel}
        </label>
        <textarea
          id="blog-excerpt"
          value={excerpt}
          onChange={(e) =>
            onExcerptChange(e.target.value.slice(0, EXCERPT_MAX_LENGTH))
          }
          placeholder={excerptPlaceholder}
          rows={2}
          className="max-h-24 w-full resize-none rounded-xl border border-primary/20 bg-background px-3 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2"
        />
        <p className="text-end text-xs tabular-nums text-muted-foreground">
          {excerpt.length}/{EXCERPT_MAX_LENGTH}
        </p>
      </div>
    </div>
  );
}
