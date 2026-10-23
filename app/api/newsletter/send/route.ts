import { NextRequest, NextResponse } from 'next/server';
import { getAllSubscribers } from '@/lib/auth';
import { sendNewsletterDigest, mailTransporter } from '@/lib/mail';
import articlesData from '@/data/articles.json';

// Simple API secret guard to protect broadcast endpoint
const BROADCAST_SECRET = process.env.NEWSLETTER_API_SECRET || 'fj-newsletter-dispatch-key-2026';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret') || req.headers.get('x-api-key');
    if (secret !== BROADCAST_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify SMTP connection
    let smtpOk = false;
    try {
      await mailTransporter.verify();
      smtpOk = true;
    } catch (e: any) {
      return NextResponse.json({
        smtp: 'error',
        error: e?.message || String(e),
      }, { status: 500 });
    }

    const subscribers = await getAllSubscribers();
    return NextResponse.json({
      smtp: smtpOk ? 'connected' : 'failed',
      sender: 'editorial.financialjournal@gmail.com',
      totalSubscribers: subscribers.length,
      subscribers: subscribers.map(s => ({ email: s.email, createdAt: s.createdAt })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const secret = body?.secret || req.headers.get('x-api-key');

    if (secret !== BROADCAST_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const subscribers = await getAllSubscribers();
    if (!subscribers.length) {
      return NextResponse.json({ message: 'No active subscribers found in database.' }, { status: 200 });
    }

    const recipientEmails = subscribers.map((s) => s.email);

    // Pick custom articles from body or default to top recent articles
    let articlesToSend = body?.articles;
    if (!articlesToSend || !Array.isArray(articlesToSend) || articlesToSend.length === 0) {
      articlesToSend = (articlesData as any[]).slice(0, 4).map((art) => ({
        title: art.title,
        category: art.category,
        categorySlug: art.categorySlug,
        slug: art.slug,
        summary: art.summary,
        readTime: art.readTime,
        publishedAt: art.publishedAt,
      }));
    }

    const subject = body?.subject || `Financial Journal: Today's Executive Briefing`;
    const editionTitle = body?.editionTitle || 'Daily Executive Briefing';

    const result = await sendNewsletterDigest(recipientEmails, subject, articlesToSend, editionTitle);

    return NextResponse.json({
      success: true,
      message: `Newsletter dispatched to ${result.successCount} subscriber(s).`,
      details: result,
    });
  } catch (error: any) {
    console.error('Newsletter broadcast error:', error);
    return NextResponse.json({ error: error?.message || 'Broadcast failed' }, { status: 500 });
  }
}
