import type { ApiErrorPayload, LoginResponse } from '@repo/api/client';

const SESSION_LOGIN_PATH = '/api/session/login';
const SESSION_LOGOUT_PATH = '/api/session/logout';

export type SessionLoginInput = {
  email: string;
  password: string;
};

type SessionApiSuccess<T> = { ok: true; data: T };
type SessionApiFailure = { ok: false; error: ApiErrorPayload };
export type SessionApiResult<T> = SessionApiSuccess<T> | SessionApiFailure;

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function parseErrorPayload(response: Response): Promise<ApiErrorPayload> {
  const payload = await parseJsonResponse<ApiErrorPayload>(response);
  if (payload && typeof payload.code === 'string') {
    return payload;
  }

  return {
    code: 'errors.common.internalServerError',
  };
}

/**
 * Admin login via same-origin BFF (httpOnly cookie; no token in response body).
 */
export async function loginAdmin(
  credentials: SessionLoginInput,
): Promise<SessionApiResult<LoginResponse>> {
  const response = await fetch(SESSION_LOGIN_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await parseJsonResponse<LoginResponse>(response);
    if (data?.user) {
      return { ok: true, data };
    }
    return {
      ok: false,
      error: { code: 'errors.common.internalServerError' },
    };
  }

  return { ok: false, error: await parseErrorPayload(response) };
}

/**
 * Admin logout via BFF (clears httpOnly session cookie).
 */
export async function logoutAdmin(): Promise<
  SessionApiResult<{ success: boolean }>
> {
  const response = await fetch(SESSION_LOGOUT_PATH, {
    method: 'POST',
    credentials: 'include',
  });

  if (response.ok) {
    const data = await parseJsonResponse<{ success: boolean }>(response);
    return { ok: true, data: data ?? { success: true } };
  }

  return { ok: false, error: await parseErrorPayload(response) };
}
