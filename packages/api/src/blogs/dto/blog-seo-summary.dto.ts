import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BlogSeoSummaryDto {
  @ApiProperty()
  metaTitle!: string;

  @ApiProperty()
  metaDescription!: string;

  @ApiPropertyOptional()
  primaryKeyword?: string;
}
