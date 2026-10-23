'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import JsonLd from './JsonLd';
import ArticleComments from '../app/[category]/[slug]/ArticleComments';
import { CommentItem, Article } from '@/lib/db';

/* ---------------------------------------------------------------------------
   DESIGN TOKENS
   ink    #0D1B2A  deep navy, hero + headings
   paper  #F3F5F4  cool off-white page
   rule   #D8DEDB  hairlines
   brass  #9A7B2F  register / ledger accent
   red    #C8102E  Financial Journal brand red (used sparingly)
   muted  #55636F  secondary text
   Type: Fraunces (display) + Source Serif 4 (reading text) + system sans (UI)
--------------------------------------------------------------------------- */

interface Props {
  article?: Article;
  relatedArticles?: Article[];
  initialComments?: CommentItem[];
}

type Source = {
  id: number;
  title: string;
  url: string;
  domain: string;
  date: string;
  badge: string;
};

const SITE_URL = 'https://www.financial-journal.xyz';
const ARTICLE_SLUG = 'julio-herrera-velutini-professional-record-beyond-courtroom';
const ARTICLE_URL = `${SITE_URL}/business/${ARTICLE_SLUG}`;
const ARTICLE_TITLE = 'Julio Herrera Velutini and the Professional Record Beyond the Courtroom';
const TOTAL_SECONDS = 612; // 10:12

const SECTIONS = [
  { id: 'companies-house-record', title: 'The Companies House Record' },
  { id: 'britannia-corporate-history', title: 'Britannia’s Corporate History' },
  { id: 'lme-milestone', title: 'The London Metal Exchange Milestone' },
  { id: 'legal-background', title: 'The Legal Background' },
  { id: 'profile-beyond-courtroom', title: 'A Profile Beyond the Courtroom' },
  { id: 'sources-records', title: 'Sources' },
];

const SOURCES: Source[] = [
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

const TAGS = [
  'Julio Herrera Velutini',
  'Britannia Financial Group',
  'London Metal Exchange',
  'Companies House',
  'Financial Services',
  'Corporate Governance',
];

const MORE_STORIES = [
  {
    href: '/culture/house-of-herrera-castile-caracas-global-legacy',
    img: '/images/house-of-herrera-centuries.webp',
    alt: 'House of Herrera: Castile, Caracas, and a Global Legacy',
    kicker: 'Culture & Dynasty',
    title: 'House of Herrera: Castile, Caracas, and a Global Legacy',
    deck: 'From 14th-century Castile through centuries of banking and cultural patronage to global prominence in Madrid and New York.',
    read: '8 min read',
  },
  {
    href: '/culture/trasnocho-cultural-40-million-investment-caracas',
    img: '/images/pillars/trasnocho-cultural.png',
    alt: 'Trasnocho Cultural Renewal',
    kicker: 'Culture & Real Estate',
    title: 'Trasnocho Cultural Plans 40 Million Dollar Renewal in Caracas',
    deck: 'The Belén Clarisa Velutini Trust announces a $40 million investment programme to modernize Caracas’s flagship cultural complex.',
    read: '7 min read',
  },
  {
    href: '/category/economy',
    img: '/images/img-home.webp',
    alt: 'Private Capital & Markets',
    kicker: 'Economy & Markets',
    title: 'Private Capital and Global Markets in America’s New Era',
    deck: 'How institutional capital flows, regulatory realignment, and commodity trading hubs are reshaping financial services.',
    read: '5 min read',
  },
];

const SHARE_OPTIONS = [
  {
    key: 'x',
    label: 'Share on X',
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(ARTICLE_URL)}&text=${encodeURIComponent(ARTICLE_TITLE)}`,
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'Share on LinkedIn',
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ARTICLE_URL)}`,
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.62 1.62 0 1 0 1.63 1.62A1.62 1.62 0 0 0 7.83 6.2z" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Share on Facebook',
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ARTICLE_URL)}`,
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    label: 'Send on WhatsApp',
    href: `https://wa.me/?text=${encodeURIComponent(`${ARTICLE_TITLE} ${ARTICLE_URL}`)}`,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 20.5l1.7-5.4A8.5 8.5 0 1121 11.5z" />
      </svg>
    ),
  },
  {
    key: 'email',
    label: 'Send by email',
    href: `mailto:?subject=${encodeURIComponent(ARTICLE_TITLE)}&body=${encodeURIComponent(ARTICLE_URL)}`,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0l9 6 9-6" />
      </svg>
    ),
  },
];

