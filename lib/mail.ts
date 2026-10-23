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

export type NewsletterTemplateId = 'executive-dark' | 'classic-editorial' | 'modern-crimson' | 'visual-spotlight';

export const TEMPLATE_OPTIONS: { id: NewsletterTemplateId; name: string; desc: string; badge: string }[] = [
  {
    id: 'executive-dark',
    name: 'Executive Onyx (Dark Header)',
    desc: 'Deep slate-navy header, crisp white container, red accents. Authoritative Wall Street look.',
    badge: 'Flagship',
  },
  {
    id: 'classic-editorial',
    name: 'Classic Editorial (Broadsheet)',
    desc: 'Clean serif broadsheet, warm ivory trim, dual-rule separators, refined newspaper aesthetic.',
    badge: 'Traditional',
  },
  {
    id: 'modern-crimson',
    name: 'Modern Crimson (Breaking News)',
    desc: 'Bold crimson masthead, high-contrast cards, punchy typography for urgent market briefings.',
    badge: 'High Impact',
  },
  {
    id: 'visual-spotlight',
    name: 'Visual Magazine (Image Rich)',
    desc: 'Prominent featured story images below headlines with elegant photo frames.',
    badge: 'Magazine',
  },
];

/**
 * Cleanly format article URL to guarantee exact link resolution
 */
export function getArticleUrl(siteUrl: string, categorySlug: string, slug: string): string {
  const base = siteUrl.replace(/\/+$/, '');
  const cleanCat = (categorySlug || 'business').replace(/^\/+|\/+$/g, '');
  const cleanSlug = (slug || '').replace(/^\/+|\/+$/g, '');
  return `${base}/${cleanCat}/${cleanSlug}`;
}

/**
 * Format image URL to guarantee full absolute URL for email clients
 */
export function getAbsoluteImageUrl(siteUrl: string, imagePath?: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const base = siteUrl.replace(/\/+$/, '');
  const cleanImg = imagePath.replace(/^\/+/, '');
  return `${base}/${cleanImg}`;
}

export interface BuildOptions {
  includeImages?: boolean; // When true, renders images below selected articles
}

/**
 * Generate full HTML for newsletters across desktop and mobile email clients
 */
