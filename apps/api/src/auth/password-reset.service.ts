import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import {
  ForgotPasswordDto,
  I18nKey,
  ResetPasswordDto,
  type ForgotPasswordResponseDto,
  type ResetPasswordResponseDto,
} from '@repo/api';
import { UserStatus } from '@repo/database';

import { PrismaService } from '../prisma/prisma.service';

import {
  PASSWORD_RESET_MAILER,
  type PasswordResetMailer,
} from './mail/password-reset-mailer.interface';
import { ForgotPasswordRateLimiter } from './utils/forgot-password-rate-limiter';
import { generateResetToken, hashResetToken } from './utils/reset-token.util';

const BCRYPT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 8;

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);
  private readonly rateLimiter = new ForgotPasswordRateLimiter();

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject(PASSWORD_RESET_MAILER)
    private readonly mailer: PasswordResetMailer,
  ) {}

  async forgotPassword(
    dto: ForgotPasswordDto,
    clientIp: string,
  ): Promise<ForgotPasswordResponseDto> {
    const email = dto.email.trim().toLowerCase();

    if (!email) {
      return { success: true };
    }

    if (
      this.rateLimiter.isLimited(`ip:${clientIp}`) ||
      this.rateLimiter.isLimited(`email:${email}`)
    ) {
      throw new HttpException(
        I18nKey.Errors.Auth.RateLimited,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, status: true },
    });

    if (!user || user.status === UserStatus.disabled) {
      return { success: true };
    }

    const plainToken = generateResetToken();
    const tokenHash = hashResetToken(plainToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null },
      });

      await tx.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });
    });

    const resetUrl = this.buildResetUrl(plainToken);

    try {
      await this.mailer.sendPasswordResetEmail({
        email: user.email,
        resetUrl,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email for user ${user.id}`,
        error instanceof Error ? error.stack : undefined,
      );
      await this.prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, tokenHash },
      });
    }

    this.logger.log(`Password reset requested for user ${user.id}`);
    return { success: true };
  }

  async resetPassword(
    dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    const token = dto.token?.trim();
    const newPassword = dto.newPassword;

    if (!token || !this.isPasswordStrongEnough(newPassword)) {
      throw new BadRequestException(I18nKey.Errors.Auth.WeakPassword);
    }

    const tokenHash = hashResetToken(token);
    const now = new Date();

    const resetRecord = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: { id: true, status: true },
        },
      },
    });

    if (
      !resetRecord ||
      resetRecord.usedAt !== null ||
      resetRecord.expiresAt <= now ||
      resetRecord.user.status === UserStatus.disabled
    ) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidResetToken);
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction(async (tx) => {
      const current = await tx.passwordResetToken.findUnique({
        where: { id: resetRecord.id },
      });

      if (
        !current ||
        current.usedAt !== null ||
        current.expiresAt <= new Date()
      ) {
        throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidResetToken);
      }

      await tx.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      });

      await tx.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      });

      await tx.passwordResetToken.deleteMany({
        where: {
          userId: resetRecord.userId,
          usedAt: null,
          id: { not: resetRecord.id },
        },
      });
    });

    this.logger.log(`Password reset completed for user ${resetRecord.userId}`);
    return { success: true };
  }

  private buildResetUrl(plainToken: string): string {
    const appUrl =
      this.configService.get<string>('APP_URL') ?? 'http://localhost:3001';
    const locale = this.configService.get<string>('ADMIN_AUTH_LOCALE') ?? 'vi';
    const base = appUrl.replace(/\/$/, '');
    return `${base}/${locale}/admin/reset-password?token=${encodeURIComponent(plainToken)}`;
  }

  private isPasswordStrongEnough(password: string | undefined): boolean {
    return (
      typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH
    );
  }
}
