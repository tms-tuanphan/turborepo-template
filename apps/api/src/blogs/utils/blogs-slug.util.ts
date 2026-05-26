const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Normalizes a blog slug: trim, lowercase, collapse hyphens.
 */
export function normalizeBlogSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isValidBlogSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 120 && SLUG_REGEX.test(slug);
}
