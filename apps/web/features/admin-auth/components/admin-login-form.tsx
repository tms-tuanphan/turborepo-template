'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Messages } from '@/shared/i18n';

import { loginAdmin } from '../lib/auth-api';
import { mapAuthErrorToMessage } from '../lib/map-auth-error';
import { sanitizeAdminCallbackUrl } from '../lib/sanitize-callback-url';
import { adminLoginSchema } from '../validations/login.schema';

type AdminLoginFormProps = {
  locale: string;
  messages: Messages;
};

export function AdminLoginForm({ locale, messages }: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = messages.admin.login;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const callbackUrl = sanitizeAdminCallbackUrl(
    searchParams.get('callbackUrl'),
    locale,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = adminLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? t.errorInvalid;
      setError(first);
      return;
    }

    setPending(true);
    try {
      const result = await loginAdmin(parsed.data);

      if (!result.ok) {
        setError(mapAuthErrorToMessage(result.error, messages));
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {t.title}
        </CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="admin-email"
            >
              {t.emailLabel}
            </label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'admin-login-error' : undefined}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="admin-password"
            >
              {t.passwordLabel}
            </label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={pending}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'admin-login-error' : undefined}
            />
          </div>
          {error ? (
            <p
              id="admin-login-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? t.submitting : t.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
