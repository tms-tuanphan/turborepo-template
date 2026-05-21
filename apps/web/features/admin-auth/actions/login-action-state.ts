import type { AdminLoginField } from '../validations/login.schema';

export type LoginActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<AdminLoginField, string>>;
};

export const initialLoginActionState: LoginActionState = { ok: true };
