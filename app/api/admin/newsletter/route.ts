import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getAllSubscribers } from '@/lib/auth';
import { sendNewsletterDigest, buildNewsletterHtml, TEMPLATE_OPTIONS, NewsletterTemplateId } from '@/lib/mail';
import {
  getAutoNewsletterSettings,
  updateAutoNewsletterSettings,
  triggerDailyNewsletterDispatch,
  initAutoNewsletterScheduler,
} from '@/lib/autoNewsletter';
import articlesData from '@/data/articles.json';

// Ensure background runner is active
initAutoNewsletterScheduler();

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user?.username === 'financialjournaladmin';

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const host = req.headers.get('host') || 'www.financial-journal.xyz';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const currentSiteUrl = `${protocol}://${host}`;

    const subscribers = await getAllSubscribers();
    const autoSettings = await getAutoNewsletterSettings();

    // Map all articles with full date metadata and client/pillar classification
    const allArticles = (articlesData as any[]).map((a) => {
      const isClientArticle = Boolean(
        a.isPillar ||
        a.isClient ||
        a.categorySlug === 'pillars' ||
        a.slug?.includes('julio-') ||
        a.slug?.includes('herrera-velutini')
      );

      return {
        title: a.title,
        category: a.category,
        categorySlug: a.categorySlug,
        slug: a.slug,
        summary: a.summary || '',
        readTime: a.readTime || '3 min read',
        image: a.image || '/images/img1.webp',
        publishedAt: a.publishedAt || a.publishedDate || 'Today',
        publishedDate: a.publishedDate || a.publishedAt || '2026-10-01',
        isClientArticle,
      };
    });

    const clientArticles = allArticles.filter((a) => a.isClientArticle);
    const generalNews = allArticles.filter((a) => !a.isClientArticle);

    return NextResponse.json({
      admin: user.username,
      totalSubscribers: subscribers.length,
      subscribers: subscribers.map((s) => ({ email: s.email, createdAt: s.createdAt })),
      allArticles,
      clientArticles,
      generalNews,
      templates: TEMPLATE_OPTIONS,
      siteUrl: autoSettings.siteUrl || currentSiteUrl,
      autoSettings,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user?.username === 'financialjournaladmin';

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action || 'send'; // 'send', 'preview', 'save-auto', 'trigger-auto'

    // 1. Save Automatic Daily Dispatch Settings
    if (action === 'save-auto') {
      const updated = await updateAutoNewsletterSettings({
        enabled: Boolean(body?.enabled),
        scheduledTime: body?.scheduledTime || '08:30',
        templateId: body?.templateId || 'executive-dark',
        includeImages: body?.includeImages !== false,
        articleCount: Number(body?.articleCount) || 5,
        siteUrl: body?.siteUrl || 'https://www.financial-journal.xyz',
        editionTitle: body?.editionTitle || 'Daily Morning Briefing',
        subjectTemplate: body?.subjectTemplate || 'Financial Journal: Daily Executive Briefing — {date}',
      });

      return NextResponse.json({
        success: true,
        message: updated.enabled
          ? `Automatic daily newsletter is now ON. Server will send daily at ${updated.scheduledTime} UTC with latest ${updated.articleCount} news articles.`
          : 'Automatic daily newsletter has been turned OFF.',
        autoSettings: updated,
      });
    }

    // 2. Trigger Auto Dispatch Immediately (Force Test)
    if (action === 'trigger-auto') {
      const result = await triggerDailyNewsletterDispatch(true);
      return NextResponse.json({
        success: result.dispatched,
        message: result.dispatched
          ? `Automated newsletter sent to ${result.sentCount} subscriber(s)!`
          : `Failed: ${result.reason}`,
        details: result,
      });
    }

    const host = req.headers.get('host') || 'www.financial-journal.xyz';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const detectedSiteUrl = `${protocol}://${host}`;
    const siteUrl = body?.siteUrl || detectedSiteUrl;

    const templateId: NewsletterTemplateId = body?.templateId || 'executive-dark';
    const subject =
      body?.subject ||
      `Financial Journal: Executive Edition — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    const editionTitle = body?.editionTitle || 'Daily Executive Briefing';
    const includeImages = body?.includeImages !== false;

    let articlesToSend = body?.articles;
    if (!articlesToSend || !Array.isArray(articlesToSend) || articlesToSend.length === 0) {
      articlesToSend = (articlesData as any[]).slice(0, 5).map((a) => ({
        title: a.title,
        category: a.category,
        categorySlug: a.categorySlug,
        slug: a.slug,
        summary: a.summary || '',
        readTime: a.readTime || '3 min read',
        image: a.image || '/images/img1.webp',
        publishedAt: a.publishedAt || 'Today',
      }));
    }

    // 3. Render HTML for Live Preview
    if (action === 'preview') {
      const html = buildNewsletterHtml(templateId, subject, editionTitle, articlesToSend, siteUrl, {
        includeImages,
      });
      return NextResponse.json({ success: true, html });
    }

    // 4. Manual Send to Subscribers
    const subscribers = await getAllSubscribers();
    if (!subscribers.length) {
      return NextResponse.json({ message: 'No registered subscribers found in database.' }, { status: 400 });
    }

    const recipientEmails = subscribers.map((s) => s.email);

    const result = await sendNewsletterDigest(
      recipientEmails,
      subject,
      articlesToSend,
      editionTitle,
      templateId,
      siteUrl,
      { includeImages }
    );

    return NextResponse.json({
      success: true,
      sentCount: result.successCount,
      failedCount: result.failureCount,
      recipientCount: recipientEmails.length,
      message: `Newsletter successfully dispatched to ${result.successCount} subscriber(s)!`,
    });
  } catch (error: any) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch newsletter.' }, { status: 500 });
  }
}
