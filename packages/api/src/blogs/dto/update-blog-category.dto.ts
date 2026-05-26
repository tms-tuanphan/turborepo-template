import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogCategoryDto {
  @ApiPropertyOptional({ maxLength: 80 })
  slug?: string;

  @ApiPropertyOptional()
  nameKey?: string;

  @ApiPropertyOptional()
  sortOrder?: number;
}
