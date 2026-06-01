import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';

/**
 * Admin blog categories list query.
 *
 * Extends {@link PaginationQueryDto}. Sorting is currently fixed to `displayName ASC`.
 */
export class AdminBlogCategoryListQueryDto extends PaginationQueryDto {}
