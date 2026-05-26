import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BlogCategorySummaryDto } from './blog-category-summary.dto';
import { BlogSeoSummaryDto } from './blog-seo-summary.dto';

export const BLOG_STATUSES = ['PUBLISHED', 'UNPUBLISHED'] as const;

export type BlogStatus = (typeof BLOG_STATUSES)[number];

export const BLOG_FILTER_CATEGORY_ALL = 'ALL' as const;
export const BLOG_FILTER_STATUS_ALL = 'ALL' as const;

export class BlogListItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: () => BlogCategorySummaryDto })
  category!: BlogCategorySummaryDto;

  @ApiProperty({ enum: BLOG_STATUSES })
  status!: BlogStatus;

  @ApiProperty()
  coverImage!: string;

  @ApiProperty()
  author!: string;

  @ApiProperty()
  views!: number;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  publishedAt!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;

  @ApiProperty({ type: () => BlogSeoSummaryDto })
  seo!: BlogSeoSummaryDto;
}