export function buildNewsletterHtml(
  templateId: NewsletterTemplateId = 'executive-dark',
  subject: string,
  editionTitle: string,
  articles: NewsletterArticle[],
  siteUrl = 'https://www.financial-journal.xyz',
  options: BuildOptions = { includeImages: true }
): string {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const showImages = templateId === 'visual-spotlight' || options.includeImages;

  // 1. Template: Executive Onyx
  if (templateId === 'executive-dark') {
    const articlesMarkup = articles
      .map((art, idx) => {
        const url = getArticleUrl(siteUrl, art.categorySlug, art.slug);
        const isLast = idx === articles.length - 1;
        const imageUrl = getAbsoluteImageUrl(siteUrl, art.image);
        return `
        <tr>
          <td style="padding: ${idx === 0 ? '0 0 24px 0' : '24px 0'}; ${!isLast ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                    ${art.category || 'MARKETS'}
                  </span>
                  <h2 style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; line-height: 1.35; font-weight: 700; color: #111827;">
                    <a href="${url}" target="_blank" style="color: #111827; text-decoration: none;">
                      ${art.title}
                    </a>
                  </h2>
                  ${
                    showImages && imageUrl
                      ? `
                  <div style="margin: 12px 0 14px 0;">
                    <a href="${url}" target="_blank">
                      <img src="${imageUrl}" alt="${art.title}" width="564" style="width: 100%; max-width: 564px; height: auto; max-height: 280px; object-fit: cover; border-radius: 6px; display: block; border: 1px solid #e2e8f0;" />
                    </a>
                  </div>`
                      : ''
                  }
                  ${art.summary ? `<p style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #4b5563;">${art.summary}</p>` : ''}
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right: 16px;">
                        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #9ca3af;">
                          ${art.readTime || '3 min read'}
                        </span>
                      </td>
                      <td>
                        <a href="${url}" target="_blank" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #dc2626; text-decoration: none;">
                          Read full article &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f3f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f3f5; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <!-- Top Accent Bar -->
          <tr>
            <td height="5" style="background-color: #dc2626; line-height: 5px; font-size: 5px;">&nbsp;</td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px 28px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">
                FINANCIAL JOURNAL
              </h1>
              <p style="margin: 8px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">
                Global Markets &bull; Corporate Intelligence &bull; Policy
              </p>
            </td>
          </tr>
          <!-- Sub Bar -->
          <tr>
            <td style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 12px 28px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${editionTitle}
                  </td>
                  <td align="right" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 500; color: #64748b;">
                    ${formattedDate}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content Articles -->
          <tr>
            <td style="padding: 28px 28px 12px 28px; background-color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                ${articlesMarkup}
              </table>
            </td>
          </tr>
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 12px 28px 32px 28px; background-color: #ffffff;">
              <a href="${siteUrl}" target="_blank" style="display: inline-block; background-color: #dc2626; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                Visit Full Edition &rarr;
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 28px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 600; color: #334155;">
                Financial Journal Editorial Desk
              </p>
              <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #64748b; line-height: 1.5;">
                You are receiving this intelligence dispatch because of your subscription to Financial Journal briefings.
              </p>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} Financial Journal. All rights reserved. &bull; <a href="${siteUrl}/privacy-policy" style="color: #dc2626; text-decoration: none;">Privacy Policy</a> &bull; <a href="${siteUrl}/terms-and-conditions" style="color: #dc2626; text-decoration: none;">Terms</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // 2. Template: Classic Broadsheet
  if (templateId === 'classic-editorial') {
    const articlesMarkup = articles
      .map((art, idx) => {
        const url = getArticleUrl(siteUrl, art.categorySlug, art.slug);
        const isLast = idx === articles.length - 1;
        const imageUrl = getAbsoluteImageUrl(siteUrl, art.image);
        return `
        <tr>
          <td style="padding: ${idx === 0 ? '0 0 20px 0' : '20px 0'}; ${!isLast ? 'border-bottom: 2px solid #e5e5e5;' : ''}">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="font-family: Georgia, serif; font-style: italic; font-size: 12px; color: #991b1b; text-transform: uppercase;">
                    ${art.category}
                  </span>
                  <h2 style="margin: 4px 0 8px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 21px; line-height: 1.3; font-weight: 700; color: #1c1917;">
                    <a href="${url}" target="_blank" style="color: #1c1917; text-decoration: none;">
                      ${art.title}
                    </a>
                  </h2>
                  ${
                    showImages && imageUrl
                      ? `
                  <div style="margin: 10px 0 12px 0;">
                    <a href="${url}" target="_blank">
                      <img src="${imageUrl}" alt="${art.title}" width="564" style="width: 100%; max-width: 564px; height: auto; max-height: 280px; object-fit: cover; border: 1px solid #d6d3d1; display: block;" />
                    </a>
                  </div>`
                      : ''
                  }
                  ${art.summary ? `<p style="margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 14.5px; line-height: 1.6; color: #44403c;">${art.summary}</p>` : ''}
                  <a href="${url}" target="_blank" style="font-family: Georgia, serif; font-size: 13px; font-weight: 700; color: #991b1b; text-decoration: underline;">
                    Continue reading article &raquo;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafaf9; font-family: Georgia, 'Times New Roman', serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafaf9; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border: 1px solid #d6d3d1;">
          <!-- Masthead -->
          <tr>
            <td style="padding: 32px 28px 16px 28px; text-align: center; border-bottom: 3px double #1c1917;">
              <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716c;">
                The Independent Financial Daily
              </p>
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 32px; font-weight: 900; color: #1c1917; letter-spacing: -0.5px;">
                THE FINANCIAL JOURNAL
              </h1>
              <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #e7e5e4; display: flex; justify-content: space-between; font-size: 11px; color: #57534e;">
                <span>${editionTitle.toUpperCase()}</span>
                <span>${formattedDate}</span>
              </div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 24px 28px; background-color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                ${articlesMarkup}
              </table>
            </td>
          </tr>
          <!-- Broadsheet Footer -->
          <tr>
            <td style="background-color: #f5f5f4; border-top: 2px solid #1c1917; padding: 20px 28px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #1c1917;">
                Published by Financial Journal Editorial Desk
              </p>
              <p style="margin: 0; font-size: 11px; color: #78716c;">
                <a href="${siteUrl}" style="color: #991b1b; text-decoration: none; font-weight: bold;">financial-journal.xyz</a> &bull; Verified Market Intelligence
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // 3. Template: Visual Magazine (Images prominent)
  if (templateId === 'visual-spotlight') {
    const articlesMarkup = articles
      .map((art, idx) => {
        const url = getArticleUrl(siteUrl, art.categorySlug, art.slug);
        const imageUrl = getAbsoluteImageUrl(siteUrl, art.image);
        return `
        <tr>
          <td style="padding: 16px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                    ${art.category}
                  </span>
                  <h3 style="margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 19px; line-height: 1.35; font-weight: 700; color: #0f172a;">
                    <a href="${url}" target="_blank" style="color: #0f172a; text-decoration: none;">
                      ${art.title}
                    </a>
                  </h3>
                  ${
                    imageUrl
                      ? `
                  <div style="margin: 10px 0 14px 0;">
                    <a href="${url}" target="_blank">
                      <img src="${imageUrl}" alt="${art.title}" width="540" style="width: 100%; max-width: 540px; height: auto; max-height: 290px; object-fit: cover; border-radius: 6px; display: block;" />
                    </a>
                  </div>`
                      : ''
                  }
                  ${art.summary ? `<p style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13.5px; line-height: 1.6; color: #475569;">${art.summary}</p>` : ''}
                  <a href="${url}" target="_blank" style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; color: #ffffff; background-color: #0f172a; text-decoration: none; padding: 7px 16px; border-radius: 4px;">
                    Read Full Story &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td height="14" style="font-size: 14px; line-height: 14px;">&nbsp;</td></tr>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #0f172a; padding: 32px 24px; text-align: center; border-bottom: 4px solid #dc2626;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">
                FINANCIAL JOURNAL
              </h1>
              <p style="margin: 8px 0 0; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">
                Visual Executive Briefing &bull; ${formattedDate}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 20px; background-color: #f8fafc;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                ${articlesMarkup}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 24px; text-align: center; color: #94a3b8; font-size: 11px;">
              <p style="margin: 0 0 6px 0; color: #ffffff; font-weight: 700; font-size: 12px;">Financial Journal Visual Desk</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Financial Journal &bull; <a href="${siteUrl}" style="color: #f87171; text-decoration: none;">Visit Site</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // 4. Template: Modern Crimson (Default fallback)
  const articlesMarkup = articles
    .map((art, idx) => {
      const url = getArticleUrl(siteUrl, art.categorySlug, art.slug);
      const imageUrl = getAbsoluteImageUrl(siteUrl, art.image);
      return `
      <tr>
        <td style="padding: 16px; background-color: #ffffff; border: 1px solid #fee2e2; border-left: 4px solid #dc2626; border-radius: 4px; margin-bottom: 16px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 0.8px;">
                  ${art.category}
                </span>
                <h3 style="margin: 4px 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.35; font-weight: 700; color: #111827;">
                  <a href="${url}" target="_blank" style="color: #111827; text-decoration: none;">
                    ${art.title}
                  </a>
                </h3>
                ${
                  showImages && imageUrl
                    ? `
                <div style="margin: 10px 0 12px 0;">
                  <a href="${url}" target="_blank">
                    <img src="${imageUrl}" alt="${art.title}" width="540" style="width: 100%; max-width: 540px; height: auto; max-height: 280px; object-fit: cover; border-radius: 4px; display: block; border: 1px solid #fecaca;" />
                  </a>
                </div>`
                    : ''
                }
                ${art.summary ? `<p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13.5px; line-height: 1.5; color: #4b5563;">${art.summary}</p>` : ''}
                <a href="${url}" target="_blank" style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; color: #ffffff; background-color: #dc2626; text-decoration: none; padding: 6px 14px; border-radius: 3px;">
                  Read Story &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td height="12" style="font-size: 12px; line-height: 12px;">&nbsp;</td></tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fff5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff5f5; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border: 1px solid #fecaca; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.05);">
          <!-- Crimson Header -->
          <tr>
            <td style="background-color: #b91c1c; padding: 30px 24px; text-align: center;">
              <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">
                FINANCIAL JOURNAL
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 600; color: #fecaca; text-transform: uppercase; letter-spacing: 1.5px;">
                ${editionTitle} &bull; ${formattedDate}
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 24px 20px 12px 20px; background-color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                ${articlesMarkup}
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #fef2f2; border-top: 1px solid #fee2e2; padding: 20px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #991b1b;">
                Financial Journal Executive Desk
              </p>
              <p style="margin: 0; font-size: 11px; color: #7f1d1d;">
                <a href="${siteUrl}" style="color: #b91c1c; text-decoration: none; font-weight: bold;">Visit Website</a> &bull; &copy; ${new Date().getFullYear()} Financial Journal
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send welcome email to a new subscriber
 */
export async function sendWelcomeEmail(toEmail: string, username?: string): Promise<boolean> {
  const displayName = username || toEmail.split('@')[0] || 'Subscriber';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.financial-journal.xyz';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Welcome to Financial Journal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <tr>
            <td height="5" style="background-color: #dc2626;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; letter-spacing: 0.5px;">
                FINANCIAL JOURNAL
              </h1>
              <p style="margin: 6px 0 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">
                Exclusive Intelligence & Global Markets
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px; line-height: 1.6; color: #1e293b;">
              <h2 style="font-family: Georgia, serif; font-size: 20px; color: #0f172a; margin-top: 0;">
                Welcome to the Briefing, ${displayName}
              </h2>
              <p style="font-size: 15px; color: #334155; margin: 16px 0;">
                Thank you for subscribing to Financial Journal. You have joined an exclusive community of investors, business leaders, and policymakers who rely on our authoritative reporting, in-depth investigations, and global financial analysis.
              </p>
              
              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 14px 18px; margin: 20px 0; font-size: 14px; color: #991b1b;">
                <strong>What you will receive:</strong>
                <ul style="margin: 8px 0 0; padding-left: 20px;">
                  <li>Daily executive briefings covering markets, policy, and global deals</li>
                  <li>In-depth investigative reports from our editorial desk</li>
                  <li>Exclusive perspectives on international banking and macroeconomic shifts</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${siteUrl}" target="_blank" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 700; font-size: 14px; border-radius: 4px;">
                  Read Today's Edition &rarr;
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 11px; color: #64748b;">
              <p style="margin: 0 0 6px;">&copy; ${new Date().getFullYear()} Financial Journal. All rights reserved.</p>
              <p style="margin: 0;">Sent by Financial Journal Editorial Desk &bull; <a href="${siteUrl}/privacy-policy" style="color: #dc2626; text-decoration: none;">Privacy Policy</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await mailTransporter.sendMail({
      from: `"Financial Journal Editorial" <${EMAIL_USER}>`,
      to: toEmail,
      subject: 'Welcome to Financial Journal Newsletter',
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send newsletter digest to a list of subscribers using the chosen template
 */
export async function sendNewsletterDigest(
  recipients: string[],
  subject: string,
  articles: NewsletterArticle[],
  editionTitle = 'Daily Executive Briefing',
  templateId: NewsletterTemplateId = 'executive-dark',
  customSiteUrl?: string,
  options: BuildOptions = { includeImages: true }
): Promise<{ successCount: number; failureCount: number; errors: any[] }> {
  const siteUrl = customSiteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.financial-journal.xyz';
  let successCount = 0;
  let failureCount = 0;
  const errors: any[] = [];

  const html = buildNewsletterHtml(templateId, subject, editionTitle, articles, siteUrl, options);

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
