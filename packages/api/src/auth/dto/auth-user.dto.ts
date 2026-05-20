import { ApiProperty } from '@nestjs/swagger';

export type AuthUserRole = 'admin' | 'sub_admin';

export class AuthUserDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ example: 'admin@example.com', format: 'email' })
  email!: string;

  @ApiProperty({ enum: ['admin', 'sub_admin'], example: 'admin' })
  role!: AuthUserRole;
}
