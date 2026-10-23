import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getAllSubscribers } from '@/lib/auth';
import { sendNewsletterDigest } from '@/lib/mail';
import articlesData from '@/data/articles.json';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user?.username === 'financialjournaladmin';

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const subscribers = await getAllSubscribers();
    // Latest 8 news articles for preview
    const latestArticles = (articlesData as any[]).slice(0, 8).map((a) => ({
      title: a.title,
      category: a.category,
      categorySlug: a.categorySlug,
      slug: a.slug,
      summary: a.summary || '',
      readTime: a.readTime || '3 min read',
      image: a.image || '/images/img1.webp',
      publishedAt: a.publishedAt || 'Today',
    }));

    return NextResponse.json({
      admin: user.username,
      totalSubscribers: subscribers.length,
      subscribers: subscribers.map((s) => ({ email: s.email, createdAt: s.createdAt })),
      latestArticles,
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
    const subscribers = await getAllSubscribers();

    if (!subscribers.length) {
      return NextResponse.json({ message: 'No registered subscribers found to send to.' }, { status: 400 });
    }

    const recipientEmails = subscribers.map((s) => s.email);

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

    const subject = body?.subject || `Financial Journal: Executive Morning Edition — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    const editionTitle = body?.editionTitle || 'Executive Morning Briefing';

    const result = await sendNewsletterDigest(recipientEmails, subject, articlesToSend, editionTitle);

    return NextResponse.json({
      success: true,
      sentCount: result.successCount,
      failedCount: result.failureCount,
      recipientCount: recipientEmails.length,
      message: `Newsletter successfully sent to ${result.successCount} subscriber(s)!`,
    });
  } catch (error: any) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch newsletter.' }, { status: 500 });
  }
}
