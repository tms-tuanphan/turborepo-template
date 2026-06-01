import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { SmtpPasswordResetMailerService } from './mail/smtp-password-reset-mailer.service';
import { PASSWORD_RESET_MAILER } from './mail/password-reset-mailer.interface';
import { PasswordResetService } from './services/password-reset.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import {
  DEFAULT_ACCESS_EXPIRES_IN,
  getJwtExpiresIn,
} from './utils/jwt-expires-in.util';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: getJwtExpiresIn(
            configService,
            'JWT_ACCESS_EXPIRES_IN',
            DEFAULT_ACCESS_EXPIRES_IN,
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordResetService,
    SmtpPasswordResetMailerService,
    {
      provide: PASSWORD_RESET_MAILER,
      useExisting: SmtpPasswordResetMailerService,
    },
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
