export { Link } from './links/entities/link.entity';
export { CreateLinkDto } from './links/dto/create-link.dto';
export { UpdateLinkDto } from './links/dto/update-link.dto';

export { LoginDto } from './auth/dto/login.dto';
export { AuthUserDto } from './auth/dto/auth-user.dto';
export type { AuthUserRole } from './auth/dto/auth-user.dto';
export { LoginResponseDto } from './auth/dto/login-response.dto';
export { MeResponseDto } from './auth/dto/me-response.dto';
export { LogoutResponseDto } from './auth/dto/logout-response.dto';

export { ApiErrorPayloadDto } from './common/http/api-error.dto';

export { I18nKey } from './common/i18n/keys';
export type { I18nKeyValue } from './common/i18n/keys';

export type { ApiErrorPayload, ApiErrorDetails } from './common/http/api-error';
