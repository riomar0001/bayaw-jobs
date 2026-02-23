import { addEmailJob, EmailJobData } from '@/queues/email.queue';
import { emailVerificationTemplate } from '@/templates/emailVerification.template';
import { authCodeTemplate } from '@/templates/authCode.template';

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
    this.appName = process.env.APP_NAME || 'CertManager';
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
    console.log(`Verification email queued for ${data.to}`);
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
    console.log(`Auth code email queued for ${data.to}`);
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
