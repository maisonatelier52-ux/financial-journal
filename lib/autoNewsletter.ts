import { getDb } from '@/lib/mongodb';
import { getAllSubscribers } from '@/lib/auth';
import { sendNewsletterDigest, NewsletterTemplateId, NewsletterArticle } from '@/lib/mail';
import articlesData from '@/data/articles.json';

export interface AutoNewsletterSettings {
  enabled: boolean;
  scheduledTime: string; // "09:00" in 24hr format
  timezone: string; // e.g. "UTC" or "America/New_York"
  templateId: NewsletterTemplateId;
  articleCount: number; // default 5
  includeImages: boolean;
  subjectTemplate: string;
  editionTitle: string;
  siteUrl: string;
  lastSentDate?: string; // YYYY-MM-DD
  lastSentAt?: string; // ISO timestamp
  lastSentCount?: number;
}

const SETTINGS_COLLECTION = 'newsletter_settings';
const DEFAULT_SETTINGS_ID = 'auto_newsletter_config';

export const DEFAULT_AUTO_SETTINGS: AutoNewsletterSettings = {
  enabled: false,
  scheduledTime: '08:30',
  timezone: 'UTC',
  templateId: 'executive-dark',
  articleCount: 5,
  includeImages: true,
  subjectTemplate: 'Financial Journal: Daily Executive Briefing — {date}',
  editionTitle: 'Daily Morning Briefing',
  siteUrl: 'https://www.financial-journal.xyz',
};

export async function getAutoNewsletterSettings(): Promise<AutoNewsletterSettings> {
  try {
    const db = await getDb();
    const doc = await db.collection(SETTINGS_COLLECTION).findOne({ _id: DEFAULT_SETTINGS_ID as any });
    if (!doc) {
      return DEFAULT_AUTO_SETTINGS;
    }
    return {
      enabled: !!doc.enabled,
      scheduledTime: doc.scheduledTime || '08:30',
      timezone: doc.timezone || 'UTC',
      templateId: doc.templateId || 'executive-dark',
      articleCount: doc.articleCount || 5,
      includeImages: doc.includeImages !== false,
      subjectTemplate: doc.subjectTemplate || DEFAULT_AUTO_SETTINGS.subjectTemplate,
      editionTitle: doc.editionTitle || DEFAULT_AUTO_SETTINGS.editionTitle,
      siteUrl: doc.siteUrl || DEFAULT_AUTO_SETTINGS.siteUrl,
      lastSentDate: doc.lastSentDate,
      lastSentAt: doc.lastSentAt,
      lastSentCount: doc.lastSentCount,
    };
  } catch (err) {
    console.error('getAutoNewsletterSettings error:', err);
    return DEFAULT_AUTO_SETTINGS;
  }
}

export async function updateAutoNewsletterSettings(
  partial: Partial<AutoNewsletterSettings>
): Promise<AutoNewsletterSettings> {
  try {
    const db = await getDb();
    await db.collection(SETTINGS_COLLECTION).updateOne(
      { _id: DEFAULT_SETTINGS_ID as any },
      { $set: { ...partial, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    return await getAutoNewsletterSettings();
  } catch (err) {
    console.error('updateAutoNewsletterSettings error:', err);
    throw err;
  }
}

/**
 * Executes automatic daily newsletter dispatch.
 * Checks if auto-delivery is turned on and if today's edition was already sent.
 */
export async function triggerDailyNewsletterDispatch(force = false): Promise<{
  dispatched: boolean;
  reason?: string;
  sentCount?: number;
  recipientCount?: number;
}> {
  const settings = await getAutoNewsletterSettings();

  if (!settings.enabled && !force) {
    return { dispatched: false, reason: 'Automatic daily newsletter is currently turned OFF.' };
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  if (!force && settings.lastSentDate === todayStr) {
    return {
      dispatched: false,
      reason: `Today's edition (${todayStr}) has already been sent to subscribers at ${settings.lastSentAt}.`,
    };
  }

  const subscribers = await getAllSubscribers();
  if (!subscribers.length) {
    return { dispatched: false, reason: 'No registered subscribers found in database.' };
  }

  const count = settings.articleCount || 5;
  const articlesToSend: NewsletterArticle[] = (articlesData as any[]).slice(0, count).map((art) => ({
    title: art.title,
    category: art.category,
    categorySlug: art.categorySlug,
    slug: art.slug,
    summary: art.summary || '',
    readTime: art.readTime || '3 min read',
    image: art.image || '/images/img1.webp',
    publishedAt: art.publishedAt || 'Today',
  }));

  const readableDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const subject = (settings.subjectTemplate || 'Financial Journal: Daily Executive Briefing — {date}').replace(
    '{date}',
    readableDate
  );

  const recipientEmails = subscribers.map((s) => s.email);

  const result = await sendNewsletterDigest(
    recipientEmails,
    subject,
    articlesToSend,
    settings.editionTitle || 'Daily Executive Briefing',
    settings.templateId || 'executive-dark',
    settings.siteUrl || 'https://www.financial-journal.xyz',
    { includeImages: settings.includeImages !== false }
  );

  // Record sent execution in MongoDB
  const nowIso = new Date().toISOString();
  await updateAutoNewsletterSettings({
    lastSentDate: todayStr,
    lastSentAt: nowIso,
    lastSentCount: result.successCount,
  });

  return {
    dispatched: true,
    sentCount: result.successCount,
    recipientCount: recipientEmails.length,
  };
}

// Global server background interval guard
declare global {
  // eslint-disable-next-line no-var
  var _autoNewsletterTimerStarted: boolean | undefined;
}

/**
 * Initializes the recurring server-side timer that checks whether the scheduled time
 * has arrived and triggers automatic daily delivery without requiring anyone to be logged in.
 */
export function initAutoNewsletterScheduler() {
  if (global._autoNewsletterTimerStarted) {
    return;
  }
  global._autoNewsletterTimerStarted = true;

  console.log('[Scheduler] Initializing automated daily newsletter runner...');

  // Check every 60 seconds
  setInterval(async () => {
    try {
      const settings = await getAutoNewsletterSettings();
      if (!settings.enabled) return;

      const now = new Date();
      // Form HH:MM in current server/UTC or local time
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;

      // Check if scheduled time matches or has passed for today
      const todayStr = now.toISOString().slice(0, 10);
      if (settings.lastSentDate === todayStr) {
        return; // Already sent today
      }

      // Check if time is due (e.g. at or past scheduledTime)
      if (currentTimeStr >= settings.scheduledTime) {
        console.log(`[Scheduler] Auto newsletter time triggered (${currentTimeStr} >= ${settings.scheduledTime})`);
        await triggerDailyNewsletterDispatch(false);
      }
    } catch (e) {
      console.error('[Scheduler] Error in automated newsletter timer tick:', e);
    }
  }, 60000);
}

// Start scheduler
initAutoNewsletterScheduler();
