import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorPayloadDto {
  @ApiProperty({
    example: 'errors.auth.invalid_credentials',
    description: 'Stable i18n error code',
  })
  code!: string;

  @ApiPropertyOptional({ example: 'Invalid email or password' })
  message?: string;

  @ApiPropertyOptional({
    example: { email: 'admin@example.com' },
    type: 'object',
    additionalProperties: true,
  })
  params?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Validation or extra error context',
  })
  details?: unknown;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  traceId?: string;
}
