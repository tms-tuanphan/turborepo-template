import { ApiProperty } from '@nestjs/swagger';

/** Pagination metadata returned by list endpoints. */
export class PaginatedListMetaDto {
  @ApiProperty()
  totalItems!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty({ description: '1-based current page (clamped to totalPages)' })
  currentPage!: number;
}
