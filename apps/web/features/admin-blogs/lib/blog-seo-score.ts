import {
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
  deriveStoredSeo,
} from './blog-meta';

const EXCERPT_IDEAL_MAX = 200;
const KEYWORD_MAX = 60;

export type SeoScoreInput = {
  title: string;
  content: string;
  excerpt: string;
  keyword: string;
};

/**
 * Heuristic SEO score (0–100) from title, excerpt, keyword, and content structure.
 */
export function computeSeoScore({
  title,
  content,
  excerpt,
  keyword,
}: SeoScoreInput): number {
  const { metaTitle, metaDescription } = deriveStoredSeo(title, content);
  let score = 0;

  const titleLen = metaTitle.trim().length;
  if (titleLen >= 30 && titleLen <= META_TITLE_MAX) score += 25;
  else if (titleLen >= 10) score += 12;

  const descLen = (excerpt.trim() || metaDescription).length;
  if (descLen >= 120 && descLen <= META_DESCRIPTION_MAX) score += 25;
  else if (descLen >= 50) score += 12;

  const kw = keyword.trim();
  if (kw.length >= 3 && kw.length <= KEYWORD_MAX) score += 15;

  const headingCount = content
    .split('\n')
    .filter((line) => /^#{1,6}\s+\S+/.test(line)).length;
  if (headingCount >= 2) score += 15;
  else if (headingCount >= 1) score += 8;

  const wordCount = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_\-\n\r]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (wordCount >= 300) score += 20;
  else if (wordCount >= 100) score += 10;

  const excerptLen = excerpt.trim().length;
  if (excerptLen > 0 && excerptLen <= EXCERPT_IDEAL_MAX) score += 0;
  else if (excerptLen > EXCERPT_IDEAL_MAX) score -= 5;

  return Math.min(100, Math.max(0, score));
}

export const EXCERPT_MAX_LENGTH = EXCERPT_IDEAL_MAX;
export const KEYWORD_MAX_LENGTH = KEYWORD_MAX;
