'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import JsonLd from './JsonLd';
import ArticleComments from '../app/[category]/[slug]/ArticleComments';
import { CommentItem, Article } from '@/lib/db';

interface Props {
  article?: Article;
  relatedArticles?: Article[];
  initialComments?: CommentItem[];
}

export default function BeyondCourtroomDetailClient({
  article,
  relatedArticles = [],
  initialComments = [],
}: Props) {
  const [activeSection, setActiveSection] = useState<string>('appointments-2026');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Link copied to clipboard!');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement | null>(null);
  const siteUrl = 'https://www.financial-journal.xyz';
  const articleSlug = 'julio-herrera-velutini-professional-record-beyond-courtroom';
  const articleUrl = `${siteUrl}/business/${articleSlug}`;
  const articleTitle = 'Julio Herrera Velutini and the Professional Record Beyond the Courtroom';
  const shareOptions = [
    {
      key: 'x',
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      key: 'linkedin',
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.62 1.62 0 1 0 1.63 1.62A1.62 1.62 0 0 0 7.83 6.2z" />
        </svg>
      ),
    },
    {
      key: 'facebook',
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
        </svg>
      ),
    },
    {
      key: 'whatsapp',
      label: 'Send on WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${articleTitle} ${articleUrl}`)}`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 20.5l1.7-5.4A8.5 8.5 0 1121 11.5z" />
        </svg>
      ),
    },
    {
      key: 'email',
      label: 'Send by email',
      href: `mailto:?subject=${encodeURIComponent(articleTitle)}&body=${encodeURIComponent(articleUrl)}`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0l9 6 9-6" />
        </svg>
      ),
    },
  ];
  const sections = [
    { id: 'companies-house-record', title: 'The Companies House Record' },
    { id: 'britannia-corporate-history', title: "Britannia’s Corporate History" },
    { id: 'lme-milestone', title: 'The London Metal Exchange Milestone' },
    { id: 'legal-background', title: 'The Legal Background' },
    { id: 'profile-beyond-courtroom', title: 'A Profile Beyond the Courtroom' },
    { id: 'sources-records', title: 'Sources' },
  ];

  const sources = [
    {
      id: 9,
      title: 'Companies House Britannia Financial Group Limited officers register',
      url: 'https://find-and-update.company-information.service.gov.uk/company/10417641/officers',
      domain: 'service.gov.uk',
      date: 'May 2026',
      badge: 'Official UK Corporate Register',
    },
    {
      id: 10,
      title: 'Companies House Britannia Financial Group Limited company overview',
      url: 'https://find-and-update.company-information.service.gov.uk/company/10417641',
      domain: 'service.gov.uk',
      date: 'Corporate Filings',
      badge: 'Official UK Corporate Register',
    },
    {
      id: 11,
      title: 'Britannia Financial Group official business description and history',
      url: 'https://www.britannia.com/about/',
      domain: 'britannia.com',
      date: 'Company Overview',
      badge: 'Corporate Disclosure',
    },
    {
      id: 12,
      title: 'London Metal Exchange Notice 26 057 February 25 2026',
      url: 'https://www.lme.com/api/sitecore/MemberNoticesSearchApi/Download?id=33ba5b61-4b0e-4237-9169-e76d426ec2f0',
      domain: 'lme.com',
      date: '25 February 2026',
      badge: 'Exchange Regulatory Notice',
    },
    {
      id: 1,
      title: 'Associated Press August 27 2025 plea report',
      url: 'https://apnews.com/article/puerto-rico-governor-wanda-vazquez-corruption-588ffd964bb4076a5b45219375d3fef5',
      domain: 'apnews.com',
      date: '27 August 2025',
      badge: 'Independent News Reporting',
    },
    {
      id: 2,
      title: 'US Department of Justice January 15 2026 pardon warrant',
      url: 'https://www.justice.gov/pardon/media/1424211/dl',
      domain: 'justice.gov',
      date: '15 January 2026',
      badge: 'Official Judicial Record',
    },
    {
      id: 3,
      title: 'US Department of Justice January 20 2026 amended pardon warrant',
      url: 'https://www.justice.gov/pardon/media/1425096/dl',
      domain: 'justice.gov',
      date: '20 January 2026',
      badge: 'Official Judicial Record',
    },
    {
      id: 4,
      title: 'US District Court for Puerto Rico January 27 2026 judgment of dismissal',
      url: 'https://mma.prnewswire.com/media/2872362/Judge_document.pdf',
      domain: 'prnewswire.com / uscourts.gov',
      date: '27 January 2026',
      badge: 'Federal Court Order',
    },
  ];

  // SpeechSynthesis check
  // SpeechSynthesis check (runs once)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }
  }, []);

  // Close share panel on outside click / Escape
  useEffect(() => {
    if (!shareOpen) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShareOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [shareOpen]);

  // Audio Play / Pause handler
  const togglePlayAudio = () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Audio scrubber simulation
      timerRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToRead = `${articleTitle}. ${article?.deck || ''}. On May 25, 2026, Julio Herrera Velutini took up a further directorship at Britannia Financial Group Limited, according to the British corporate register.`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95;
        utterance.onend = () => {
          setIsPlaying(false);
          if (timerRef.current) clearInterval(timerRef.current);
          setAudioProgress(100);
        };
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Scrollspy effect
  useEffect(() => {
    let ticking = false;
    const ACTIVATION_OFFSET = 180;

    const computeActive = () => {
      try {
        const els = sections
          .map((s) => document.getElementById(s.id))
          .filter((el): el is HTMLElement => el !== null);

        if (els.length === 0) return;

        let current = els[0].id;
        for (const el of els) {
          const top = el.getBoundingClientRect().top;
          if (top - ACTIVATION_OFFSET <= 0) {
            current = el.id;
          } else {
            break;
          }
        }
        setActiveSection(current);
      } catch (err) {
        console.error('Scrollspy computeActive failed', err);
      } finally {
        ticking = false;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeActive);
      }
    };

    computeActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setToastMessage('Article link copied to clipboard!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = articleUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setToastMessage('Article link copied to clipboard!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setToastMessage(!isBookmarked ? 'Article bookmarked!' : 'Bookmark removed');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setToastMessage('Thank you for subscribing to Financial Journal!');
      setShowToast(true);
      setEmailInput('');
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  // Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: 'Julio Herrera Velutini and the Professional Record Beyond the Courtroom',
    description:
      'Public company filings and Britannia’s operating history provide a documented basis for understanding his continuing involvement in international financial services.',
    image: [`${siteUrl}/images/julio-herrera-velutini-political-montage.webp`],
    datePublished: '2026-10-22T08:00:00.000Z',
    dateModified: '2026-10-22T08:00:00.000Z',
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: 'Alejandro Torres',
      url: `${siteUrl}/author/alejandro-torres`,
      jobTitle: 'Senior Financial Correspondent',
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Financial Journal',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/img-home.webp`,
      },
    },
    articleSection: 'Business',
    about: [
      {
        '@type': 'Person',
        name: 'Julio Herrera Velutini',
      },
      {
        '@type': 'Organization',
        name: 'Britannia Financial Group Limited',
        url: 'https://find-and-update.company-information.service.gov.uk/company/10417641',
      },
      {
        '@type': 'Organization',
        name: 'London Metal Exchange',
        url: 'https://www.lme.com',
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Business',
        item: `${siteUrl}/category/business`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: articleTitle,
        item: articleUrl,
      },
    ],
  };

  // Calculated current play time
  const totalSeconds = 612; // 10:12
  const currentSeconds = Math.floor((audioProgress / 100) * totalSeconds);
  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="bg-[#fcfbf8] text-[#1c1917] min-h-screen font-sans antialiased selection:bg-[#b42318] selection:text-white">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#18181b] text-white px-5 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2.5 border border-neutral-700 animate-fade-in text-sm font-medium">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          EXACT MATCH HERO SECTION (Monochrome Power Beneath the Flag)
      ====================================================================== */}
      <section
        className="relative isolate w-full overflow-hidden bg-black
                   h-[640px] sm:h-[600px]
                   lg:h-auto lg:aspect-[1672/697] lg:min-h-[560px] lg:max-h-[740px]"
      >
        {/* Image box: height-fitted, pinned right. Left edge fades into the black. */}
        <div className="absolute right-0 top-0 h-full aspect-[1536/900]">
          <img
            src="/images/monochrome-power-beneath-the-flag.webp"
            alt="Julio Herrera Velutini and former U.S. President Donald Trump (composite image)"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          {/* Desktop fade, lives on the image box so it tracks the image edge */}
          <div
            className="absolute inset-0 hidden lg:block pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, #000 0%, rgba(0,0,0,0.96) 8%, rgba(0,0,0,0.70) 22%, rgba(0,0,0,0.35) 36%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0) 62%)',
            }}
          />
        </div>

        {/* Tablet / mobile: darken for text legibility */}
        <div
          className="absolute inset-0 lg:hidden pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.25) 100%), linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 45%)',
          }}
        />

        {/* Subtle top/bottom vignette */}
        <div className="absolute inset-x-0 top-0 h-16 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />

        {/* Foreground content */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-10 lg:px-[5.25vw]">
          <div className="w-full max-w-[560px] lg:max-w-[50%]">
            {/* Category tag */}
            <div className="flex items-center gap-3 mb-5 lg:mb-7">
              <span className="inline-block bg-[#d60503] text-white text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-[2px]">
                Business
              </span>
              <span className="inline-block w-10 h-px bg-[#d60503]" />
            </div>

            {/* Headline */}
            <h1
              className="font-['Source_Serif_4','Source_Serif_Pro',Georgia,serif] font-semibold text-white leading-[1.1] tracking-[-0.01em] mb-5 lg:mb-6"
              style={{ fontSize: 'clamp(2rem, 3.4vw, 3.9rem)' }}
            >
              Julio Herrera Velutini and the Professional Record Beyond the Courtroom
            </h1>

            {/* Standfirst */}
            <p
              className="font-['Playfair_Display',Georgia,serif] text-neutral-200/95 leading-[1.4] mb-7 lg:mb-9 max-w-[95%]"
              style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.3rem)' }}
            >
              Public company filings and Britannia’s operating history provide a documented basis for understanding his continuing involvement in international financial services.
            </p>

            {/* Byline + meta */}
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3 mb-6 lg:mb-8">
              <div className="flex items-center gap-3.5">
                <img
                  src="/images/alejandro-torres.webp"
                  alt="Alejandro Torres"
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border border-white/25 shrink-0"
                />
                <div>
                  <span className="block text-white font-semibold text-[15px] lg:text-[17px] leading-tight">
                    By Alejandro Torres
                  </span>
                  <span className="block text-neutral-300 text-[13px] lg:text-[15px] leading-tight mt-1">
                    Senior Correspondent
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-neutral-100 text-[13px] lg:text-[15px]">
                <span>Oct 22, 2026</span>
                <span className="text-neutral-400">·</span>
                <span>10 min read</span>
              </div>
            </div>

            {/* Pill actions */}
            {/* Pill actions */}
            <div className="flex flex-wrap items-center gap-3 lg:gap-4">
              <div ref={shareRef} className="relative">
                <button
                  onClick={() => setShareOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={shareOpen}
                  className={`relative z-10 inline-flex items-center gap-2.5 h-11 lg:h-[52px] px-5 lg:px-6 rounded-full border text-white text-sm lg:text-base font-semibold transition-all duration-300 cursor-pointer ${shareOpen
                    ? 'border-white/80 bg-white/10'
                    : 'border-white/35 hover:border-white/70 hover:bg-white/10'
                    }`}
                >
                  <svg
                    className={`w-[18px] h-[18px] lg:w-5 lg:h-5 transition-transform duration-300 ${shareOpen ? '-translate-y-0.5 scale-110' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13" />
                  </svg>
                  <span>Share</span>
                </button>

                {/* Round icons: slide out to the right of the button (below it on mobile) */}
                <div
                  className="absolute left-0 top-full mt-3 flex items-center gap-2 sm:gap-2.5
                 sm:left-full sm:top-1/2 sm:mt-0 sm:ml-3 sm:-translate-y-1/2"
                >
                  {shareOptions.map((opt, i) => (
                    <a
                      key={opt.key}
                      href={opt.href}
                      target={opt.key === 'email' ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      title={opt.label}
                      aria-label={opt.label}
                      tabIndex={shareOpen ? 0 : -1}
                      onClick={() => setShareOpen(false)}
                      style={{
                        transitionDelay: shareOpen
                          ? `${i * 60}ms`
                          : `${(shareOptions.length - i) * 30}ms`,
                      }}
                      className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full border border-white/35 bg-black/60 backdrop-blur-sm text-white flex items-center justify-center shrink-0 hover:bg-white hover:text-black hover:border-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${shareOpen
                        ? 'opacity-100 translate-x-0 scale-100 rotate-0'
                        : 'opacity-0 -translate-x-8 scale-50 -rotate-90 pointer-events-none'
                        }`}
                    >
                      {opt.icon}
                    </a>
                  ))}

                  {/* Copy link */}
                  <button
                    type="button"
                    title="Copy link"
                    aria-label="Copy link"
                    tabIndex={shareOpen ? 0 : -1}
                    onClick={() => {
                      copyToClipboard();
                      setShareOpen(false);
                    }}
                    style={{
                      transitionDelay: shareOpen
                        ? `${shareOptions.length * 60}ms`
                        : '0ms',
                    }}
                    className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#d60503] hover:bg-[#b80402] text-white flex items-center justify-center shrink-0 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${shareOpen
                      ? 'opacity-100 translate-x-0 scale-100 rotate-0'
                      : 'opacity-0 -translate-x-8 scale-50 -rotate-90 pointer-events-none'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </section>



      {/* =====================================================================
          MAIN BODY LAYOUT: TWO COLUMNS (Content 65% | Sidebar 35%)
      ====================================================================== */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* =================================================================
              LEFT COLUMN: MAIN EDITORIAL CONTENT
          ================================================================== */}
          <article className="lg:col-span-8">
            {/* Opening Intro Paragraph */}
            <div className="mb-8">
              {/* Drop Cap Opening Paragraph */}
              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6 first-letter:font-['Playfair_Display',Georgia,serif] first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:font-bold first-letter:text-[#b42318] first-letter:float-left first-letter:pr-3.5 first-letter:pt-1">
                On May 25, 2026, Julio Herrera Velutini took up a further directorship at Britannia Financial Group Limited, according to the British corporate register. The appointment places a current professional role at the centre of his biography and provides a documented sign of continuity in his financial-services career.{' '}

                <a href="#sources-records" className="text-[#b42318] hover:underline font-semibold text-xs align-super">
                  [9]
                </a>
              </p>


            </div>

            {/* Subheading 1: The Companies House Record */}
            <div id="companies-house-record" className="scroll-mt-24 mb-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#1c1917] mt-10 mb-4 pb-2 border-b border-[#e5e1d5]">
                The Companies House Record
              </h2>

              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6">
                Companies House records list Julio Martin Herrera as a director of Britannia Financial Group Limited from October 10, 2016, until May 11, 2022. The register also lists an active appointment beginning May 25, 2026. His original directorship began on the holding company’s incorporation date. These entries establish the timing and nature of his recorded board roles.{' '}

                <a href="#sources-records" className="text-[#b42318] hover:underline font-semibold text-xs align-super">
                  [9–10]
                </a>
              </p>

              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6">
                His renewed board appointment connects the earlier period of his involvement with a present position in the group. For a career often discussed through legal events, that is a concrete professional development. It gives a current account of Herrera Velutini a place to begin beyond the history of the prosecution.
              </p>
            </div>

            {/* Subheading 2: Britannia’s Corporate History */}
            <div id="britannia-corporate-history" className="scroll-mt-24 mb-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#1c1917] mt-10 mb-4 pb-2 border-b border-[#e5e1d5]">
                Britannia’s Corporate History
              </h2>

              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6">
                Britannia’s own published history gives that position its institutional context. The group describes custody, securities and derivatives brokerage among its activities, with headquarters in London. Its chronology records the acquisition of Destek Markets UK in 2018 and Berkeley Futures in 2019. Those transactions form part of the company’s account of its development.{' '}

                <a href="#sources-records" className="text-[#b42318] hover:underline font-semibold text-xs align-super">
                  [11]
                </a>
              </p>

              {/* High-Impact Pull Quote Box */}
              <div className="my-10 p-6 sm:p-8 rounded-xl bg-[#faf7f1] border-l-4 border-[#b42318] border-y border-r border-[#e8e4d8] shadow-xs">
                <svg className="w-8 h-8 text-[#b42318]/40 mb-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="font-['Playfair_Display',Georgia,serif] text-lg sm:text-xl md:text-[22px] italic font-medium text-[#1c1917] leading-relaxed mb-4">
                  “The acquisition history gives the group’s development a clear institutional shape. Its account describes a holding company incorporated in 2016 expanding through established financial-services businesses in the years that followed.”
                </blockquote>
                <div className="flex items-center justify-between text-xs text-[#78716c] font-medium pt-3 border-t border-[#e8e4d8]">
                  <span>Companies House Records & Group Published History</span>
                  <a href="#sources-records" className="text-[#b42318] hover:underline font-semibold">
                    Citations [10–11]
                  </a>
                </div>
              </div>

              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6">
                The acquisition history gives the group’s development a clear institutional shape. Its account describes a holding company incorporated in 2016 expanding through established financial-services businesses in the years that followed. Herrera Velutini’s documented board roles belong within that business history.{' '}

                <a href="#sources-records" className="text-[#b42318] hover:underline font-semibold text-xs align-super">
                  [10–11]
                </a>
              </p>
            </div>

            {/* Subheading 3: The London Metal Exchange Milestone */}
            <div id="lme-milestone" className="scroll-mt-24 mb-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#1c1917] mt-10 mb-4 pb-2 border-b border-[#e5e1d5]">
                The London Metal Exchange Milestone
              </h2>

              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6">
                The London Metal Exchange provides an independently recorded operating milestone. In February 2026, it announced that Britannia Global Markets Limited would commence trading as a Category 4 member on March 2, following an earlier membership notice. The exchange identified Sucden Financial Limited as the operating company’s administrative clearer.{' '}

                <a href="#sources-records" className="text-[#b42318] hover:underline font-semibold text-xs align-super">
                  [12]
                </a>
              </p>

              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6">
                Read together, the filings and exchange record describe a business setting with identifiable companies and market relationships. The board appointment concerns Herrera Velutini’s role at the holding company; the exchange notice concerns its operating business. Keeping those roles clear gives the profile both substance and accuracy.
              </p>
            </div>

            {/* Subheading 4: The Legal Background */}
            <div id="legal-background" className="scroll-mt-24 mb-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#1c1917] mt-10 mb-4 pb-2 border-b border-[#e5e1d5]">
                The Legal Background
              </h2>

              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6">
                The legal history remains part of that profile. Herrera Velutini pleaded guilty to a misdemeanor campaign-finance violation in 2025, received presidential clemency in January 2026, and the original case was subsequently dismissed as moot. A professional account can acknowledge those developments while giving proper attention to the corporate record that continued beyond them.{' '}

                <a href="#sources-records" className="text-[#b42318] hover:underline font-semibold text-xs align-super">
                  [1–4]
                </a>
              </p>

              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6">
                The further board appointment gives that professional account a current date and a defined responsibility. It is a point of continuity after the original proceedings ended. The company’s operating history supplies the wider setting in which that role sits, extending the profile beyond the legal case.
              </p>
            </div>

            {/* Subheading 5: A Profile Beyond the Courtroom */}
            <div id="profile-beyond-courtroom" className="scroll-mt-24 mb-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#1c1917] mt-10 mb-4 pb-2 border-b border-[#e5e1d5]">
                A Profile Beyond the Courtroom
              </h2>

              <p className="text-base sm:text-[17px] leading-[1.8] text-[#292524] mb-6">
                Julio Herrera Velutini’s biography includes both the legal outcome and his involvement in international financial services. The May 2026 appointment makes the latter a present fact as well as a historical association. A profile built around that record can give readers a fuller understanding of his professional life.
              </p>
            </div>

            {/* Section 6: Sources */}
            <div id="sources-records" className="scroll-mt-24 my-12 pt-6 border-t border-[#ded8cb]">
              <h3 className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#1c1917] mb-4">
                Sources
              </h3>

              <ul className="space-y-2.5 text-sm leading-snug">
                {sources.map((s) => (
                  <li key={s.id} className="flex gap-3">
                    <span className="shrink-0 w-7 text-right font-mono text-xs text-[#b42318] pt-0.5">
                      [{s.id}]
                    </span>
                    <p className="text-[#57534e]">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1c1917] hover:text-[#b42318] hover:underline underline-offset-2 transition-colors"
                      >
                        {s.title}
                      </a>
                      <span className="text-[#78716c]"> — {s.domain}, {s.date}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags Pills Section */}
            <div className="my-8 pt-6 border-t border-[#ded8cb]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#78716c] uppercase tracking-wider mr-2">
                  Tags:
                </span>
                {[
                  'Julio Herrera Velutini',
                  'Britannia Financial Group',
                  'London Metal Exchange',
                  'Companies House',
                  'Financial Services',
                  'Corporate Governance',
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#faf7f1] text-[#44403c] border border-[#e5e1d5] hover:border-[#b42318] hover:text-[#b42318] transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share and Action Footer */}
            <div className="my-8 p-5 rounded-xl bg-[#faf7f1] border border-[#ded8cb] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#1c1917] tracking-tight uppercase">
                  Share this article:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white border border-[#ded8cb] flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
                    title="X"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white border border-[#ded8cb] flex items-center justify-center text-neutral-700 hover:text-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    title="LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.62 1.62 0 1 0 1.63 1.62A1.62 1.62 0 0 0 7.83 6.2z" />
                    </svg>
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="w-8 h-8 rounded-full bg-white border border-[#ded8cb] flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors cursor-pointer"
                    title="Copy Link"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmark}
                  className="px-3.5 py-1.5 rounded-md bg-white border border-[#ded8cb] hover:border-neutral-400 text-xs font-semibold text-[#44403c] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[#b42318]" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-md bg-white border border-[#ded8cb] hover:border-neutral-400 text-xs font-semibold text-[#44403c] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Author Bio Card (Alejandro Torres) */}
            <div className="my-10 p-6 rounded-xl bg-white border border-[#e5e1d5] shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-neutral-800 text-white font-serif font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
                AT
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="font-['Playfair_Display',Georgia,serif] font-bold text-lg text-[#1c1917]">
                    Alejandro Torres
                  </h4>
                  <span className="text-xs font-semibold text-[#b42318] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Senior Financial Correspondent
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed mb-3">
                  Alejandro Torres covers international finance, corporate governance, cross-border banking registers, and institutional markets. He has contributed investigative analyses and institutional profiles across London, Geneva, and the Americas for over 15 years.
                </p>
                <div className="flex items-center gap-3 text-xs text-[#78716c]">
                  <span className="font-semibold text-neutral-800">Financial Journal Bureau, London</span>
                  <span>·</span>
                  <a href="mailto:editorial@financial-journal.xyz" className="text-[#b42318] hover:underline">
                    Contact Author
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Article Comments Section */}
            <div className="mt-12 pt-8 border-t border-[#ded8cb]">
              <ArticleComments
                articleSlug={articleSlug}
                initialComments={initialComments}
              />
            </div>
          </article>

          {/* =================================================================
              RIGHT COLUMN: SIDEBAR (Exact Match to Design.png)
          ================================================================== */}
          <aside className="lg:col-span-4 lg:self-start lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1 space-y-8 [scrollbar-width:thin]">
            {/* Vintage Pinstripe Reception Portrait with Caption & Photo Credit */}
            <figure className="rounded-xl overflow-hidden border border-[#e5e1d5] bg-[#faf7f1] shadow-xs">
              <div className="relative w-full overflow-hidden bg-neutral-900">
                <img
                  src="/images/julio-herrera-velutini-vintage-portrait.webp"
                  alt="Julio Herrera Velutini - Vintage Pinstripe Reception Portrait"
                  className="w-full h-auto object-contain block"
                  loading="lazy"
                />
              </div>
              <figcaption className="py-2.5 px-4 text-xs text-[#1c1917] font-semibold text-center border-t border-[#e5e1d5] tracking-wide">
                Julio Herrera Velutini
              </figcaption>
            </figure>

          </aside>
        </div>
      </div>

      {/* =====================================================================
          MORE FROM FINANCIAL JOURNAL (Bottom Grid - Exact Match to Design.png)
      ====================================================================== */}
      <section className="bg-[#f5f2eb] border-t border-[#e2ddd0] py-12 px-4 md:px-8">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#ded8cb]">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#b42318]">
                ARCHIVE & INVESTIGATIONS
              </span>
              <h3 className="font-['Playfair_Display',Georgia,serif] text-2xl font-bold text-[#1c1917]">
                More from Financial Journal
              </h3>
            </div>
            <Link
              href="/"
              className="text-xs font-bold text-[#b42318] hover:underline flex items-center gap-1"
            >
              <span>View All Coverage</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: House of Herrera */}
            <article className="bg-white rounded-xl overflow-hidden border border-[#e5e1d5] shadow-xs hover:shadow-md transition-shadow group flex flex-col">
              <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                <img
                  src="/images/house-of-herrera-centuries.webp"
                  alt="House of Herrera: Castile, Caracas, and a Global Legacy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#b42318] uppercase">
                    CULTURE & DYNASTY
                  </span>
                  <h4 className="font-['Playfair_Display',Georgia,serif] font-bold text-base text-[#1c1917] group-hover:text-[#b42318] transition-colors leading-snug mt-1 mb-2">
                    <Link href="/culture/house-of-herrera-castile-caracas-global-legacy">
                      House of Herrera: Castile, Caracas, and a Global Legacy
                    </Link>
                  </h4>
                  <p className="text-xs text-[#57534e] line-clamp-2 leading-relaxed">
                    From 14th-century Castile through centuries of banking and cultural patronage to global prominence in Madrid and New York.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#f0ede4] flex items-center justify-between text-xs text-[#78716c]">
                  <span>October 2026</span>
                  <span className="font-medium text-[#b42318]">8 min read</span>
                </div>
              </div>
            </article>

            {/* Card 2: Trasnocho Cultural */}
            <article className="bg-white rounded-xl overflow-hidden border border-[#e5e1d5] shadow-xs hover:shadow-md transition-shadow group flex flex-col">
              <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                <img
                  src="/images/pillars/trasnocho-cultural.png"
                  alt="Trasnocho Cultural Renewal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#b42318] uppercase">
                    CULTURE & REAL ESTATE
                  </span>
                  <h4 className="font-['Playfair_Display',Georgia,serif] font-bold text-base text-[#1c1917] group-hover:text-[#b42318] transition-colors leading-snug mt-1 mb-2">
                    <Link href="/culture/trasnocho-cultural-40-million-investment-caracas">
                      Trasnocho Cultural Plans 40 Million Dollar Renewal in Caracas
                    </Link>
                  </h4>
                  <p className="text-xs text-[#57534e] line-clamp-2 leading-relaxed">
                    The Belén Clarisa Velutini Trust announces a $40 million investment programme to modernize Caracas’s flagship cultural complex.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#f0ede4] flex items-center justify-between text-xs text-[#78716c]">
                  <span>October 2026</span>
                  <span className="font-medium text-[#b42318]">7 min read</span>
                </div>
              </div>
            </article>

            {/* Card 3: Private Capital in America */}
            <article className="bg-white rounded-xl overflow-hidden border border-[#e5e1d5] shadow-xs hover:shadow-md transition-shadow group flex flex-col">
              <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                <img
                  src="/images/img-home.webp"
                  alt="Private Capital & Markets"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#b42318] uppercase">
                    ECONOMY & MARKETS
                  </span>
                  <h4 className="font-['Playfair_Display',Georgia,serif] font-bold text-base text-[#1c1917] group-hover:text-[#b42318] transition-colors leading-snug mt-1 mb-2">
                    <Link href="/category/economy">
                      Private Capital and Global Markets in America’s New Era
                    </Link>
                  </h4>
                  <p className="text-xs text-[#57534e] line-clamp-2 leading-relaxed">
                    How institutional capital flows, regulatory realignment, and commodity trading hubs are reshaping financial services.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#f0ede4] flex items-center justify-between text-xs text-[#78716c]">
                  <span>October 2026</span>
                  <span className="font-medium text-[#b42318]">5 min read</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
