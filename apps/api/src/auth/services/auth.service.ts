import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus, type User } from '@repo/database';

import {
  AuthUserDto,
  I18nKey,
  type AuthUserRole,
  type ChangePasswordDto,
  type ChangePasswordResponseDto,
  type LoginDto,
} from '@repo/api';

import { isValidPassword } from '@repo/shared-validation';

import { PrismaService } from '../../prisma/prisma.service';

import type {
  JwtPayload,
  JwtTokenType,
} from '../interfaces/jwt-payload.interface';
import {
  DEFAULT_ACCESS_EXPIRES_IN,
  DEFAULT_REFRESH_EXPIRES_IN,
  getJwtExpiresIn,
  type JwtExpiresIn,
} from '../utils/jwt-expires-in.util';

const userSelect = {
  id: true,
  email: true,
  password: true,
  role: true,
  status: true,
  deletedAt: true,
} as const;

type SafeUser = Pick<User, keyof typeof userSelect>;

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    dto: LoginDto,
  ): Promise<{ user: AuthUserDto; accessToken: string; refreshToken: string }> {
    const email = dto.email.trim().toLowerCase();

    if (!email || !dto.password) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidCredentials);
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });

    if (!user) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidCredentials);
    }

    if (user.deletedAt) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidCredentials);
    }

    if (user.status === UserStatus.disabled) {
      throw new ForbiddenException(I18nKey.Errors.Auth.AccountDisabled);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidCredentials);
    }

    const authUser = this.toAuthUserDto(user);
    const tokens = await this.issueTokenPair(authUser);

    return { user: authUser, ...tokens };
  }

  async refresh(refreshToken: string): Promise<{
    user: AuthUserDto;
    accessToken: string;
    refreshToken: string;
  }> {
    if (!refreshToken?.trim()) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.TokenExpired);
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException(I18nKey.Errors.Auth.TokenExpired);
    }

    if (payload.tokenType !== 'refresh') {
      throw new UnauthorizedException(I18nKey.Errors.Auth.TokenExpired);
    }

    const user = await this.getMe(payload.sub);
    const tokens = await this.issueTokenPair(user);

    return { user, ...tokens };
  }

  private async issueTokenPair(
    user: AuthUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const base: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(
      { ...base, tokenType: 'access' satisfies JwtTokenType },
      { expiresIn: this.getAccessExpiresIn() },
    );

    const refreshToken = await this.jwtService.signAsync(
      { ...base, tokenType: 'refresh' satisfies JwtTokenType },
      { expiresIn: this.getRefreshExpiresIn() },
    );

    return { accessToken, refreshToken };
  }

  private getAccessExpiresIn(): JwtExpiresIn {
    return getJwtExpiresIn(
      this.configService,
      'JWT_ACCESS_EXPIRES_IN',
      DEFAULT_ACCESS_EXPIRES_IN,
    );
  }

  private getRefreshExpiresIn(): JwtExpiresIn {
    return getJwtExpiresIn(
      this.configService,
      'JWT_REFRESH_EXPIRES_IN',
      DEFAULT_REFRESH_EXPIRES_IN,
    );
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    if (!isValidPassword(dto.newPassword)) {
      throw new BadRequestException(I18nKey.Errors.Auth.WeakPassword);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw new UnauthorizedException(I18nKey.Errors.Common.Unauthorized);
    }

    if (user.status === UserStatus.disabled) {
      throw new ForbiddenException(I18nKey.Errors.Auth.AccountDisabled);
    }

    const currentMatches = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!currentMatches) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidCredentials);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    this.logger.log(`Password changed for user ${userId}`);

    return { success: true };
  }

  async getMe(userId: string): Promise<AuthUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        deletedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(I18nKey.Errors.Common.Unauthorized);
    }

    if (user.deletedAt) {
      throw new UnauthorizedException(I18nKey.Errors.Common.Unauthorized);
    }

    if (user.status === UserStatus.disabled) {
      throw new ForbiddenException(I18nKey.Errors.Auth.AccountDisabled);
    }

    return {
      id: user.id,
      email: user.email,
      role: this.mapRole(user.role),
    };
  }

  getAccessCookieName(): string {
    return this.configService.get<string>('AUTH_COOKIE_NAME') ?? 'access_token';
  }

  /** @deprecated Use getAccessCookieName */
  getCookieName(): string {
    return this.getAccessCookieName();
  }

  getRefreshCookieName(): string {
    return (
      this.configService.get<string>('REFRESH_COOKIE_NAME') ?? 'refresh_token'
    );
  }

  getAccessCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax';
    path: string;
    maxAge: number;
  } {
    return {
      ...this.getBaseCookieOptions(),
      maxAge: this.parseExpiresToMs(this.getAccessExpiresIn()),
    };
  }

  getRefreshCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax';
    path: string;
    maxAge: number;
  } {
    return {
      ...this.getBaseCookieOptions(),
      maxAge: this.parseExpiresToMs(this.getRefreshExpiresIn()),
    };
  }

  /** @deprecated Use getAccessCookieOptions */
  getCookieOptions(): ReturnType<AuthService['getAccessCookieOptions']> {
    return this.getAccessCookieOptions();
  }

  getClearCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax';
    path: string;
  } {
    const { httpOnly, secure, sameSite, path } = this.getBaseCookieOptions();
    return { httpOnly, secure, sameSite, path };
  }

  private getBaseCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax';
    path: string;
  } {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    };
  }

  private parseExpiresToMs(expiresIn: JwtExpiresIn): number {
    if (typeof expiresIn === 'number') {
      return expiresIn * 1000;
    }

    const match = /^(\d+)([smhd])$/.exec(expiresIn.trim());
    if (!match) {
      return 15 * 60 * 1000;
    }
    const value = Number.parseInt(match[1] ?? '0', 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * (multipliers[unit ?? 'm'] ?? 60 * 1000);
  }

  private toAuthUserDto(user: SafeUser): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      role: this.mapRole(user.role),
    };
  }

  private mapRole(role: UserRole): AuthUserRole {
    return role === 'sub_admin' ? 'sub_admin' : 'admin';
  }
}
