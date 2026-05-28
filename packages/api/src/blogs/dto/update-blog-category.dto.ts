import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogCategoryDto {
  @ApiPropertyOptional({ maxLength: 120 })
  displayName?: string;
}
