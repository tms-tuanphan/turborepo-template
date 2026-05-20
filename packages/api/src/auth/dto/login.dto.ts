import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com', format: 'email' })
  email!: string;

  @ApiProperty({ example: 'change-me', format: 'password', minLength: 8 })
  password!: string;
}
