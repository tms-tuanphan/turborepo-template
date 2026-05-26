import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogCategoryDto {
  @ApiProperty({ maxLength: 80 })
  slug!: string;

  @ApiProperty({
    description: 'i18n key for display name',
    example: 'blogs.categories.custom',
  })
  nameKey!: string;

  @ApiPropertyOptional({ default: 0 })
  sortOrder?: number;
}
