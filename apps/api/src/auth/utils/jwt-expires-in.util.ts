import type { ConfigService } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';

export type JwtExpiresIn = NonNullable<JwtSignOptions['expiresIn']>;

export const DEFAULT_ACCESS_EXPIRES_IN = '15m' as JwtExpiresIn;
export const DEFAULT_REFRESH_EXPIRES_IN = '7d' as JwtExpiresIn;

export function getJwtExpiresIn(
  configService: ConfigService,
  key: string,
  fallback: JwtExpiresIn,
): JwtExpiresIn {
  const value = configService.get<string>(key);
  return (value ?? fallback) as JwtExpiresIn;
}
