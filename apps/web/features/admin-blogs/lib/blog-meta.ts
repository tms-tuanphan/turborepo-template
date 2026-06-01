/** Plain-text excerpt length cap (list/detail). */
export const DESCRIPTION_MAX = 300;

export const META_TITLE_MAX = 70;
export const META_DESCRIPTION_MAX = 160;

/**
 * Derive a plain-text excerpt from markdown so list/detail pages keep a
 * meaningful description. Picks the first non-heading paragraph and strips
 * markdown syntax. Must stay in sync with server payload in blog-form-mutation.
 */
export function deriveDescription(markdown: string): string {
  const paragraph = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !/^#{1,6}\s+/.test(block));

  if (!paragraph) return '';

  const plain = paragraph
    .replace(/^>\s?/gm, '')
    .replace(/[*_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return '';
  return plain.length > DESCRIPTION_MAX
    ? plain.slice(0, DESCRIPTION_MAX).trimEnd()
    : plain;
}

/** SEO fields as persisted by server actions (preview for admin form). */
export function deriveStoredSeo(
  title: string,
  content: string,
): {
  metaTitle: string;
  metaDescription: string;
  description: string;
} {
  const description = deriveDescription(content);
  return {
    description,
    metaTitle: title.slice(0, META_TITLE_MAX),
    metaDescription: description.slice(0, META_DESCRIPTION_MAX),
  };
}
