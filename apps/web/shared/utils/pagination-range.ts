export type PageItem =
  | { type: 'page'; value: number }
  | { type: 'ellipsis'; key: string };

/** Whether admin list pagination controls should render. */
export function shouldShowPagination(
  totalItems: number,
  totalPages: number,
  currentPage: number,
): boolean {
  return totalItems > 0 && (totalPages > 1 || currentPage > 1);
}

/**
 * Builds a compact pagination range like:
 *   [1] [2] [3] [4] [5] [...] [10]
 *   [1] [...] [4] [5] [6] [...] [10]
 *
 * SIBLINGS = pages on each side of the current page.
 */
export function buildPageRange(
  currentPage: number,
  totalPages: number,
  siblings = 1,
): PageItem[] {
  if (totalPages <= 1) return [{ type: 'page', value: 1 }];

  const totalNumbers = siblings * 2 + 5;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: 'page' as const,
      value: i + 1,
    }));
  }

  const leftSibling = Math.max(currentPage - siblings, 1);
  const rightSibling = Math.min(currentPage + siblings, totalPages);
  const showLeftEllipsis = leftSibling > 3;
  const showRightEllipsis = rightSibling < totalPages - 2;

  const items: PageItem[] = [];

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblings;
    for (let i = 1; i <= leftItemCount; i++) {
      items.push({ type: 'page', value: i });
    }
    items.push({ type: 'ellipsis', key: 'right' });
    items.push({ type: 'page', value: totalPages });
    return items;
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    items.push({ type: 'page', value: 1 });
    items.push({ type: 'ellipsis', key: 'left' });
    const rightItemCount = 3 + 2 * siblings;
    for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
      items.push({ type: 'page', value: i });
    }
    return items;
  }

  items.push({ type: 'page', value: 1 });
  items.push({ type: 'ellipsis', key: 'left' });
  for (let i = leftSibling; i <= rightSibling; i++) {
    items.push({ type: 'page', value: i });
  }
  items.push({ type: 'ellipsis', key: 'right' });
  items.push({ type: 'page', value: totalPages });
  return items;
}
