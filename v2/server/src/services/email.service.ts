import { addEmailJob, EmailJobData } from '@/queues/email.queue';
import { emailVerificationTemplate } from '@/templates/emailVerification.template';
import { authCodeTemplate } from '@/templates/authCode.template';
import { passwordResetTemplate } from '@/templates/passwordReset.template';
import logger from '@/configs/logger.config';

export interface VerificationEmailData {
  to: string;
  firstName: string;
  verificationLink: string;
}

export interface AuthCodeEmailData {
  to: string;
  firstName: string;
  code: string;
}

export interface PasswordResetEmailData {
  to: string;
  firstName: string;
  resetLink: string;
}

export interface CertificateEmailData {
  to: string;
  recipientName: string;
  controlNumber: string;
  date: string;
  verifyLink: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}

export class EmailService {
  private appName: string;
  private appUrl: string;

  constructor() {
    this.appName = process.env.APP_NAME || 'Node App';
    this.appUrl = process.env.APP_URL || 'http://localhost:4000';
  }

  async sendVerificationEmail(data: VerificationEmailData): Promise<void> {
    const html = emailVerificationTemplate({
      firstName: data.firstName,
      verificationLink: data.verificationLink,
      appName: this.appName,
    });

    const jobData: EmailJobData = {
      type: 'verification',
      to: data.to,
      subject: `Verify your email - ${this.appName}`,
      html,
    };

    await addEmailJob(jobData);
    logger.info('Verification email queued', { to: data.to });
  }

  async sendAuthCodeEmail(data: AuthCodeEmailData): Promise<void> {
    const html = authCodeTemplate(data.firstName, data.code, this.appName);

    const jobData: EmailJobData = {
      type: 'auth_code',
      to: data.to,
      subject: `Your verification code - ${this.appName}`,
      html,
    };

    await addEmailJob(jobData);
    logger.info('Auth code email queued', { to: data.to });
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    const html = passwordResetTemplate(data.firstName, data.resetLink, this.appName);

    const jobData: EmailJobData = {
      type: 'verification',
      to: data.to,
      subject: `Reset your password - ${this.appName}`,
      html,
    };

    await addEmailJob(jobData);
    logger.info('Password reset email queued', { to: data.to });
  }

  getVerificationLink(token: string): string {
    return `${this.appUrl}/api/auth/verify-email?token=${token}`;
  }

  getCertificateVerifyLink(controlNumber: string): string {
    return `${this.appUrl}/api/certificates/verify/${controlNumber}`;
  }
}

export const emailService = new EmailService();
export default emailService;
