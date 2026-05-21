'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  const [showPassword, setShowPassword] = useState(false);
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
      <CardHeader className="space-y-1 text-center">
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
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'admin-login-error' : undefined}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="admin-password"
              >
                {t.passwordLabel}
              </label>
              <a
                href="#"
                className="text-sm text-primary hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                {t.forgotPassword}
              </a>
            </div>
            <div className="relative">
              <Input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
                className="pr-10"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'admin-login-error' : undefined}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={pending}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
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
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t.orDivider}
              </span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <p className="text-center text-sm text-muted-foreground">
          {t.noAccount}{' '}
          <a
            href="#"
            className="text-primary hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            {t.createAccount}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
