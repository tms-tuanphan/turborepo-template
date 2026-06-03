'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Messages } from '@/shared/i18n';
import {
  buildPageRange,
  shouldShowPagination,
} from '@/shared/utils/pagination-range';

import { useAdminBlogFilters } from '../hooks/use-admin-blog-filters';

type AdminBlogsPaginationProps = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  messages: Messages;
};

export function AdminBlogsPagination({
  totalItems,
  totalPages,
  currentPage,
  messages,
}: AdminBlogsPaginationProps) {
  const { setPage } = useAdminBlogFilters();
  const m = messages.blogs.pagination;

  if (!shouldShowPagination(totalItems)) return null;

  const items = buildPageRange(currentPage, totalPages);
  const handleClick = (page: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    setPage(page);
  };

  return (
    <Pagination aria-label={m.ariaLabel}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-label={m.previous}
            aria-disabled={currentPage === 1}
            data-disabled={currentPage === 1 ? 'true' : undefined}
            className={
              currentPage === 1 ? 'pointer-events-none opacity-50' : undefined
            }
            onClick={handleClick(Math.max(1, currentPage - 1))}
          />
        </PaginationItem>

        {items.map((item) =>
          item.type === 'ellipsis' ? (
            <PaginationItem key={`e-${item.key}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item.value}>
              <PaginationLink
                href="#"
                isActive={item.value === currentPage}
                onClick={handleClick(item.value)}
              >
                {item.value}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-label={m.next}
            aria-disabled={currentPage === totalPages}
            data-disabled={currentPage === totalPages ? 'true' : undefined}
            className={
              currentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : undefined
            }
            onClick={handleClick(Math.min(totalPages, currentPage + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
