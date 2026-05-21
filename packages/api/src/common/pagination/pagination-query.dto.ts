import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PAGE_SIZE,
  PAGINATION_MAX_PAGE_SIZE,
} from './pagination.constants';

/**
 * Shared query fields for paginated list endpoints.
 * Extend in module DTOs (e.g. AdminBlogListQueryDto) and add filters.
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    default: PAGINATION_DEFAULT_PAGE,
    minimum: 1,
    description: '1-based page index',
  })
  page?: number;

  @ApiPropertyOptional({
    default: PAGINATION_DEFAULT_PAGE_SIZE,
    minimum: 1,
    maximum: PAGINATION_MAX_PAGE_SIZE,
    description: `Page size (max ${PAGINATION_MAX_PAGE_SIZE})`,
  })
  pageSize?: number;
}
