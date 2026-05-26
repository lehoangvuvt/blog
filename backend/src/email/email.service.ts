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

      if (response.error) {
        console.error('Email send failed:', response.error?.message);
        throw new InternalServerErrorException('Failed to send email');
      }

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

    return await this.sendEmail({
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

  async sendNewPostEmail(params: {
    to: string;
    name: string;
    postTitle: string;
    postSubTitle?: string | null;
    thumbnailImage?: string | null;
    postUrl: string;
    authorName: string;
  }) {
    return this.sendEmail({
      to: params.to,
      subject: `New letter: ${params.postTitle}`,
      html: this.baseTemplate(`
      <div
        style="
          max-width: 600px;
          margin: 0 auto;
          background: #0b0f14;
          color: #edf1f7;
          padding: 40px 24px 56px;
        "
      >
        <div
          style="
            font-family: Arial, sans-serif;
            font-size: 12px;
            letter-spacing: 2px;
            color: #667389;
            margin-bottom: 32px;
          "
        >
          THE MIDNIGHT LETTERS
        </div>

        ${
          params.thumbnailImage
            ? `
          <a
            href="${params.postUrl}"
            style="
              display:block;
              overflow:hidden;
              border-radius:20px;
              margin-bottom:28px;
              text-decoration:none;
            "
          >
            <img
              src="${params.thumbnailImage}"
              alt="${params.postTitle}"
              style="
                width:100%;
                display:block;
                object-fit:cover;
                max-height:320px;
              "
            />
          </a>
        `
            : ''
        }

        <p
          style="
            margin:0 0 12px;
            font-family: Arial, sans-serif;
            font-size:14px;
            line-height:1.7;
            color:#8ea0ba;
          "
        >
          ${params.authorName} published a new letter
        </p>

        <h1
          style="
            margin:0;
            font-family: Georgia, serif;
            font-size:38px;
            line-height:1.12;
            font-weight:700;
            letter-spacing:-1.5px;
            color:#edf1f7;
          "
        >
          ${params.postTitle}
        </h1>

        ${
          params.postSubTitle
            ? `
          <p
            style="
              margin:20px 0 0;
              font-family: Arial, sans-serif;
              font-size:17px;
              line-height:1.8;
              color:#a9b4c7;
            "
          >
            ${params.postSubTitle}
          </p>
        `
            : ''
        }

        <div style="margin-top:40px;">
          <a
            href="${params.postUrl}"
            style="
              display:inline-block;
              background:#b7c4d9;
              color:#0b0f14;
              text-decoration:none;
              padding:13px 24px;
              border-radius:999px;
              font-family:Arial,sans-serif;
              font-size:15px;
              font-weight:600;
            "
          >
            Read letter
          </a>
        </div>

        <div
          style="
            margin-top:56px;
            padding-top:24px;
            border-top:1px solid #1d2430;
          "
        >
          <p
            style="
              margin:0;
              font-family:Arial,sans-serif;
              font-size:13px;
              line-height:1.7;
              color:#667389;
            "
          >
            You received this because you enabled email notifications for topics you follow on The Midnight Letters.
          </p>
        </div>
      </div>
    `),
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
    <div
      style="
        max-width: 560px;
        margin: 0 auto;
        padding: 48px 28px;
        background: #0e1313;
        color: #eef3f1;
      "
    >
      <div
        style="
          margin-bottom: 52px;
          font-family: Arial, sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          color: #697b76;
        "
      >
        THE MIDNIGHT LETTERS
      </div>

      <h1
        style="
          margin: 0 0 24px;
          font-family: Arial, sans-serif;
          font-size: 40px;
          line-height: 1.05;
          font-weight: 700;
          letter-spacing: -2px;
          color: #eef3f1;
        "
      >
        Verify your email.
      </h1>

      <p
        style="
          margin: 0 0 40px;
          font-family: Arial, sans-serif;
          font-size: 17px;
          line-height: 1.75;
          color: #a7b7b2;
        "
      >
        Confirm your email address to finish creating your account and start
        writing on The Midnight Letters.
      </p>

      <a
        href="${verifyUrl}"
        style="
          display: inline-block;
          background: #b8d6cb;
          color: #0e1313;
          text-decoration: none;
          padding: 13px 24px;
          border-radius: 999px;
          font-family: Arial, sans-serif;
          font-size: 15px;
          font-weight: 600;
        "
      >
        Continue
      </a>

      <div
        style="
          margin-top: 56px;
          padding-top: 24px;
          border-top: 1px solid #2a3634;
        "
      >
        <p
          style="
            margin: 0;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.7;
            color: #697b76;
          "
        >
          This verification link will expire in 30 minutes.
        </p>
      </div>
    </div>
  `);
  }
  private resetPasswordTemplate(resetUrl: string) {
    return this.baseTemplate(`
    <div
      style="
        max-width: 560px;
        margin: 0 auto;
        padding: 48px 28px;
        background: #0b0f14;
        color: #edf1f7;
      "
    >
      <div
        style="
          margin-bottom: 52px;
          font-family: Arial, sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          color: #667389;
        "
      >
        THE MIDNIGHT LETTERS
      </div>

      <p
        style="
          margin: 0 0 14px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #8ea0ba;
        "
      >
        Password recovery request
      </p>

      <h1
        style="
          margin: 0;
          font-family: Georgia, serif;
          font-size: 42px;
          line-height: 1.08;
          font-weight: 700;
          letter-spacing: -1.8px;
          color: #edf1f7;
        "
      >
        Reset your password.
      </h1>

      <p
        style="
          margin: 24px 0 0;
          font-family: Arial, sans-serif;
          font-size: 17px;
          line-height: 1.85;
          color: #a9b4c7;
        "
      >
        Someone requested a new password for your account.
        If that was you, continue below and choose a new password.
      </p>

      <div style="margin-top: 42px;">
        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            background:#b7c4d9;
            color:#0b0f14;
            text-decoration:none;
            padding:13px 24px;
            border-radius:999px;
            font-family:Arial,sans-serif;
            font-size:15px;
            font-weight:600;
          "
        >
          Reset password
        </a>
      </div>

      <div
        style="
          margin-top: 60px;
          padding-top: 24px;
          border-top: 1px solid #1d2430;
        "
      >
        <p
          style="
            margin: 0 0 14px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.8;
            color: #697b76;
          "
        >
          This reset link will expire in 30 minutes.
        </p>

        <p
          style="
            margin: 0;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.8;
            color: #697b76;
          "
        >
          If you didn’t request this, you can safely ignore this email.
          Your password will remain unchanged.
        </p>
      </div>
    </div>
  `);
  }
}
