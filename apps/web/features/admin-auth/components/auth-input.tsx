'use client';

import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AuthInputProps = {
  id: string;
  name: string;
  type?: 'email' | 'password' | 'text';
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  disabled?: boolean;
  error?: string | null;
  autoComplete?: string;
  showPasswordToggle?: boolean;
};

export function AuthInput({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  disabled,
  error,
  autoComplete,
  showPasswordToggle = type === 'password',
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType =
    isPassword && showPasswordToggle
      ? showPassword
        ? 'text'
        : 'password'
      : type;

  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-sm font-medium leading-none" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn('pl-9', showPasswordToggle && 'pr-10')}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {showPasswordToggle ? (
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
