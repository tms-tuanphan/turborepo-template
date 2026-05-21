export const PASSWORD_RESET_MAILER = Symbol('PASSWORD_RESET_MAILER');

export type PasswordResetMailPayload = {
  email: string;
  resetUrl: string;
};

export interface PasswordResetMailer {
  sendPasswordResetEmail(payload: PasswordResetMailPayload): Promise<void>;
}
