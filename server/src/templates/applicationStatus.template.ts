type ApplicationStatus =
  | 'NEW'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED'
  | 'CANCELLED';

interface StatusConfig {
  subject: string;
  heading: string;
  body: string;
  accentColor: string;
  badge: string;
}

interface CompanyInfo {
  companyName?: string;
  companyWebsite?: string;
  companyEmail?: string;
  companyPhone?: string;
}

const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  NEW: {
    subject: 'Application Received',
    heading: 'Application Received',
    body: 'We have received your application and it is now under review. We will keep you posted as your application progresses.',
    accentColor: '#6366f1',
    badge: 'Received',
  },
  SCREENING: {
    subject: 'Application Under Review',
    heading: 'Your Application Is Being Reviewed',
    body: 'Good news! Your application has moved to the screening stage. Our team is carefully reviewing your profile and qualifications.',
    accentColor: '#f59e0b',
    badge: 'Screening',
  },
  INTERVIEW: {
    subject: "You've Been Selected for an Interview",
    heading: "You've Been Selected for an Interview!",
    body: 'Congratulations! We are impressed with your profile and would like to invite you for an interview. Our team will be in touch with you shortly to arrange the details.',
    accentColor: '#3b82f6',
    badge: 'Interview',
  },
  OFFER: {
    subject: "You've Received a Job Offer",
    heading: "You've Received a Job Offer!",
    body: 'Fantastic news! We are pleased to extend a job offer to you. Our team will be reaching out with the full details of the offer shortly. Please review everything carefully.',
    accentColor: '#8b5cf6',
    badge: 'Offer',
  },
  HIRED: {
    subject: 'Welcome Aboard!',
    heading: 'Welcome to the Team!',
    body: 'Congratulations! We are thrilled to officially welcome you aboard. You have been hired and our team will be in contact with you soon to walk you through the next steps of your onboarding.',
    accentColor: '#10b981',
    badge: 'Hired',
  },
  REJECTED: {
    subject: 'Update on Your Application',
    heading: 'Update on Your Application',
    body: 'Thank you for taking the time to apply and for your interest. After careful consideration, we have decided to move forward with other candidates at this time. We encourage you to apply for future openings that match your skills.',
    accentColor: '#ef4444',
    badge: 'Not Selected',
  },
  CANCELLED: {
    subject: 'Application Cancelled',
    heading: 'Application Cancelled',
    body: 'Your application has been cancelled. If you believe this was a mistake or have any questions, please feel free to reach out to us.',
    accentColor: '#71717a',
    badge: 'Cancelled',
  },
};

export const applicationStatusTemplate = (
  firstName: string,
  jobTitle: string,
  status: ApplicationStatus,
  appName: string,
  company: CompanyInfo = {}
): string => {
  const config = STATUS_CONFIG[status];
  const { companyName, companyWebsite, companyEmail, companyPhone } = company;

  const companyContactRows = [
    companyEmail
      ? `<tr>
          <td style="padding: 4px 0; color: #71717a; font-size: 13px; width: 80px;">Email</td>
          <td style="padding: 4px 0; color: #18181b; font-size: 13px;">
            <a href="mailto:${companyEmail}" style="color: ${config.accentColor}; text-decoration: none;">${companyEmail}</a>
          </td>
        </tr>`
      : '',
    companyPhone
      ? `<tr>
          <td style="padding: 4px 0; color: #71717a; font-size: 13px;">Phone</td>
          <td style="padding: 4px 0; color: #18181b; font-size: 13px;">${companyPhone}</td>
        </tr>`
      : '',
    companyWebsite
      ? `<tr>
          <td style="padding: 4px 0; color: #71717a; font-size: 13px;">Website</td>
          <td style="padding: 4px 0; color: #18181b; font-size: 13px;">
            <a href="${companyWebsite}" style="color: ${config.accentColor}; text-decoration: none;">${companyWebsite}</a>
          </td>
        </tr>`
      : '',
  ]
    .filter(Boolean)
    .join('');

  const companySection =
    companyName
      ? `
          <!-- Company info -->
          <div style="border: 1px solid #e4e4e7; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 10px; color: #18181b; font-size: 14px; font-weight: 700;">${companyName}</p>
            ${
              companyContactRows
                ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">${companyContactRows}</table>`
                : ''
            }
          </div>`
      : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          <!-- Accent bar -->
          <tr>
            <td style="background-color: ${config.accentColor}; height: 4px; border-radius: 8px 8px 0 0;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 16px; text-align: center;">
              <span style="display: inline-block; background-color: ${config.accentColor}1a; color: ${config.accentColor}; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 4px 14px; border-radius: 99px; margin-bottom: 16px;">${config.badge}</span>
              <h1 style="margin: 0; color: #18181b; font-size: 22px; font-weight: 700; line-height: 1.3;">${config.heading}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 8px 40px 32px;">
              <p style="margin: 0 0 20px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <!-- Job + company info card -->
              <div style="background-color: #f4f4f5; border-left: 3px solid ${config.accentColor}; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Position Applied</p>
                <p style="margin: 4px 0 0; color: #18181b; font-size: 15px; font-weight: 600;">${jobTitle}</p>
                ${companyName ? `<p style="margin: 6px 0 0; color: #52525b; font-size: 13px;">${companyName}</p>` : ''}
              </div>

              <p style="margin: 0 0 24px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                ${config.body}
              </p>

              ${companySection}

              <p style="margin: 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                If you have any questions, don't hesitate to get in touch with the hiring team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export type { ApplicationStatus };
