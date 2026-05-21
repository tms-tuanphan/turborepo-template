import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'One-time reset token from email link',
    example: 'a1b2c3d4e5f6...',
  })
  token!: string;

  @ApiProperty({
    example: 'NewSecurePass123!',
    format: 'password',
    minLength: 8,
  })
  newPassword!: string;
}
