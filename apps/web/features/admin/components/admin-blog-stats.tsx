'use client';

type AdminBlogStatsProps = {
  content: string;
  wordsLabel: string;
  readingTimeLabel: string;
  headingsLabel: string;
  minutesLabel: string;
};

function countWords(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_\-\n\r]+/g, ' ')
    .trim();

  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

function countHeadings(markdown: string): number {
  return markdown.split('\n').filter((line) => /^#{1,6}\s+\S+/.test(line))
    .length;
}

const WORDS_PER_MINUTE = 200;

export function AdminBlogStats({
  content,
  wordsLabel,
  readingTimeLabel,
  headingsLabel,
  minutesLabel,
}: AdminBlogStatsProps) {
  const words = countWords(content);
  const headings = countHeadings(content);
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  return (
    <dl className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <dt className="font-medium text-foreground/70">{wordsLabel}</dt>
        <dd>{words.toLocaleString()}</dd>
      </div>
      <div className="flex items-center gap-1.5">
        <dt className="font-medium text-foreground/70">{readingTimeLabel}</dt>
        <dd>
          {minutes} {minutesLabel}
        </dd>
      </div>
      <div className="flex items-center gap-1.5">
        <dt className="font-medium text-foreground/70">{headingsLabel}</dt>
        <dd>{headings}</dd>
      </div>
    </dl>
  );
}
