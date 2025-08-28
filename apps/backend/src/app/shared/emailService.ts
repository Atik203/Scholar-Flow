import nodemailer from 'nodemailer';
import config from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface TokenEmailData {
  email: string;
  name: string;
  token: string;
  type: 'password-reset' | 'email-verification';
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter using Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.emailSender.email,
        pass: config.emailSender.app_pass, // App-specific password
      },
    });
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"ScholarFlow" <${config.emailSender.email}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(data: TokenEmailData): Promise<void> {
    const resetUrl = `${config.reset_pass_link}?token=${data.token}&type=password-reset`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - ScholarFlow</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${data.name},</p>
              <p>We received a request to reset your password for your ScholarFlow account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>This link will expire in 15 minutes for security reasons.</p>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              <p>Best regards,<br>The ScholarFlow Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: data.email,
      subject: 'Password Reset Request - ScholarFlow',
      html,
    });
  }

  /**
   * Send email verification email
   */
  async sendEmailVerificationEmail(data: TokenEmailData): Promise<void> {
    const verifyUrl = `${config.reset_pass_link}?token=${data.token}&type=email-verification`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email - ScholarFlow</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
              <p>Hello ${data.name},</p>
              <p>Welcome to ScholarFlow! Please verify your email address to complete your registration.</p>
              <p>Click the button below to verify your email:</p>
              <a href="${verifyUrl}" class="button">Verify Email</a>
              <p>This link will expire in 15 minutes for security reasons.</p>
              <p>If you didn't create a ScholarFlow account, please ignore this email.</p>
              <p>Best regards,<br>The ScholarFlow Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: data.email,
      subject: 'Verify Your Email - ScholarFlow',
      html,
    });
  }

  /**
   * Convert HTML to plain text for email clients that don't support HTML
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  /**
   * Verify email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
export default emailService;
