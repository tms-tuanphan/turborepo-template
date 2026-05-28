import { ApiProperty } from '@nestjs/swagger';

export class BlogCategorySummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'IT Partnership Insight' })
  displayName!: string;
}