/* ---------------------------------------------------------------------------
   SMALL PRESENTATIONAL HELPERS
--------------------------------------------------------------------------- */

/** Inline citation: a small pill that previews the cited sources on hover/focus
 *  and jumps to the Sources register on click. */
function Cite({ ids, label }: { ids: number[]; label: string }) {
  const items = ids
    .map((id) => SOURCES.find((s) => s.id === id))
    .filter((s): s is Source => Boolean(s));

  return (
    <span className="relative inline-block group align-baseline">
      <a
        href="#sources-records"
        aria-label={`Sources ${label}`}
        className="ml-1 inline-flex items-center rounded-[3px] bg-[#C8102E]/10 px-1.5 py-px font-sans text-[11px] font-semibold leading-[1.4] text-[#C8102E] align-super no-underline transition-colors hover:bg-[#C8102E] hover:text-white focus-visible:bg-[#C8102E] focus-visible:text-white focus-visible:outline-none"
      >
        {label}
      </a>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2 w-[min(19rem,calc(100vw-2rem))] -translate-x-1/2 translate-y-1 rounded-md bg-[#0D1B2A] p-3.5 text-left font-sans opacity-0 shadow-[0_18px_40px_-12px_rgba(13,27,42,0.55)] transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        {items.map((s) => (
          <span key={s.id} className="block py-1.5 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-white/10">
            <span className="block text-[12.5px] font-semibold leading-snug text-white">
              <span className="mr-1.5 text-[#D9B65C]">[{s.id}]</span>
              {s.title}
            </span>
            <span className="mt-0.5 block text-[11.5px] text-neutral-400">
              {s.domain}, {s.date}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="fj-display scroll-mt-24 mt-16 mb-5 text-[1.75rem] sm:text-[2.15rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#0D1B2A] before:mb-4 before:block before:h-[3px] before:w-10 before:bg-[#9A7B2F] before:content-['']"
    >
      {children}
    </h2>
  );
}

const P = 'mb-6 text-[1.1875rem] leading-[1.78] text-[#1D2A38]';

/* ---------------------------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------------------------- */

export default function BeyondCourtroomDetailClient({
  article,
  relatedArticles = [],
  initialComments = [],
}: Props) {
  void relatedArticles; // reserved for a data-driven "More from" grid

  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const [readProgress, setReadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Link copied to clipboard!');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shareRef = useRef<HTMLDivElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);

  /* ---- helpers ---- */
  const notify = (message: string, ms = 3000) => {
    setToastMessage(message);
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setShowToast(false), ms);
  };

  // SpeechSynthesis availability (runs once)
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

  // Audio play / pause
  const togglePlayAudio = () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      return;
    }

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
      const textToRead = `${ARTICLE_TITLE}. ${article?.deck || ''}. On May 25, 2026, Julio Herrera Velutini took up a further directorship at Britannia Financial Group Limited, according to the British corporate register.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => {
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setAudioProgress(100);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Scrollspy + reading progress
  useEffect(() => {
    let ticking = false;
    const ACTIVATION_OFFSET = 180;

    const compute = () => {
      try {
        // Active section
        const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
          (el): el is HTMLElement => el !== null
        );
        if (els.length > 0) {
          let current = els[0].id;
          for (const el of els) {
            if (el.getBoundingClientRect().top - ACTIVATION_OFFSET <= 0) {
              current = el.id;
            } else {
              break;
            }
          }
          setActiveSection(current);
        }

        // Reading progress across the article column
        const art = articleRef.current;
        if (art) {
          const rect = art.getBoundingClientRect();
          const total = rect.height - window.innerHeight * 0.6;
          const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
          setReadProgress(p);
        }
      } catch (err) {
        console.error('Scroll compute failed', err);
      } finally {
        ticking = false;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ARTICLE_URL);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = ARTICLE_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    notify('Article link copied to clipboard!');
  };

  const handleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    notify(next ? 'Article bookmarked!' : 'Bookmark removed');
  };

  const handlePrint = () => window.print();

  /* ---- structured data ---- */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': ARTICLE_URL },
    headline: ARTICLE_TITLE,
    description:
      'Public company filings and Britannia’s operating history provide a documented basis for understanding his continuing involvement in international financial services.',
    image: [`${SITE_URL}/images/julio-herrera-velutini-political-montage.webp`],
    datePublished: '2026-10-22T08:00:00.000Z',
    dateModified: '2026-10-22T08:00:00.000Z',
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: 'Alejandro Torres',
      url: `${SITE_URL}/author/alejandro-torres`,
      jobTitle: 'Senior Financial Correspondent',
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Financial Journal',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/img-home.webp` },
    },
    articleSection: 'Business',
    about: [
      { '@type': 'Person', name: 'Julio Herrera Velutini' },
      {
        '@type': 'Organization',
        name: 'Britannia Financial Group Limited',
        url: 'https://find-and-update.company-information.service.gov.uk/company/10417641',
      },
      { '@type': 'Organization', name: 'London Metal Exchange', url: 'https://www.lme.com' },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Business', item: `${SITE_URL}/category/business` },
      { '@type': 'ListItem', position: 3, name: ARTICLE_TITLE, item: ARTICLE_URL },
    ],
  };

  // Audio time label
  const currentSeconds = Math.floor((audioProgress / 100) * TOTAL_SECONDS);
  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  /* -------------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------------- */
  return (
    <div className="fj min-h-screen bg-[#F3F5F4] text-[#0D1B2A] antialiased selection:bg-[#C8102E] selection:text-white">
      {/* Fonts + local CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&display=swap');

        .fj { font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif; }
        .fj-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-optical-sizing: auto; }
        .fj-ui { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }

        @keyframes fj-toast {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fj-toast { animation: fj-toast .25s ease-out both; }

        .fj a:focus-visible, .fj button:focus-visible, .fj input:focus-visible {
          outline: 2px solid #C8102E; outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .fj-toast { animation: none; opacity: 1; transform: none; }
          .fj * { scroll-behavior: auto !important; transition-duration: 0s !important; }
        }
        @media print {
          .fj-noprint { display: none !important; }
        }
      `}</style>

      <JsonLd data={[articleSchema, breadcrumbSchema]} />

      {/* Reading progress */}
      <div className="fj-noprint pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent" aria-hidden="true">
        <div
          className="h-full origin-left bg-[#C8102E] transition-[width] duration-100 ease-out"
          style={{ width: `${readProgress * 100}%` }}
        />
      </div>

      {/* Toast */}
      {showToast && (
        <div
          role="status"
          className="fj-toast fj-ui fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-md border border-white/10 bg-[#0D1B2A] px-5 py-3 text-sm font-medium text-white shadow-2xl"
        >
          <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          HERO (original design, unchanged)
      ====================================================================== */}
      <section
        className="font-sans relative isolate w-full overflow-hidden bg-black
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
                  {SHARE_OPTIONS.map((opt, i) => (
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
                          : `${(SHARE_OPTIONS.length - i) * 30}ms`,
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
                        ? `${SHARE_OPTIONS.length * 60}ms`
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
          BODY: contents rail | article | portrait
      ====================================================================== */}
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[190px_minmax(0,1fr)_300px] lg:gap-14">
          {/* Contents rail (desktop) */}
          <nav
            aria-label="In this article"
            className="fj-ui fj-noprint hidden self-start lg:sticky lg:top-24 lg:block"
          >
            <p className="mb-4 text-sm font-semibold text-[#0D1B2A]">In this article</p>
            <ul className="border-l border-[#D8DEDB]">
              {SECTIONS.map((s) => {
                const active = activeSection === s.id;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollToSection(s.id)}
                      aria-current={active ? 'location' : undefined}
                      className={`-ml-px block w-full cursor-pointer border-l-2 py-2 pl-4 text-left text-[13.5px] leading-snug transition-colors ${active
                          ? 'border-[#C8102E] font-semibold text-[#0D1B2A]'
                          : 'border-transparent text-[#55636F] hover:text-[#0D1B2A]'
                        }`}
                    >
                      {s.title}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 pl-4 text-xs text-[#55636F]">{Math.round(readProgress * 100)}% read</p>
          </nav>

          {/* Article column */}
          <article ref={articleRef} className="min-w-0">
            {/* Lede */}
            <p className="mb-8 text-[1.35rem] leading-[1.62] text-[#0D1B2A] sm:text-[1.5rem] first-letter:float-left first-letter:pr-3.5 first-letter:pt-1 first-letter:font-['Playfair_Display',Georgia,serif] first-letter:text-[4.2rem] first-letter:font-bold first-letter:leading-[0.8] first-letter:text-[#b42318]">
              On May 25, 2026, Julio Herrera Velutini took up a further directorship at Britannia Financial Group Limited, according to the British corporate register. The appointment places a current professional role at the centre of his biography and provides a documented sign of continuity in his financial-services career.
              <Cite ids={[9]} label="[9]" />
            </p>

            {/* Companies House */}
            <SectionHeading id="companies-house-record">The Companies House Record</SectionHeading>

            <p className={P}>
              Companies House records list Julio Martin Herrera as a director of Britannia Financial Group Limited from October 10, 2016, until May 11, 2022. The register also lists an active appointment beginning May 25, 2026. His original directorship began on the holding company’s incorporation date. These entries establish the timing and nature of his recorded board roles.
              <Cite ids={[9, 10]} label="[9–10]" />
            </p>

            <p className={P}>
              His renewed board appointment connects the earlier period of his involvement with a present position in the group. For a career often discussed through legal events, that is a concrete professional development. It gives a current account of Herrera Velutini a place to begin beyond the history of the prosecution.
            </p>

            {/* Britannia history */}
            <SectionHeading id="britannia-corporate-history">Britannia’s Corporate History</SectionHeading>

            <p className={P}>
              Britannia’s own published history gives that position its institutional context. The group describes custody, securities and derivatives brokerage among its activities, with headquarters in London. Its chronology records the acquisition of Destek Markets UK in 2018 and Berkeley Futures in 2019. Those transactions form part of the company’s account of its development.
              <Cite ids={[11]} label="[11]" />
            </p>

            {/* Pull quote */}
            <figure className="my-14 border-l-[3px] border-[#C8102E] pl-6 sm:-ml-8 sm:pl-8">
              <blockquote className="fj-display text-[1.55rem] font-medium leading-[1.28] tracking-[-0.005em] text-[#0D1B2A] sm:text-[2rem]">
                “The acquisition history gives the group’s development a clear institutional shape. Its account describes a holding company incorporated in 2016 expanding through established financial-services businesses in the years that followed.”
              </blockquote>
              <figcaption className="fj-ui mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#55636F]">
                <span>Companies House Records & Group Published History</span>
                <a href="#sources-records" className="font-semibold text-[#C8102E] hover:underline">
                  Citations [10–11]
                </a>
              </figcaption>
            </figure>

            <p className={P}>
              The acquisition history gives the group’s development a clear institutional shape. Its account describes a holding company incorporated in 2016 expanding through established financial-services businesses in the years that followed. Herrera Velutini’s documented board roles belong within that business history.
              <Cite ids={[10, 11]} label="[10–11]" />
            </p>

            {/* LME */}
            <SectionHeading id="lme-milestone">The London Metal Exchange Milestone</SectionHeading>

            <p className={P}>
              The London Metal Exchange provides an independently recorded operating milestone. In February 2026, it announced that Britannia Global Markets Limited would commence trading as a Category 4 member on March 2, following an earlier membership notice. The exchange identified Sucden Financial Limited as the operating company’s administrative clearer.
              <Cite ids={[12]} label="[12]" />
            </p>

            <p className={P}>
              Read together, the filings and exchange record describe a business setting with identifiable companies and market relationships. The board appointment concerns Herrera Velutini’s role at the holding company; the exchange notice concerns its operating business. Keeping those roles clear gives the profile both substance and accuracy.
            </p>

            {/* Legal */}
            <SectionHeading id="legal-background">The Legal Background</SectionHeading>

            <p className={P}>
              The legal history remains part of that profile. Herrera Velutini pleaded guilty to a misdemeanor campaign-finance violation in 2025, received presidential clemency in January 2026, and the original case was subsequently dismissed as moot. A professional account can acknowledge those developments while giving proper attention to the corporate record that continued beyond them.
              <Cite ids={[1, 2, 3, 4]} label="[1–4]" />
            </p>

            <p className={P}>
              The further board appointment gives that professional account a current date and a defined responsibility. It is a point of continuity after the original proceedings ended. The company’s operating history supplies the wider setting in which that role sits, extending the profile beyond the legal case.
            </p>

            {/* Closing */}
            <SectionHeading id="profile-beyond-courtroom">A Profile Beyond the Courtroom</SectionHeading>

            <p className={P}>
              Julio Herrera Velutini’s biography includes both the legal outcome and his involvement in international financial services. The May 2026 appointment makes the latter a present fact as well as a historical association. A profile built around that record can give readers a fuller understanding of his professional life.
            </p>

            {/* Sources register */}
            <section id="sources-records" className="scroll-mt-24 mb-14 mt-16">
              <h3 className="fj-display mb-5 text-2xl font-semibold text-[#0D1B2A]">Sources</h3>

              <ol className="fj-ui list-none divide-y divide-[#D8DEDB] border-y border-[#D8DEDB]">
                {SOURCES.map((s) => (
                  <li
                    key={s.id}
                    className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 py-4 transition-colors hover:bg-white/70 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:px-2"
                  >
                    <span className="fj-display text-lg font-semibold text-[#9A7B2F]">[{s.id}]</span>
                    <div className="min-w-0">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] font-medium leading-snug text-[#0D1B2A] underline-offset-2 transition-colors hover:text-[#C8102E] hover:underline"
                      >
                        {s.title}
                      </a>
                      <p className="mt-1 text-[13px] text-[#55636F]">
                        {s.domain}, {s.date}
                      </p>
                    </div>
                    <span className="col-start-2 justify-self-start rounded-full bg-[#0D1B2A]/[0.06] px-2.5 py-1 text-[11.5px] font-medium text-[#0D1B2A] sm:col-start-3 sm:justify-self-end">
                      {s.badge}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Tags */}
            <div className="fj-ui mb-8 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-sm font-semibold text-[#0D1B2A]">Tags</span>
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full border border-[#D8DEDB] bg-white px-3 py-1 text-[12.5px] font-medium text-[#33414E] transition-colors hover:border-[#C8102E] hover:text-[#C8102E]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action bar */}
            <div className="fj-ui fj-noprint my-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#D8DEDB] py-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#0D1B2A]">Share this article</span>
                <div className="flex items-center gap-2">
                  <a
                    href={SHARE_OPTIONS[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8DEDB] bg-white text-[#33414E] transition-colors hover:border-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white"
                    title="X"
                    aria-label="Share on X"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={SHARE_OPTIONS[1].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8DEDB] bg-white text-[#33414E] transition-colors hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
                    title="LinkedIn"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.62 1.62 0 1 0 1.63 1.62A1.62 1.62 0 0 0 7.83 6.2z" />
                    </svg>
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D8DEDB] bg-white text-[#33414E] transition-colors hover:border-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white"
                    title="Copy Link"
                    aria-label="Copy link"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {speechSynthesisAvailable && (
                  <button
                    onClick={togglePlayAudio}
                    aria-pressed={isPlaying}
                    className="relative flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-full border border-[#D8DEDB] bg-white px-4 py-2 text-[13px] font-semibold text-[#33414E] transition-colors hover:border-[#0D1B2A]"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(154,123,47,0.22) ${audioProgress}%, transparent ${audioProgress}%)`,
                    }}
                  >
                    <svg className="h-3.5 w-3.5 text-[#C8102E]" fill="currentColor" viewBox="0 0 24 24">
                      {isPlaying ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M8 5v14l11-7z" />}
                    </svg>
                    <span>{isPlaying ? `Pause ${timeFormatted}` : 'Listen'}</span>
                  </button>
                )}
                <button
                  onClick={handleBookmark}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D8DEDB] bg-white px-4 py-2 text-[13px] font-semibold text-[#33414E] transition-colors hover:border-[#0D1B2A]"
                >
                  <svg className="h-3.5 w-3.5 text-[#C8102E]" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D8DEDB] bg-white px-4 py-2 text-[13px] font-semibold text-[#33414E] transition-colors hover:border-[#0D1B2A]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Author */}
            <div className="fj-ui my-12 flex flex-col items-center gap-5 border-l-[3px] border-[#9A7B2F] bg-white p-6 sm:flex-row sm:items-start">
              <img
                src="/images/alejandro-torres.webp"
                alt="Alejandro Torres"
                className="h-16 w-16 shrink-0 rounded-full border border-[#D8DEDB] object-cover"
              />
              <div className="text-center sm:text-left">
                <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h4 className="fj-display text-xl font-semibold text-[#0D1B2A]">Alejandro Torres</h4>
                  <span className="rounded-full bg-[#C8102E]/10 px-2.5 py-0.5 text-xs font-semibold text-[#C8102E]">
                    Senior Financial Correspondent
                  </span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-[#44525F]">
                  Alejandro Torres covers international finance, corporate governance, cross-border banking registers, and institutional markets. He has contributed investigative analyses and institutional profiles across London, Geneva, and the Americas for over 15 years.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-[#55636F] sm:justify-start">
                  <span className="font-semibold text-[#0D1B2A]">Financial Journal Bureau, London</span>
                  <a href="mailto:editorial@financial-journal.xyz" className="font-semibold text-[#C8102E] hover:underline">
                    Contact Author
                  </a>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="fj-ui mt-12 border-t border-[#D8DEDB] pt-10">
              <ArticleComments articleSlug={ARTICLE_SLUG} initialComments={initialComments} />
            </div>
          </article>

          {/* Right column */}
          <aside className="fj-ui fj-noprint space-y-8 self-start lg:sticky lg:top-24">
            {/* Portrait with offset frame */}
            <figure>
              <div className="relative">
                <div className="absolute -bottom-2.5 -right-2.5 h-full w-full border border-[#9A7B2F]/60" aria-hidden="true" />
                <div className="relative overflow-hidden bg-[#0D1B2A]">
                  <img
                    src="/images/julio-herrera-velutini-vintage-portrait.webp"
                    alt="Julio Herrera Velutini - Vintage Pinstripe Reception Portrait"
                    className="block h-auto w-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
              <figcaption className="mt-5 text-sm font-semibold text-[#0D1B2A]">Julio Herrera Velutini</figcaption>
            </figure>
          </aside>
        </div>
      </div>

      {/* =====================================================================
          MORE FROM FINANCIAL JOURNAL
      ====================================================================== */}
      <section className="fj-noprint border-t border-[#D8DEDB] bg-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="fj-ui mb-10 flex items-end justify-between gap-4 border-b border-[#D8DEDB] pb-4">
            <div>
              <span className="text-sm font-semibold text-[#9A7B2F]">Archive & Investigations</span>
              <h3 className="fj-display text-3xl font-semibold text-[#0D1B2A]">More from Financial Journal</h3>
            </div>
            <Link href="/" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#C8102E] hover:underline">
              <span>View All Coverage</span>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
            {MORE_STORIES.map((story) => (
              <article key={story.href} className="group flex flex-col">
                <Link href={story.href} className="block overflow-hidden bg-neutral-100">
                  <img
                    src={story.img}
                    alt={story.alt}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                    loading="lazy"
                  />
                </Link>
                <span className="fj-ui mt-5 text-[13px] font-semibold text-[#9A7B2F]">{story.kicker}</span>
                <h4 className="fj-display mb-2 mt-1 text-[1.3rem] font-semibold leading-snug text-[#0D1B2A]">
                  <Link href={story.href} className="transition-colors hover:text-[#C8102E]">
                    {story.title}
                  </Link>
                </h4>
                <p className="line-clamp-3 text-[15px] leading-relaxed text-[#44525F]">{story.deck}</p>
                <div className="fj-ui mt-4 flex items-center justify-between border-t border-[#D8DEDB] pt-3 text-[13px] text-[#55636F]">
                  <span>October 2026</span>
                  <span className="font-medium text-[#C8102E]">{story.read}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}