import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

import type {
  PasswordResetMailPayload,
  PasswordResetMailer,
} from './password-reset-mailer.interface';

@Injectable()
export class SmtpPasswordResetMailerService implements PasswordResetMailer {
  private readonly logger = new Logger(SmtpPasswordResetMailerService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(
    payload: PasswordResetMailPayload,
  ): Promise<void> {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') ?? 2525);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const from =
      this.configService.get<string>('SMTP_FROM') ?? 'noreply@example.com';

    if (!host || !port || !user || !pass) {
      this.logger.warn(
        `SMTP not configured; password reset link for ${payload.email}: ${payload.resetUrl}`,
      );
      return;
    }

    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const mail: Mail.Options = {
      from,
      to: payload.email,
      subject: 'Password reset',
      text: `Reset your password using this link (expires soon):\n\n${payload.resetUrl}`,
      html: `<p>Reset your password using this link (expires soon):</p><p><a href="${payload.resetUrl}">${payload.resetUrl}</a></p>`,
    };

    await transport.sendMail(mail);
    this.logger.log(`Password reset email sent to ${payload.email}`);
  }
}
