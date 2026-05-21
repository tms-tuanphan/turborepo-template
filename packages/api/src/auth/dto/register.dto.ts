import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'subadmin@example.com', format: 'email' })
  email!: string;

  @ApiProperty({ example: 'SecurePass123!', format: 'password', minLength: 8 })
  password!: string;
}
