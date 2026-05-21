import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';

import {
  BLOG_CATEGORIES,
  BLOG_FILTER_CATEGORY_ALL,
  BLOG_FILTER_STATUS_ALL,
  BLOG_STATUSES,
} from './blog-list-item.dto';

const CATEGORY_FILTER = [BLOG_FILTER_CATEGORY_ALL, ...BLOG_CATEGORIES] as const;
const STATUS_FILTER = [BLOG_FILTER_STATUS_ALL, ...BLOG_STATUSES] as const;

/** Admin blogs list uses pageSize 9 by default at parse time (FE `BLOGS_PER_PAGE`). */
export const BLOG_LIST_DEFAULT_PAGE_SIZE = 9;

/**
 * Extends {@link PaginationQueryDto}. Swagger shows global defaults;
 * service applies {@link BLOG_LIST_DEFAULT_PAGE_SIZE} via `parsePaginationQuery` options.
 */
export class AdminBlogListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ default: '' })
  search?: string;

  @ApiPropertyOptional({
    enum: CATEGORY_FILTER,
    default: BLOG_FILTER_CATEGORY_ALL,
  })
  category?: (typeof CATEGORY_FILTER)[number];

  @ApiPropertyOptional({
    enum: STATUS_FILTER,
    default: BLOG_FILTER_STATUS_ALL,
  })
  status?: (typeof STATUS_FILTER)[number];
}
