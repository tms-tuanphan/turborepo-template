import { ApiProperty } from '@nestjs/swagger';

export class BlogCategoryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'it-partnership' })
  slug!: string;

  @ApiProperty({ example: 'blogs.categories.it_partnership' })
  nameKey!: string;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}
