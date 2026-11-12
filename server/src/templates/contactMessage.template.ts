// Every value here is visitor input from a public form, so all of it is escaped.
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactMessageTemplate = (data: ContactMessage, appName: string): string => {
  const message = escapeHtml(data.message).replace(/\r?\n/g, '<br>');
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New contact message</title>
</head>
<body style="margin: 0; padding: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; color: #3f3f46;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px;">
    <h1 style="margin: 0 0 16px; color: #18181b; font-size: 20px;">New message from the ${escapeHtml(appName)} contact form</h1>
    <p style="margin: 0 0 4px;"><strong>From:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
    <div style="padding: 16px; background: #f4f4f5; border-radius: 6px; line-height: 1.6;">${message}</div>
  </div>
</body>
</html>
`;
};
