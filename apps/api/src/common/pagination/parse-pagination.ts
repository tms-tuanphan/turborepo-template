import { BadRequestException } from '@nestjs/common';

import {
  I18nKey,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PAGE_SIZE,
  PAGINATION_MAX_PAGE_SIZE,
  type PaginationQueryDto,
} from '@repo/api';

export type PaginationOptions = {
  defaultPage?: number;
  defaultPageSize?: number;
  maxPageSize?: number;
};

export type ParsedPagination = {
  page: number;
  pageSize: number;
};

export type PaginationSlice = ParsedPagination & {
  skip: number;
  take: number;
  currentPage: number;
  totalPages: number;
};

const DEFAULT_OPTIONS: Required<PaginationOptions> = {
  defaultPage: PAGINATION_DEFAULT_PAGE,
  defaultPageSize: PAGINATION_DEFAULT_PAGE_SIZE,
  maxPageSize: PAGINATION_MAX_PAGE_SIZE,
};

function parsePositiveInt(value: unknown, fallback: number): number {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? Math.floor(n) : Number.NaN;
}

/**
 * Validates and normalizes `page` / `pageSize` from query DTOs.
 * Throws {@link BadRequestException} when out of range.
 */
export function parsePaginationQuery(
  raw: Pick<PaginationQueryDto, 'page' | 'pageSize'>,
  options?: PaginationOptions,
): ParsedPagination {
  const resolved = { ...DEFAULT_OPTIONS, ...options };
  const page = parsePositiveInt(raw.page, resolved.defaultPage);
  const pageSize = parsePositiveInt(raw.pageSize, resolved.defaultPageSize);

  if (
    !Number.isFinite(page) ||
    page < 1 ||
    !Number.isFinite(pageSize) ||
    pageSize < 1 ||
    pageSize > resolved.maxPageSize
  ) {
    throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
  }

  return { page, pageSize };
}

/**
 * Computes Prisma `skip` / `take` and response meta for a list query.
 */
export function resolvePaginationSlice(
  pagination: ParsedPagination,
  totalItems: number,
): PaginationSlice {
  const totalPages = Math.max(1, Math.ceil(totalItems / pagination.pageSize));
  const currentPage = Math.min(pagination.page, totalPages);
  const skip = (currentPage - 1) * pagination.pageSize;

  return {
    ...pagination,
    skip,
    take: pagination.pageSize,
    currentPage,
    totalPages,
  };
}

export type PaginatedListResult<TItem> = {
  items: TItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

/** Builds the standard list response envelope. */
export function buildPaginatedListResult<TItem>(
  items: TItem[],
  slice: PaginationSlice,
  totalItems: number,
): PaginatedListResult<TItem> {
  return {
    items,
    totalItems,
    totalPages: slice.totalPages,
    currentPage: slice.currentPage,
  };
}
