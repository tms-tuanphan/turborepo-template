export type LoginActionState = {
  ok: boolean;
  error?: string;
};

export const initialLoginActionState: LoginActionState = { ok: true };
