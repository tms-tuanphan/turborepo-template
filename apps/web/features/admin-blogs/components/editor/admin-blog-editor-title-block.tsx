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
    <div className="space-y-3 px-4 pt-4 sm:px-6 sm:pt-5">
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
        className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-0 sm:text-4xl"
      />
      {titleError ? (
        <p id={titleErrorId} className="text-sm text-destructive" role="alert">
          {titleError}
        </p>
      ) : null}
      <div className="space-y-1">
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
          className="border-border/50 bg-muted/30 placeholder:text-muted-foreground focus-visible:ring-ring max-h-24 w-full resize-none rounded-xl border px-3 py-2.5 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />
        <p className="text-end text-xs tabular-nums text-muted-foreground">
          {excerpt.length}/{EXCERPT_MAX_LENGTH}
        </p>
      </div>
    </div>
  );
}
