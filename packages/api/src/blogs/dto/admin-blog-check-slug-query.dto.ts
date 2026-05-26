import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminBlogCheckSlugQueryDto {
  @ApiProperty({ description: 'Slug to check for uniqueness' })
  slug!: string;

  @ApiPropertyOptional({
    description: 'Exclude this blog id when checking (update flow)',
  })
  excludeId?: string;
}
