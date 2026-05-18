import { Injectable, InternalServerErrorException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  private get from() {
    return this.configService.get<string>('EMAIL_FROM') ?? '';
  }

  private get appUrl() {
    return this.configService.get<string>('APP_URL') ?? '';
  }

  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      const response = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });

      return response;
    } catch (error) {
      console.error('Email send failed:', error);

      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendWelcomeEmail(to: string, fullName?: string) {
    return this.sendEmail({
      to,
      subject: 'Welcome to Our Platform',
      html: this.welcomeTemplate(fullName),
    });
  }

  async sendVerifyEmail(to: string, token: string) {
    const verifyUrl = `${this.appUrl}/verify-email?token=${token}`;

    return this.sendEmail({
      to,
      subject: 'Verify your email',
      html: this.verifyEmailTemplate(verifyUrl),
    });
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetUrl = `${this.appUrl}/reset-password?token=${token}`;

    return this.sendEmail({
      to,
      subject: 'Reset your password',
      html: this.resetPasswordTemplate(resetUrl),
    });
  }

  private baseTemplate(content: string) {
    return `
      <div
        style="
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          padding: 40px 20px;
        "
      >
        <div
          style="
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 40px;
          "
        >
          ${content}

          <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 13px; color: #666;">
            © Your App. All rights reserved.
          </p>
        </div>
      </div>
    `;
  }

  private welcomeTemplate(fullName?: string) {
    return this.baseTemplate(`
      <h1>Welcome${fullName ? `, ${fullName}` : ''} 👋</h1>

      <p>
        Thanks for joining our platform.
      </p>

      <p>
        We're excited to have you here.
      </p>
    `);
  }

  private verifyEmailTemplate(verifyUrl: string) {
    return this.baseTemplate(`
      <h1>Verify your email</h1>

      <p>
        Please verify your email address by clicking the button below.
      </p>

      <a
        href="${verifyUrl}"
        style="
          display: inline-block;
          margin-top: 20px;
          background: black;
          color: white;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 8px;
        "
      >
        Verify Email
      </a>
    `);
  }

  private resetPasswordTemplate(resetUrl: string) {
    return this.baseTemplate(`
      <h1>Reset your password</h1>

      <p>
        Click the button below to reset your password.
      </p>

      <a
        href="${resetUrl}"
        style="
          display: inline-block;
          margin-top: 20px;
          background: black;
          color: white;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 8px;
        "
      >
        Reset Password
      </a>

      <p style="margin-top: 24px; color: #666;">
        If you didn't request this, you can ignore this email.
      </p>
    `);
  }
}
