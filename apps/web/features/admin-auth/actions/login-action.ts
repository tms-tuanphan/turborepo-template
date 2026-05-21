'use server';

import type { ApiErrorPayload, LoginResponse } from '@repo/api/client';
import { redirect } from 'next/navigation';

import { applyUpstreamSetCookies } from '@/core/auth/upstream-set-cookie';
import {
  defaultLocale,
  getMessages,
  isLocale,
  type Locale,
} from '@/shared/i18n';

import { getAuthErrorMessage } from '../utils/auth-error';
import { sanitizeAdminCallbackUrl } from '../lib/sanitize-callback-url';
import {
  createAdminLoginSchema,
  mapAdminLoginZodErrors,
} from '../validations/login.schema';

import type { LoginActionState } from './login-action-state';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

function pickString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function resolveLocale(formData: FormData): Locale {
  const raw = pickString(formData, 'locale');
  return isLocale(raw) ? raw : defaultLocale;
}

async function parseApiErrorPayload(
  response: Response,
): Promise<ApiErrorPayload> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    if (payload && typeof payload.code === 'string') {
      return payload;
    }
  } catch {
    // fall through
  }
  return { code: 'errors.common.internalServerError' };
}

export async function loginAdminAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const locale = resolveLocale(formData);
  const messages = getMessages(locale);
  const t = messages.admin.login;
  const schema = createAdminLoginSchema(t);

  const parsed = schema.safeParse({
    email: pickString(formData, 'email'),
    password: pickString(formData, 'password'),
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: mapAdminLoginZodErrors(parsed.error),
    };
  }

  const callbackUrl = sanitizeAdminCallbackUrl(
    pickString(formData, 'callbackUrl') || null,
    locale,
  );

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });
  } catch {
    return {
      ok: false,
      error: getAuthErrorMessage('network', messages, 'login'),
    };
  }

  if (!response.ok) {
    const payload = await parseApiErrorPayload(response);
    return {
      ok: false,
      error: getAuthErrorMessage(payload, messages, 'login'),
    };
  }

  let loginBody: LoginResponse | null = null;
  try {
    loginBody = (await response.json()) as LoginResponse;
  } catch {
    loginBody = null;
  }

  if (!loginBody?.user?.id) {
    return { ok: false, error: t.errorGeneric };
  }

  await applyUpstreamSetCookies(response);

  redirect(callbackUrl);
}
