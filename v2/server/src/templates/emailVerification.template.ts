export interface EmailVerificationTemplateParams {
  firstName: string;
  verificationLink: string;
  appName: string;
}

export const emailVerificationTemplate = (params: EmailVerificationTemplateParams): string => {
  const { firstName, verificationLink, appName } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #eef2f7;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a2e;">${appName}</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #1a1a2e;">
                Verify Your Email Address
              </h2>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a5568;">
                Hello ${firstName},
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a5568;">
                Thank you for registering with ${appName}. To complete your registration and activate your account, please verify your email address by clicking the button below.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding: 10px 0 30px;">
                    <a href="${verificationLink}"
                       style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 600; color: #ffffff; background-color: #3b82f6; text-decoration: none; border-radius: 8px; transition: background-color 0.3s;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color: #fef3c7; border-radius: 8px; padding: 16px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #92400e;">
                      <strong>Important:</strong> This verification link will expire in 24 hours. If you did not create an account, please ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 12px 12px; border-top: 1px solid #eef2f7;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #718096; text-align: center;">
                Need help? Contact our support team.
              </p>
              <p style="margin: 0; font-size: 12px; color: #a0aec0; text-align: center;">
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
  `.trim();
};

export default emailVerificationTemplate;
