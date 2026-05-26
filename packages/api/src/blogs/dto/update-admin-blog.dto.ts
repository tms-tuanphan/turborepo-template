import { ApiPropertyOptional } from '@nestjs/swagger';

import { BLOG_STATUSES } from './blog-list-item.dto';

export class UpdateAdminBlogDto {
  @ApiPropertyOptional({ maxLength: 200 })
  title?: string;

  @ApiPropertyOptional({ maxLength: 120 })
  slug?: string;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  description?: string;

  @ApiPropertyOptional({ description: 'BlogCategory id' })
  categoryId?: string;

  @ApiPropertyOptional({ enum: BLOG_STATUSES })
  status?: (typeof BLOG_STATUSES)[number];

  @ApiPropertyOptional()
  coverImage?: string;

  @ApiPropertyOptional({ maxLength: 60, nullable: true })
  primaryKeyword?: string | null;
}
