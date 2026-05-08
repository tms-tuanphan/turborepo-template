import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import { I18nKey, type ApiErrorPayload } from '@repo/api';
import { randomUUID } from 'node:crypto';

type RequestLike = {
  headers?: Record<string, unknown>;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader?: (name: string, value: string) => void;
};

function headerToString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }
  return undefined;
}

function isLikelyI18nKey(value: unknown): value is string {
  return typeof value === 'string' && value.includes('.') && value.length >= 3;
}

function defaultCodeForStatus(status: number): string {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return I18nKey.Errors.Common.BadRequest;
    case HttpStatus.UNAUTHORIZED:
      return I18nKey.Errors.Common.Unauthorized;
    case HttpStatus.FORBIDDEN:
      return I18nKey.Errors.Common.Forbidden;
    case HttpStatus.NOT_FOUND:
      return I18nKey.Errors.Common.NotFound;
    case HttpStatus.CONFLICT:
      return I18nKey.Errors.Common.Conflict;
    default:
      return I18nKey.Errors.Common.InternalServerError;
  }
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<RequestLike>();
    const res = ctx.getResponse<ResponseLike>();

    const traceIdHeader =
      headerToString(req?.headers?.['x-request-id']) ??
      headerToString(req?.headers?.['x-correlation-id']);
    const traceId = traceIdHeader ?? randomUUID();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload: ApiErrorPayload = this.toPayload(exception, status, traceId);

    // best-effort: help client correlate logs
    res.setHeader?.('x-request-id', traceId);

    res.status(status).json(payload);
  }

  private toPayload(
    exception: unknown,
    status: number,
    traceId: string,
  ): ApiErrorPayload {
    // Nest HttpException: can be string or object
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message = this.extractMessage(response);

      const code = isLikelyI18nKey(message)
        ? message
        : defaultCodeForStatus(status);

      const details =
        typeof response === 'object' && response !== null
          ? response
          : undefined;

      return {
        code,
        message: isLikelyI18nKey(message) ? undefined : message,
        details,
        traceId,
      };
    }

    // Unknown error
    return {
      code: I18nKey.Errors.Common.InternalServerError,
      traceId,
    };
  }

  private extractMessage(response: unknown): string | undefined {
    if (typeof response === 'string') return response;

    if (typeof response === 'object' && response !== null) {
      const maybe = (response as { message?: unknown }).message;
      if (typeof maybe === 'string') return maybe;
      if (Array.isArray(maybe)) {
        const first = maybe[0];
        return typeof first === 'string' ? first : undefined;
      }
    }

    return undefined;
  }
}
