'use client';

type AdminBlogStatsProps = {
  content: string;
  wordsLabel: string;
  charactersLabel: string;
  readingTimeLabel: string;
  headingsLabel: string;
  minutesLabel: string;
};

function stripPlain(markdown: string): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_\-\n\r]+/g, ' ')
    .trim();

  return plain.replace(/\s+/g, ' ').trim();
}

function countWords(markdown: string): number {
  const plain = stripPlain(markdown);
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

function countCharacters(markdown: string): number {
  return stripPlain(markdown).length;
}

function countHeadings(markdown: string): number {
  return markdown.split('\n').filter((line) => /^#{1,6}\s+\S+/.test(line))
    .length;
}

const WORDS_PER_MINUTE = 200;

function StatDot() {
  return (
    <span aria-hidden className="select-none px-1.5 text-muted-foreground/45">
      ·
    </span>
  );
}

export function AdminBlogStats({
  content,
  wordsLabel,
  charactersLabel,
  readingTimeLabel,
  headingsLabel,
  minutesLabel,
}: AdminBlogStatsProps) {
  const words = countWords(content);
  const characters = countCharacters(content);
  const headings = countHeadings(content);
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  return (
    <p className="flex flex-wrap items-center gap-x-0 text-xs text-muted-foreground">
      <span className="tabular-nums text-foreground/85">
        {words.toLocaleString()}
      </span>
      <span className="ps-1">{wordsLabel}</span>
      <StatDot />
      <span className="tabular-nums text-foreground/85">
        {characters.toLocaleString()}
      </span>
      <span className="ps-1">{charactersLabel}</span>
      <StatDot />
      <span>{readingTimeLabel}</span>
      <span className="ps-1 tabular-nums text-foreground/85">{minutes}</span>
      <span className="ps-1">{minutesLabel}</span>
      <StatDot />
      <span>{headingsLabel}</span>
      <span className="ps-1 tabular-nums text-foreground/85">{headings}</span>
    </p>
  );
}
