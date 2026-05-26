import { ApiProperty } from '@nestjs/swagger';

export class BlogCategorySummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'it-partnership' })
  slug!: string;

  @ApiProperty({
    description: 'i18n key for display name in FE messages',
    example: 'blogs.categories.it_partnership',
  })
  nameKey!: string;
}
