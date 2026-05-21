'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';

type AuthErrorAlertProps = {
  message: string | null;
};

export function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <Alert variant="destructive" role="alert">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
