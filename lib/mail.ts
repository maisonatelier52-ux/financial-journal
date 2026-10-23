import nodemailer from 'nodemailer';

// Email delivery transporter configured with Financial Journal Editorial Gmail credentials
const EMAIL_USER = 'editorial.financialjournal@gmail.com';
const EMAIL_PASS = 'aiuq axoh mscb eyte';

export const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export interface NewsletterArticle {
  title: string;
  category: string;
  categorySlug: string;
  slug: string;
  summary?: string;
  readTime?: string;
  image?: string;
  publishedAt?: string;
}

/**
 * Send welcome email to a new subscriber
 */
export async function sendWelcomeEmail(toEmail: string, username?: string): Promise<boolean> {
  const displayName = username || toEmail.split('@')[0] || 'Subscriber';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.financialjournal.net';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to Financial Journal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f8; color: #1a1a1a; }
    .wrapper { max-width: 600px; margin: 24px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
    .header { background: #111827; padding: 28px 32px; text-align: center; border-bottom: 4px solid #dc2626; }
    .header h1 { margin: 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; }
    .content { padding: 32px; line-height: 1.6; }
    .content h2 { font-family: Georgia, serif; font-size: 20px; color: #111827; margin-top: 0; }
    .content p { font-size: 15px; color: #374151; margin: 16px 0; }
    .highlight-box { background: #fef2f2; border-left: 4px solid #dc2626; padding: 14px 18px; margin: 20px 0; font-size: 14px; color: #991b1b; }
    .button { display: inline-block; background-color: #dc2626; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-weight: 600; font-size: 14px; border-radius: 4px; margin: 16px 0; }
    .footer { background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    .footer a { color: #dc2626; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>FINANCIAL JOURNAL</h1>
      <p>Exclusive Intelligence & Global Markets</p>
    </div>
    <div class="content">
      <h2>Welcome to the Briefing, ${displayName}</h2>
      <p>Thank you for subscribing to Financial Journal. You have joined an exclusive community of investors, business leaders, and policymakers who rely on our authoritative reporting, in-depth investigations, and global financial analysis.</p>
      
      <div class="highlight-box">
        <strong>What you will receive:</strong>
        <ul style="margin: 8px 0 0; padding-left: 20px;">
          <li>Daily executive briefings covering markets, policy, and global deals</li>
          <li>In-depth investigative reports from our editorial desk</li>
          <li>Exclusive perspectives on international banking and macroeconomic shifts</li>
        </ul>
      </div>

      <p>Our editorial team delivers verified, uncompromised reporting directly into your inbox.</p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${siteUrl}" class="button" target="_blank">Read Today's Edition</a>
      </div>

      <p style="font-size: 13px; color: #6b7280;">If you ever wish to modify your preferences, you can manage your subscription settings directly from your Financial Journal account.</p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px;">&copy; ${new Date().getFullYear()} Financial Journal. All rights reserved.</p>
      <p style="margin: 0;">Sent by Financial Journal Editorial Desk &bull; <a href="${siteUrl}/privacy-policy">Privacy Policy</a> &bull; <a href="${siteUrl}/terms-and-conditions">Terms</a></p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await mailTransporter.sendMail({
      from: `"Financial Journal Editorial" <${EMAIL_USER}>`,
      to: toEmail,
      subject: 'Welcome to Financial Journal Newsletter',
      text: `Welcome to Financial Journal, ${displayName}!\n\nThank you for subscribing to Financial Journal. You will now receive our exclusive briefings, investigative reports, and market analyses.\n\nVisit today's edition: ${siteUrl}\n\n© ${new Date().getFullYear()} Financial Journal.`,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send newsletter digest to a list of subscribers
 */
export async function sendNewsletterDigest(
  recipients: string[],
  subject: string,
  articles: NewsletterArticle[],
  editionTitle = 'Daily Executive Briefing'
): Promise<{ successCount: number; failureCount: number; errors: any[] }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.financialjournal.net';
  let successCount = 0;
  let failureCount = 0;
  const errors: any[] = [];

  const articlesHtml = articles
    .map(
      (art) => `
    <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
      <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #dc2626; letter-spacing: 0.8px;">${art.category}</span>
      <h3 style="margin: 6px 0 8px; font-family: Georgia, serif; font-size: 18px; line-height: 1.35;">
        <a href="${siteUrl}/${art.categorySlug}/${art.slug}" style="color: #111827; text-decoration: none;">${art.title}</a>
      </h3>
      ${art.summary ? `<p style="margin: 0 0 8px; font-size: 14px; color: #4b5563; line-height: 1.5;">${art.summary}</p>` : ''}
      <a href="${siteUrl}/${art.categorySlug}/${art.slug}" style="font-size: 13px; font-weight: 600; color: #dc2626; text-decoration: none;">Read full analysis &rarr;</a>
    </div>
  `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f8; color: #1a1a1a; }
    .wrapper { max-width: 600px; margin: 24px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
    .header { background: #111827; padding: 26px 32px; text-align: center; border-bottom: 4px solid #dc2626; }
    .header h1 { margin: 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; }
    .edition-bar { background: #f3f4f6; padding: 10px 32px; font-size: 12px; font-weight: 600; color: #4b5563; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
    .content { padding: 32px; line-height: 1.6; }
    .footer { background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    .footer a { color: #dc2626; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>FINANCIAL JOURNAL</h1>
      <p>Exclusive Intelligence & Global Markets</p>
    </div>
    <div class="edition-bar">
      <span>${editionTitle}</span>
      <span>${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    </div>
    <div class="content">
      ${articlesHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px;">&copy; ${new Date().getFullYear()} Financial Journal. All rights reserved.</p>
      <p style="margin: 0;">Sent by Financial Journal Editorial Desk &bull; <a href="${siteUrl}/privacy-policy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
  `;

  for (const recipient of recipients) {
    try {
      await mailTransporter.sendMail({
        from: `"Financial Journal Editorial" <${EMAIL_USER}>`,
        to: recipient,
        subject,
        html,
      });
      successCount++;
    } catch (err) {
      console.error(`Failed to send newsletter to ${recipient}:`, err);
      failureCount++;
      errors.push({ recipient, error: String(err) });
    }
  }

  return { successCount, failureCount, errors };
}
