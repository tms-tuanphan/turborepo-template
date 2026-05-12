import {
  BLOGS_PER_PAGE,
  type BlogFilters,
  type BlogPost,
} from '@/shared/types/blog';

export type PaginatedBlogs = {
  items: BlogPost[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export function filterAndPaginateBlogs(
  posts: BlogPost[],
  filters: BlogFilters,
): PaginatedBlogs {
  const search = filters.search.trim().toLowerCase();

  const filtered = posts.filter((post) => {
    const matchesCategory =
      filters.category === 'ALL' || post.category === filters.category;
    if (!matchesCategory) return false;

    const matchesStatus =
      filters.status === 'ALL' || post.status === filters.status;
    if (!matchesStatus) return false;

    if (!search) return true;

    const haystack = [
      post.title,
      post.description,
      post.slug,
      post.author,
      post.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(search);
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / BLOGS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, filters.page), totalPages);
  const start = (currentPage - 1) * BLOGS_PER_PAGE;
  const items = filtered.slice(start, start + BLOGS_PER_PAGE);

  return { items, totalItems, totalPages, currentPage };
}
