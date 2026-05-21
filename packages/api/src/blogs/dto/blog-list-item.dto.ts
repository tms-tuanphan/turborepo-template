import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BlogSeoSummaryDto } from './blog-seo-summary.dto';

export const BLOG_CATEGORIES = ['IT_PARTNERSHIP', 'DAAS', 'AI'] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_STATUSES = [
  'DRAFT',
  'REVIEWING',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
] as const;

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

  @ApiProperty({ enum: BLOG_CATEGORIES })
  category!: BlogCategory;

  @ApiProperty({ type: [String] })
  tags!: string[];

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

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  scheduledAt!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;

  @ApiProperty({ type: () => BlogSeoSummaryDto })
  seo!: BlogSeoSummaryDto;
}
