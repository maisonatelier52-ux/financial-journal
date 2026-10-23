'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ArticleItem {
  title: string;
  category: string;
  categorySlug: string;
  slug: string;
  summary: string;
  readTime: string;
  image: string;
  publishedAt: string;
}

interface SubscriberItem {
  email: string;
  createdAt: string;
}

interface TemplateOption {
  id: 'executive-dark' | 'classic-editorial' | 'modern-crimson' | 'visual-spotlight';
  name: string;
  desc: string;
  badge: string;
}

interface AutoSettings {
  enabled: boolean;
  scheduledTime: string;
  timezone: string;
  templateId: 'executive-dark' | 'classic-editorial' | 'modern-crimson' | 'visual-spotlight';
  articleCount: number;
  includeImages: boolean;
  subjectTemplate: string;
  editionTitle: string;
  siteUrl: string;
  lastSentDate?: string;
  lastSentAt?: string;
  lastSentCount?: number;
}

export default function AdminNewsletterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<ArticleItem[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<
    'executive-dark' | 'classic-editorial' | 'modern-crimson' | 'visual-spotlight'
  >('executive-dark');

  // Automatic Settings State
  const [autoSettings, setAutoSettings] = useState<AutoSettings>({
    enabled: false,
    scheduledTime: '08:30',
    timezone: 'UTC',
    templateId: 'executive-dark',
    articleCount: 5,
    includeImages: true,
    subjectTemplate: 'Financial Journal: Daily Executive Briefing — {date}',
    editionTitle: 'Daily Morning Briefing',
    siteUrl: 'https://www.financial-journal.xyz',
  });
  const [savingAuto, setSavingAuto] = useState(false);
  const [autoMessage, setAutoMessage] = useState<string | null>(null);

  // Manual Newsletter parameters
  const [siteUrl, setSiteUrl] = useState('https://www.financial-journal.xyz');
  const [includeImages, setIncludeImages] = useState(true);
  const [subject, setSubject] = useState(
    `Financial Journal: Executive Edition — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  );
  const [editionTitle, setEditionTitle] = useState('Daily Executive Briefing');

  // Preview & Send State
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setAuthorized(true);
          setSubscribers(data.subscribers || []);
          setArticles(data.latestArticles || []);
          setSelectedArticles((data.latestArticles || []).slice(0, 5));
          if (data.templates) setTemplates(data.templates);
          if (data.siteUrl) setSiteUrl(data.siteUrl);
          if (data.autoSettings) {
            setAutoSettings(data.autoSettings);
            if (data.autoSettings.templateId) {
              setSelectedTemplate(data.autoSettings.templateId);
            }
            if (typeof data.autoSettings.includeImages === 'boolean') {
              setIncludeImages(data.autoSettings.includeImages);
            }
          }
        }
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  // Save Automated Daily Dispatch Settings to MongoDB
  const handleSaveAutoSettings = async (overrideEnabled?: boolean) => {
    setSavingAuto(true);
    setAutoMessage(null);

    const isEnabled = typeof overrideEnabled === 'boolean' ? overrideEnabled : autoSettings.enabled;

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-auto',
          enabled: isEnabled,
          scheduledTime: autoSettings.scheduledTime,
          templateId: selectedTemplate,
          includeImages,
          articleCount: autoSettings.articleCount || 5,
          siteUrl,
          editionTitle: autoSettings.editionTitle,
          subjectTemplate: autoSettings.subjectTemplate,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAutoSettings(data.autoSettings);
        setAutoMessage(data.message);
      } else {
        setAutoMessage(data.message || 'Failed to update automated settings.');
      }
    } catch {
      setAutoMessage('Error saving settings.');
    } finally {
      setSavingAuto(false);
    }
  };

  const handleTriggerAutoTest = async () => {
    if (!confirm('Send automated daily newsletter right now to all subscribers?')) return;
    setSavingAuto(true);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger-auto' }),
      });
      const data = await res.json();
      setAutoMessage(data.message);
      // Reload stats
      const refreshed = await fetch('/api/admin/newsletter').then((r) => r.json());
      if (refreshed?.autoSettings) setAutoSettings(refreshed.autoSettings);
    } catch {
      setAutoMessage('Error triggering test dispatch.');
    } finally {
      setSavingAuto(false);
    }
  };

  const handleGeneratePreview = async () => {
    setGenerating(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preview',
          templateId: selectedTemplate,
          subject,
          editionTitle,
          articles: selectedArticles,
          siteUrl,
          includeImages,
        }),
      });

      const data = await res.json();
      if (data.success && data.html) {
        setPreviewHtml(data.html);
        setTimeout(() => {
          document.getElementById('newsletter-preview-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (e) {
      console.error('Failed to generate preview:', e);
    } finally {
      setGenerating(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!subscribers.length) {
      alert('No subscribers in database to send to.');
      return;
    }

    if (!confirm(`Confirm sending this ${selectedTemplate} newsletter to ${subscribers.length} subscriber(s)?`)) {
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          templateId: selectedTemplate,
          subject,
          editionTitle,
          articles: selectedArticles,
          siteUrl,
          includeImages,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSendResult({
          success: true,
          message: data.message || `Newsletter successfully sent to ${data.sentCount} subscriber(s)!`,
        });
      } else {
        setSendResult({
          success: false,
          message: data.error || data.message || 'Failed to dispatch newsletter.',
        });
      }
    } catch (err: any) {
      setSendResult({
        success: false,
        message: err.message || 'Network error occurred while sending.',
      });
    } finally {
      setSending(false);
    }
  };

  const toggleArticleSelection = (art: ArticleItem) => {
    if (selectedArticles.some((a) => a.slug === art.slug)) {
      setSelectedArticles(selectedArticles.filter((a) => a.slug !== art.slug));
    } else {
      setSelectedArticles([...selectedArticles, art]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-gray-600">Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Admin Portal
              </span>
              <span className="text-xs text-gray-400">Newsletter Dispatcher & Style Studio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
              Financial Journal Newsletter Control
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Sender: <span className="font-mono text-red-400">editorial.financialjournal@gmail.com</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-gray-800/80 backdrop-blur px-5 py-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Subscribers</p>
              <p className="text-2xl font-bold text-white font-mono">{subscribers.length}</p>
            </div>
            <div className="h-8 w-[1px] bg-gray-700"></div>
            <Link
              href="/"
              className="text-xs text-gray-300 hover:text-white underline underline-offset-4 transition"
            >
              Back to Site &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ── AUTOMATIC DAILY DELIVERY BANNER & TOGGLE ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-800/40 shadow-lg mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">🤖 Automatic Daily Newsletter Server Service</span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  autoSettings.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-700 text-gray-300'
                }`}
              >
                {autoSettings.enabled ? 'ACTIVE (RUNNING)' : 'INACTIVE (OFF)'}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              When enabled, the Financial Journal server automatically delivers a fresh newsletter with the{' '}
              <strong>latest 5 news articles</strong> (including headlines, images, and links) to all subscribers every day at your chosen time.
            </p>
            {autoSettings.lastSentDate && (
              <p className="text-[11px] text-slate-400 font-mono">
                Last auto-sent on: {autoSettings.lastSentDate} ({autoSettings.lastSentCount || 0} emails dispatched)
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Scheduled Time Input */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <label className="text-xs text-slate-300 font-semibold">Daily Send Time (UTC):</label>
              <input
                type="time"
                value={autoSettings.scheduledTime}
                onChange={(e) => setAutoSettings({ ...autoSettings, scheduledTime: e.target.value })}
                className="bg-transparent text-white font-mono text-sm border-0 focus:outline-none"
              />
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => handleSaveAutoSettings(!autoSettings.enabled)}
              disabled={savingAuto}
              className={`font-bold text-xs py-2 px-5 rounded-lg shadow transition cursor-pointer flex items-center gap-2 ${
                autoSettings.enabled
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {autoSettings.enabled ? 'Turn OFF Auto Delivery' : 'Turn ON Auto Delivery'}
            </button>

            {/* Manual Trigger Test Button */}
            <button
              onClick={handleTriggerAutoTest}
              disabled={savingAuto}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold py-2 px-3 rounded-lg text-slate-200 transition"
              title="Dispatches latest 5 news immediately"
            >
              Test Send Now
            </button>
          </div>
        </div>

        {autoMessage && (
          <div className="mt-4 p-3 bg-indigo-900/40 border border-indigo-700/50 rounded-lg text-xs font-medium text-indigo-200">
            {autoMessage}
          </div>
        )}
      </div>

      {/* Control Configuration Panel */}
      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        {/* Left 2 Cols: Generation Controls */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-gray-900">1. Select Design Template</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Choose from pre-designed layouts tested for 100% color and typography fidelity across PC and mobile mail clients.
            </p>
          </div>

          {/* Template Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'executive-dark',
                name: 'Executive Onyx',
                badge: 'Flagship',
                color: 'bg-slate-900 border-slate-950 text-white',
                desc: 'Onyx slate header, red accents, high corporate readability.',
              },
              {
                id: 'visual-spotlight',
                name: 'Visual Magazine',
                badge: 'Image-Rich',
                color: 'bg-slate-900 border-red-600 text-white',
                desc: 'Prominent photos framed below each news item with dark masthead.',
              },
              {
                id: 'classic-editorial',
                name: 'Classic Editorial',
                badge: 'Broadsheet',
                color: 'bg-stone-100 border-stone-300 text-stone-900',
                desc: 'Traditional serif masthead with dual broadsheet rules.',
              },
              {
                id: 'modern-crimson',
                name: 'Modern Crimson',
                badge: 'Breaking News',
                color: 'bg-red-700 border-red-800 text-white',
                desc: 'Bold crimson header with card borders for high urgency.',
              },
            ].map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id as any)}
                  className={`cursor-pointer rounded-xl border-2 p-3 transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-red-600 bg-red-50/30 shadow-md ring-2 ring-red-200'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {tmpl.badge}
                      </span>
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>}
                    </div>
                    <div
                      className={`h-7 rounded flex items-center justify-center font-serif text-[11px] font-bold mb-2 ${tmpl.color}`}
                    >
                      FINANCIAL JOURNAL
                    </div>
                    <p className="text-xs font-bold text-gray-900">{tmpl.name}</p>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{tmpl.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image Inclusion Switch */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-800">Display News Article Images in Email</p>
              <p className="text-[11px] text-gray-500">
                Embeds the selected news hero image directly underneath the article title and category.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="border-t pt-5 space-y-4">
            <h2 className="text-base font-bold text-gray-900">2. Newsletter Parameters</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:border-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Edition Sub-title
                </label>
                <input
                  type="text"
                  value={editionTitle}
                  onChange={(e) => setEditionTitle(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Base Website URL for Exact Article Links
              </label>
              <input
                type="text"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://www.financial-journal.xyz"
                className="w-full text-sm font-mono border border-gray-300 rounded-lg px-3.5 py-2 focus:border-red-600 focus:outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Articles link directly to: <span className="font-mono text-gray-700">{siteUrl}/[category]/[slug]</span>
              </p>
            </div>
          </div>

          <div className="border-t pt-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-gray-900">
                3. Select Articles ({selectedArticles.length} included)
              </h2>
              <span className="text-xs text-gray-400">Click card to include / exclude</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {articles.map((art) => {
                const isSelected = selectedArticles.some((a) => a.slug === art.slug);
                return (
                  <div
                    key={art.slug}
                    onClick={() => toggleArticleSelection(art)}
                    className={`cursor-pointer p-3 rounded-lg border text-xs transition flex gap-3 ${
                      isSelected
                        ? 'bg-red-50/60 border-red-500 shadow-sm'
                        : 'bg-white border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 text-red-600 rounded focus:ring-0"
                    />
                    {art.image && (
                      <img
                        src={art.image}
                        alt=""
                        className="w-14 h-14 object-cover rounded flex-shrink-0 border border-gray-200"
                      />
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-red-700 uppercase">{art.category}</span>
                      <p className="font-semibold text-gray-900 line-clamp-2 mt-0.5">{art.title}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-1 truncate">
                        /{art.categorySlug}/{art.slug}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={handleGeneratePreview}
              disabled={generating}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm py-3 px-6 rounded-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Layout...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Generate Newsletter Design Preview
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Subscribers List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="border-b pb-4 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Subscribers</h2>
              <p className="text-xs text-gray-500">Live recipient list from MongoDB</p>
            </div>
            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {subscribers.length} total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2">
            {subscribers.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-8">No subscribers registered yet.</p>
            ) : (
              subscribers.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                  <p className="font-mono text-gray-800 font-medium truncate">{s.email}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Subscribed {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Active'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Generated Newsletter Section */}
      {previewHtml && (
        <div id="newsletter-preview-section" className="scroll-mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Ready for Dispatch
                </span>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Template: {selectedTemplate} {includeImages ? '(With Images)' : '(Text Only)'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-1">Newsletter Design & Link Preview</h3>
              <p className="text-xs text-gray-500">
                Exact responsive email template with bulletproof inline styles guaranteeing identical colors on PC and
                mobile.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Device Preview Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    previewDevice === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  PC View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    previewDevice === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Phone View
                </button>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendNewsletter}
                disabled={sending}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold text-sm py-2.5 px-6 rounded-lg shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending to {subscribers.length}...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Send Newsletter Now
                  </>
                )}
              </button>
            </div>
          </div>

          {sendResult && (
            <div
              className={`p-4 rounded-xl border text-sm font-medium ${
                sendResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {sendResult.message}
            </div>
          )}

          {/* Visual Email Frame Preview rendered via Iframe with Exact HTML */}
          <div className="bg-gray-200/80 p-4 sm:p-8 rounded-2xl border border-gray-300 flex justify-center transition-all">
            <div
              className={`bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-300 transition-all ${
                previewDevice === 'mobile' ? 'w-[375px] max-w-full' : 'w-[680px] max-w-full'
              }`}
            >
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span>{previewDevice === 'mobile' ? 'iPhone / Mobile View (375px)' : 'Desktop View (680px)'}</span>
                <span>Links resolve to: {siteUrl}</span>
              </div>
              <iframe
                title="Newsletter Email Preview"
                srcDoc={previewHtml}
                className="w-full border-0 min-h-[780px]"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
