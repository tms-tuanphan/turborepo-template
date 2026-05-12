/** URL-safe slug from arbitrary title (ASCII fold + hyphen segments). */
export function slugify(raw: string): string {
  const s = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return s.length > 0 ? s : 'article';
}
