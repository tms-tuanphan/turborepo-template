import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BLOG_STATUSES } from './blog-list-item.dto';

export class CreateAdminBlogDto {
  @ApiProperty({ maxLength: 200 })
  title!: string;

  @ApiProperty({
    description: 'URL slug; lowercase letters, numbers, and hyphens',
    maxLength: 120,
  })
  slug!: string;

  @ApiProperty({ description: 'Full post body (markdown)' })
  content!: string;

  @ApiProperty({
    description: 'Excerpt / summary for listings',
    maxLength: 200,
  })
  description!: string;

  @ApiProperty({ description: 'BlogCategory id' })
  categoryId!: string;

  @ApiProperty({ enum: BLOG_STATUSES })
  status!: (typeof BLOG_STATUSES)[number];

  @ApiProperty()
  coverImage!: string;

  @ApiPropertyOptional({ maxLength: 60 })
  primaryKeyword?: string;
}
