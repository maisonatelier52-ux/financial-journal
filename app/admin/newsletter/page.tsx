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

export default function AdminNewsletterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<ArticleItem[]>([]);
  const [generatedHtml, setGeneratedHtml] = useState<boolean>(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  const [subject, setSubject] = useState(
    `Financial Journal: Executive Edition — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  );
  const [editionTitle, setEditionTitle] = useState('Daily Executive Briefing');

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
          setSelectedArticles((data.latestArticles || []).slice(0, 4));
        }
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleGenerateNewsletter = () => {
    setGeneratedHtml(true);
    setSendResult(null);
    const element = document.getElementById('newsletter-preview-section');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSendNewsletter = async () => {
    if (!subscribers.length) {
      alert('No subscribers in database to send to.');
      return;
    }

    if (!confirm(`Are you sure you want to send this newsletter to ${subscribers.length} subscriber(s)?`)) {
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          editionTitle,
          articles: selectedArticles,
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
          message: data.error || data.message || 'Failed to send newsletter.',
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
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Admin Portal
              </span>
              <span className="text-xs text-gray-400">Editorial Desk Dispatcher</span>
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
              <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Active Subscribers</p>
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

      {/* Control Configuration Panel */}
      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        {/* Left 2 Cols: Generation Controls */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-gray-900">Newsletter Configuration</h2>
            <p className="text-xs text-gray-500 mt-0.5">Customize the email edition before previewing and dispatching</p>
          </div>

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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Featured Articles ({selectedArticles.length} included)
              </label>
              <span className="text-xs text-gray-400">Click to toggle inclusion</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {articles.map((art) => {
                const isSelected = selectedArticles.some((a) => a.slug === art.slug);
                return (
                  <div
                    key={art.slug}
                    onClick={() => toggleArticleSelection(art)}
                    className={`cursor-pointer p-3 rounded-lg border text-xs transition flex gap-3 ${
                      isSelected
                        ? 'bg-red-50/60 border-red-500 shadow-sm'
                        : 'bg-white border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 text-red-600 rounded focus:ring-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-red-700 uppercase">{art.category}</span>
                      <p className="font-semibold text-gray-900 line-clamp-2 mt-0.5">{art.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerateNewsletter}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm py-3 px-6 rounded-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Generate Newsletter Design Preview
            </button>
          </div>
        </div>

        {/* Right 1 Col: Subscribers List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="border-b pb-4 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Subscribers</h2>
              <p className="text-xs text-gray-500">Recipients stored in database</p>
            </div>
            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {subscribers.length} total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-80 space-y-2">
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
      {generatedHtml && (
        <div id="newsletter-preview-section" className="scroll-mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Ready for Dispatch
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">Newsletter Design Preview</h3>
              <p className="text-xs text-gray-500">
                This exact responsive email layout will be delivered to {subscribers.length} recipient(s).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendNewsletter}
                disabled={sending}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold text-sm py-2.5 px-6 rounded-lg shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Newsletter...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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

          {/* Visual Email Frame Preview */}
          <div className="bg-gray-100 p-4 sm:p-8 rounded-2xl border border-gray-300">
            <div className="max-w-[620px] mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
              {/* Email Top Header */}
              <div className="bg-[#111827] px-6 py-7 text-center border-b-4 border-red-600">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wider m-0">
                  FINANCIAL JOURNAL
                </h1>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 mt-1 font-semibold">
                  Exclusive Intelligence &bull; Global Markets &bull; Policy
                </p>
              </div>

              {/* Sub-bar */}
              <div className="bg-gray-100 px-6 py-2.5 border-b border-gray-200 flex justify-between items-center text-xs font-semibold text-gray-600">
                <span>{editionTitle}</span>
                <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              {/* Email Content Body */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="border-b pb-4">
                  <p className="text-xs uppercase font-bold text-red-600 tracking-wider">Top Story</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Good morning. Here is today&apos;s executive briefing curated by our editorial desk covering key market shifts, corporate developments, and global economic analysis.
                  </p>
                </div>

                <div className="space-y-6">
                  {selectedArticles.map((art, idx) => (
                    <div
                      key={art.slug}
                      className={`pb-5 ${idx < selectedArticles.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                        {art.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-gray-900 mt-1 leading-snug">
                        {art.title}
                      </h3>
                      {art.summary && (
                        <p className="text-xs md:text-sm text-gray-600 mt-1.5 leading-relaxed">
                          {art.summary}
                        </p>
                      )}
                      <div className="mt-2.5 flex items-center justify-between text-xs">
                        <span className="text-gray-400">{art.readTime}</span>
                        <span className="text-red-600 font-semibold hover:underline">
                          Read full article &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-6 text-center text-xs text-gray-500 space-y-2">
                <p className="font-semibold text-gray-700">Financial Journal Editorial Desk</p>
                <p className="text-[11px]">
                  You are receiving this executive dispatch because you are subscribed to Financial Journal briefings.
                </p>
                <p className="text-[11px] text-gray-400 pt-1">
                  &copy; {new Date().getFullYear()} Financial Journal. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
