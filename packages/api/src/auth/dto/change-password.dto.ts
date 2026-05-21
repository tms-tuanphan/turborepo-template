import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPass123!', format: 'password' })
  currentPassword!: string;

  @ApiProperty({
    example: 'NewSecurePass123!',
    format: 'password',
    minLength: 8,
  })
  newPassword!: string;
}
