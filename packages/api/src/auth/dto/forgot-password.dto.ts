import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'subadmin@example.com', format: 'email' })
  email!: string;
}
