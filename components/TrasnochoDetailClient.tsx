'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import JsonLd from './JsonLd';
import ArticleComments from '../app/[category]/[slug]/ArticleComments';
import { CommentItem, Article } from '@/lib/db';

interface Props {
  relatedArticles?: Article[];
  initialComments?: CommentItem[];
}

export default function TrasnochoDetailClient({
  relatedArticles = [],
  initialComments = [],
}: Props) {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [showToast, setShowToast] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const siteUrl = 'https://www.financial-journal.xyz';
  const articleSlug = 'trasnocho-cultural-40-million-investment-caracas';
  const articleUrl = `${siteUrl}/culture/${articleSlug}`;
  const articleTitle = 'Trasnocho Cultural Plans 40 Million Dollar Renewal in Caracas';

  const sections = [
    { id: 'overview', title: 'Capital Commitment & Scope' },
    { id: 'investment-support', title: 'What the Investment Will Support' },
    { id: 'destination-hub', title: 'Culture & Hospitality Destination' },
    { id: 'hotel-renovation', title: 'Paseo Las Mercedes & Jimmy Alcock' },
    { id: 'cultural-legacy', title: "Belén Clarisa Velutini's Legacy" },
    { id: 'foundation-initiatives', title: 'Foundation Social Initiatives' },
    { id: 'changing-outlook', title: 'Private Investment & Macro Outlook' },
    { id: 'faqs', title: 'Frequently Asked Questions' },
    { id: 'sources', title: 'Sources & Reference Links' },
  ];

  const faqs = [
    {
      q: 'How much investment has been announced for Trasnocho Cultural?',
      a: 'Representatives of the Belén Clarisa Velutini Trust announced an estimated US$40 million private investment programme over the next 36 months.',
    },
    {
      q: 'What will the investment cover?',
      a: 'The announced priorities include operational infrastructure improvements, technological upgrades to cinema and theatre facilities, renovation of the Paseo Las Mercedes hotel and cultural programming aimed at younger audiences.',
    },
    {
      q: 'Who was Belén Clarisa Velutini?',
      a: 'The announcement identifies Belén Clarisa Velutini as the founder of Trasnocho Cultural and a private patron of Venezuelan culture. The investment and foundation initiatives are intended to continue her cultural and social legacy.',
    },
    {
      q: 'Is a Miami development confirmed?',
      a: 'The announcement mentions discussions about initiatives in Miami inspired by Trasnocho Cultural. It does not announce a confirmed Miami project.',
    },
  ];

  // Scrollspy effect
  useEffect(() => {
    let ticking = false;
    const ACTIVATION_OFFSET = 160;

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

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = articleUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const iconBtn =
    'inline-flex items-center justify-center w-[34px] h-[34px] rounded-full border border-red-200 text-red-800 transition-all duration-150 hover:bg-red-700 hover:text-white hover:border-red-700 cursor-pointer shadow-xs';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: 'Trasnocho Cultural Plans 40 Million Dollar Renewal in Caracas',
    description:
      'The Belén Clarisa Velutini Trust announces a $40 million, 36-month plan to modernize Trasnocho Cultural and renovate Paseo Las Mercedes hotel in Caracas.',
    image: [`${siteUrl}/images/pillars/trasnocho-cultural.png`],
    datePublished: '2026-10-09T08:00:00.000Z',
    dateModified: '2026-10-09T08:00:00.000Z',
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: 'Editorial Staff',
      url: `${siteUrl}/about`,
      jobTitle: 'Senior Cultural Historian',
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
    articleSection: 'Culture',
    about: [
      {
        '@type': 'Organization',
        name: 'Trasnocho Cultural',
        url: 'https://www.trasnochocultural.com/',
      },
      {
        '@type': 'Person',
        name: 'Belén Clarisa Velutini',
      },
    ],
    citation: [
      'https://www.prnewswire.com/news-releases/us40-million-private-investment-backs-cultural-and-urban-renewal-in-a-changing-venezuela-302903192.html',
      'https://www.reuters.com/world/americas/idb-drafts-two-year-venezuela-plan-says-electricity-social-needs-are-key-2026-09-21/',
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
        name: 'Culture',
        item: `${siteUrl}/category/culture`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: articleTitle,
        item: articleUrl,
      },
    ],
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-sans antialiased text-[#262626]">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Article link copied to clipboard!</span>
        </div>
      )}

      {/* ================= HERO HEADER ================= */}
      <div className="relative w-full min-h-[480px] md:min-h-[580px] overflow-hidden flex flex-col justify-end">
        {/* Background Banner Image */}
        <img
          src="/images/pillars/trasnocho-cultural.png"
          alt="Trasnocho Cultural complex Caracas"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Sophisticated Multi-stop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

        <div className="relative z-10 max-w-[1180px] w-full mx-auto px-4 md:px-6 pt-20 pb-10 md:pb-14">
          {/* Breadcrumb & Category */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Link
              href="/category/culture"
              className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase px-3.5 py-1.5 rounded-full shadow-md transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Culture
            </Link>
            <span className="text-white/50 text-xs hidden sm:inline">|</span>
            <span className="text-white/80 text-xs hidden sm:inline tracking-wider uppercase font-medium">
              Arts &amp; Urban Renewal
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-['Playfair_Display',Georgia,serif] text-white font-bold leading-[1.12] text-3xl sm:text-4xl md:text-[3.25rem] max-w-4xl mb-4 drop-shadow-sm">
            Trasnocho Cultural Plans 40 Million Dollar Renewal in Caracas
          </h1>

          {/* Standfirst / Deck */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mb-7 font-light drop-shadow-xs">
            The Belén Clarisa Velutini Trust has announced an estimated US$40 million investment over 36 months to modernize the Caracas cultural complex and renovate the Paseo Las Mercedes hotel.
          </p>

          {/* Metadata + Floating Stats Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5">
            <div className="flex items-center gap-3 text-white/90 text-xs sm:text-sm">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Editorial Staff"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-xs"
              />
              <div>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  Editorial Staff
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-bold" title="Verified Journalist">
                    ✓
                  </span>
                </p>
                <p className="text-[11px] text-white/70">Senior Cultural Historian</p>
              </div>
              <span className="text-white/40 hidden sm:inline">&bull;</span>
              <span className="text-white/80 hidden sm:inline">October 9, 2026</span>
              <span className="text-white/40 hidden sm:inline">&bull;</span>
              <span className="text-white/80 hidden sm:inline">6 min read</span>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-white text-right">
                <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">Investment</p>
                <p className="text-sm font-bold text-white">US$40 Million</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-white text-right">
                <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">Horizon</p>
                <p className="text-sm font-bold text-white">36 Months</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-[1fr_310px] gap-8 lg:gap-12 items-start">

          {/* ================= LEFT: ARTICLE CONTENT ================= */}
          <article className="min-w-0">

            {/* Chapter 1 / Overview */}
            <section id="overview" className="scroll-mt-24 mb-10">
              <div className="text-[1.02rem] leading-[1.85] text-[#2c2c2c]">
                <p className="mb-5 text-[1.05rem] leading-[1.85] first-letter:font-['Playfair_Display',Georgia,serif] first-letter:text-[3.6rem] first-letter:leading-[0.8] first-letter:font-bold first-letter:text-red-800 first-letter:float-left first-letter:pr-3 first-letter:pt-1">
                  <strong>CARACAS, Venezuela —</strong> Trasnocho Cultural is set for a new chapter under an estimated <strong>US$40 million private investment plan</strong> announced by representatives of the <strong>Belén Clarisa Velutini Trust</strong>. The programme, planned over the next 36 months, brings together cultural infrastructure upgrades and a major hotel renovation, with the stated aim of preserving the founder’s legacy while improving the experience for a new generation of visitors.
                </p>

                <p className="mb-5">
                  The October 9, 2026{' '}
                  <a
                    href="https://www.prnewswire.com/news-releases/us40-million-private-investment-backs-cultural-and-urban-renewal-in-a-changing-venezuela-302903192.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-700 hover:text-red-900 font-semibold underline decoration-red-700/40 hover:decoration-red-700 transition-colors"
                  >
                    announcement, issued by MP Publishing through PR Newswire
                  </a>
                  , places one of Caracas’s established cultural destinations at the centre of a broader renewal of the surrounding complex. It links investment in cinema and theatre facilities with hospitality, dining, retail and public-facing cultural activity.
                </p>

                <p className="mb-5">
                  Jorge Kiriakidis of KLMC Legal, who represents the Herrera Velutini family trust that owns the complex, said the investment programme had begun with operational infrastructure improvements and technological upgrades to the cinema and theatre facilities.
                </p>
              </div>

              {/* Quotation Box: Jorge Kiriakidis */}
              <div className="my-7 bg-gradient-to-r from-[#fbf7f0] to-[#fffdfa] border-l-4 border-red-700 rounded-r-xl p-5 md:p-6 shadow-xs">
                <svg className="w-8 h-8 text-red-700/30 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-['Playfair_Display',Georgia,serif] text-base md:text-lg text-[#1a1a1a] italic leading-relaxed mb-3">
                  “The planned investment began with a comprehensive renovation of the operational infrastructure and technological upgrades to the cinema and theater facilities.”
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-red-700" />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Jorge Kiriakidis, KLMC Legal
                  </span>
                  <span className="text-xs text-gray-500">· Herrera Velutini Family Trust</span>
                </div>
              </div>
            </section>

            {/* Section 2: What the investment will support */}
            <section id="investment-support" className="scroll-mt-24 mb-10 border-t border-[#ede7df] pt-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] font-bold text-2xl md:text-[1.85rem] text-[#1a1a1a] mb-4">
                What the Trasnocho Cultural investment will support
              </h2>

              <div className="text-[1.02rem] leading-[1.85] text-[#2c2c2c] space-y-4">
                <p>
                  The proposed investment covers several connected priorities: modernizing the cultural facilities, upgrading the complex’s infrastructure and renovating the Paseo Las Mercedes hotel. Representatives also intend to broaden the cultural offering, particularly for younger audiences.
                </p>

                <p>
                  Kiriakidis described the challenge as improving the spaces, preserving the cultural legacy and creating a more welcoming, contemporary experience. He also emphasized the Herrera Velutini family’s commitment to keeping the Trasnocho model operational.
                </p>

                <p>
                  The US$40 million figure is an estimate for the planned programme over 36 months. It describes the announced investment ambition rather than money already spent.
                </p>
              </div>

              {/* Visual Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-7">
                <div className="bg-white border border-[#eee] rounded-xl p-4 shadow-2xs hover:border-red-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#f5efe5] text-[#1a1a1a] border border-[#e0d9cd] font-['Playfair_Display',Georgia,serif] flex items-center justify-center font-bold text-xs mb-3">
                    01
                  </div>
                  <h3 className="font-['Playfair_Display',Georgia,serif] font-bold text-sm text-[#1a1a1a] mb-1.5">Cultural Upgrades</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Technological modernization of cinema and theater venues to enrich visitor immersion and accommodate cutting-edge productions.
                  </p>
                </div>
                <div className="bg-white border border-[#eee] rounded-xl p-4 shadow-2xs hover:border-red-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#f5efe5] text-[#1a1a1a] border border-[#e0d9cd] font-['Playfair_Display',Georgia,serif] flex items-center justify-center font-bold text-xs mb-3">
                    02
                  </div>
                  <h3 className="font-['Playfair_Display',Georgia,serif] font-bold text-sm text-[#1a1a1a] mb-1.5">Hotel Renovation</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Ambitious refurbishment of Paseo Las Mercedes hotel preserving Jimmy Alcock’s architecture into southeastern Caracas luxury.
                  </p>
                </div>
                <div className="bg-white border border-[#eee] rounded-xl p-4 shadow-2xs hover:border-red-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#f5efe5] text-[#1a1a1a] border border-[#e0d9cd] font-['Playfair_Display',Georgia,serif] flex items-center justify-center font-bold text-xs mb-3">
                    03
                  </div>
                  <h3 className="font-['Playfair_Display',Georgia,serif] font-bold text-sm text-[#1a1a1a] mb-1.5">Youth Programming</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Expanding programming to captivate younger generations and integrate dining, commerce, and contemporary arts.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Culture & Hospitality destination */}
            <section id="destination-hub" className="scroll-mt-24 mb-10 border-t border-[#ede7df] pt-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] font-bold text-2xl md:text-[1.85rem] text-[#1a1a1a] mb-4">
                A Caracas destination combining culture and hospitality
              </h2>

              <div className="text-[1.02rem] leading-[1.85] text-[#2c2c2c] space-y-4">
                <p>
                  The announcement describes an urban hub bringing together <strong>Trasnocho Cultural, the Paseo Las Mercedes hotel and Trasnocho Mall</strong>. Its model combines cultural activity with entertainment, restaurants, shopping and accommodation.
                </p>

                <p>
                  Over 25 years of operation, the concept has developed around the relationship between those uses. A visit can extend beyond a film or a play into dining, shopping or a stay within the wider complex.
                </p>

                <p>
                  According to the announcement, international cultural managers and industry professionals have shown interest in the model. Discussions have also taken place in Miami about initiatives inspired by the Caracas concept. Those discussions are described as possibilities, rather than an announced development outside Venezuela.
                </p>
              </div>

              {/* Informational Callout Box */}
              <div className="my-6 bg-[#fff5f3] border border-[#f2d9d5] rounded-md p-4 flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 w-5 h-5 mt-[1px] rounded-full border-2 border-[#b42318] flex items-center justify-center"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="w-2.5 h-2.5 text-[#b42318]">
                    <circle cx="10" cy="6.2" r="1.1" fill="currentColor" />
                    <rect x="9.2" y="9" width="1.6" height="6" rx="0.8" fill="currentColor" />
                  </svg>
                </span>
                <div>
                  <h4 className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-0.5">
                    The 25-Year Integrated Hub Model
                  </h4>
                  <p className="text-[12px] leading-[1.5] text-[#555]">
                    By combining theatrical stages, art-house cinemas, gourmet dining, retail boutiques, and hotel hospitality in a single walkable sanctuary, Trasnocho established an internationally recognized civic model in Caracas.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Hotel renovation & Jimmy Alcock */}
            <section id="hotel-renovation" className="scroll-mt-24 mb-10 border-t border-[#ede7df] pt-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] font-bold text-2xl md:text-[1.85rem] text-[#1a1a1a] mb-4">
                Paseo Las Mercedes hotel renovation will preserve Jimmy Alcock’s design
              </h2>

              <div className="text-[1.02rem] leading-[1.85] text-[#2c2c2c] space-y-4">
                <p>
                  The next phase centres on an ambitious renovation of the <strong>Paseo Las Mercedes hotel</strong>. The project’s representatives expect the redevelopment to position it among the most modern and luxurious hotels in southeastern Caracas.
                </p>

                <p>
                  Kiriakidis said the new design would preserve the original architectural lines created by Venezuelan architect <strong>Jimmy Alcock</strong>. He described the architecture as culturally significant because of its contribution to the country’s architectural and urban heritage.
                </p>

                <p>
                  Preserving those lines gives the hotel renovation a particular character. The stated approach combines modernization with continuity, retaining the original design while adapting the property for contemporary hospitality.
                </p>
              </div>

              {/* Architectural Feature Card: Jimmy Alcock */}
              <div className="my-7 border border-[#eee] rounded-xl bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xs">
                <div className="w-[150px] sm:w-[170px] h-[210px] flex-shrink-0 overflow-hidden rounded-lg border border-[#eee] bg-[#f4f1ea]">
                  <img
                    src="/images/jimmy-alcock.jpg"
                    alt="Jimmy Alcock - Venezuelan Architect"
                    className="w-full h-full object-cover contrast-[1.05]"
                  />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-red-800 mb-1">
                    Master Architect &bull; National Architecture Prize
                  </p>
                  <h3 className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#1a1a1a] mb-0.5">
                    Jimmy Alcock
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 italic">
                    Architectural Creator of the Paseo Las Mercedes Complex
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Renowned for his dialogue between tropical light, concrete structural clarity, and urban functionality, Alcock shaped landmark Venezuelan works including the Poliedro de Caracas and the Paseo Las Mercedes complex. The renewal programme ensures that the hotel renovation honors his original modernist architectural lines.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Belén Clarisa Velutini legacy */}
            <section id="cultural-legacy" className="scroll-mt-24 mb-10 border-t border-[#ede7df] pt-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] font-bold text-2xl md:text-[1.85rem] text-[#1a1a1a] mb-4">
                Belén Clarisa Velutini’s cultural legacy
              </h2>

              {/* Founder Profile Card */}
              <div className="my-6 border border-[#eee] rounded-xl bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xs">
                <div className="w-[150px] sm:w-[170px] h-[190px] flex-shrink-0 overflow-hidden rounded-lg border border-[#eee] bg-[#f4f1ea]">
                  <img
                    src="/images/belen-clarisa-velutini-perez-matos.webp"
                    alt="Belén Clarisa Velutini"
                    className="w-full h-full object-cover sepia-[0.15] contrast-[1.05]"
                  />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-red-800 mb-1">
                    Founder &bull; Cultural Patron
                  </p>
                  <h3 className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#1a1a1a] mb-0.5">
                    Belén Clarisa Velutini
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 italic">
                    Founding Force behind Trasnocho Cultural
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    An international entrepreneur, banker, investor, and arts patron from the renowned Venezuelan banking lineage, who dedicated herself to creating lasting sanctuaries for national artistic expression.
                  </p>
                </div>
              </div>

              <div className="text-[1.02rem] leading-[1.85] text-[#2c2c2c] space-y-4">
                <p>
                  At the heart of the project is <strong>Belén Clarisa Velutini</strong>, the founder of Trasnocho Cultural and the cultural patron whose trust announced the investment.
                </p>

                <p>
                  The release presents the programme as a continuation of her support for Venezuelan cultural life. It also describes her as an international entrepreneur, banker and investor from a family closely associated with the country’s financial development.
                </p>

                <p>
                  For the representatives overseeing the initiative, preserving that legacy involves maintaining a working institution: venues that can host cultural activity, facilities suited to contemporary audiences and programming that can attract younger generations.
                </p>
              </div>
            </section>

            {/* Section 6: Foundation social initiatives */}
            <section id="foundation-initiatives" className="scroll-mt-24 mb-10 border-t border-[#ede7df] pt-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] font-bold text-2xl md:text-[1.85rem] text-[#1a1a1a] mb-4">
                Foundation initiatives will extend her social work
              </h2>

              <div className="text-[1.02rem] leading-[1.85] text-[#2c2c2c] space-y-4">
                <p>
                  The family’s plans also include expanding social initiatives through a foundation bearing Belén Clarisa Velutini’s name.
                </p>

                <p>
                  <strong>Melanie de Herrera Velutini</strong>, identified in the announcement as the foundation’s president, said its work would focus on children’s education and development, civic education, humanitarian support and cultural initiatives.
                </p>
              </div>

              {/* Quote Card: Melanie de Herrera Velutini */}
              <div className="my-7 bg-gradient-to-r from-[#fbf7f0] to-[#fffdfa] border-l-4 border-red-700 rounded-r-xl p-5 md:p-6 shadow-xs">
                <svg className="w-8 h-8 text-red-700/30 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-['Playfair_Display',Georgia,serif] text-base md:text-lg text-[#1a1a1a] italic leading-relaxed mb-3">
                  “She also carried out numerous social initiatives that we are now expanding through a foundation bearing her name.”
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-red-700" />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Melanie de Herrera Velutini
                  </span>
                  <span className="text-xs text-gray-500">· President, Belén Clarisa Velutini Foundation</span>
                </div>
              </div>

              <div className="text-[1.02rem] leading-[1.85] text-[#2c2c2c]">
                <p>
                  These priorities extend the legacy beyond the renovation programme. Alongside investment in physical spaces, the foundation intends to support educational and humanitarian work associated with the founder’s broader social commitments.
                </p>
              </div>
            </section>

            {/* Section 7: Changing outlook */}
            <section id="changing-outlook" className="scroll-mt-24 mb-10 border-t border-[#ede7df] pt-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] font-bold text-2xl md:text-[1.85rem] text-[#1a1a1a] mb-4">
                Private cultural investment amid Venezuela’s changing outlook
              </h2>

              <div className="text-[1.02rem] leading-[1.85] text-[#2c2c2c] space-y-4">
                <p>
                  The project arrives as institutions reassess Venezuela.{' '}
                  <a
                    href="https://www.reuters.com/world/americas/idb-drafts-two-year-venezuela-plan-says-electricity-social-needs-are-key-2026-09-21/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-700 hover:text-red-900 font-semibold underline decoration-red-700/40 hover:decoration-red-700 transition-colors"
                  >
                    Reuters reported in September
                  </a>{' '}
                  that the Inter-American Development Bank was preparing a two-year engagement plan addressing electricity and social protection. Its president described planning still under way, without a timetable for new financing.
                </p>

                <p>
                  Against that backdrop, the Trasnocho Cultural announcement sets out a specific private investment proposal with a defined estimate, a 36-month horizon and identified areas of work.
                </p>

                <p>
                  Its next phase will focus on the hotel, alongside the cultural infrastructure improvements described by the trust’s representatives. The stated goal is to carry Belén Clarisa Velutini’s legacy forward through a renewed Caracas destination that continues to bring culture, hospitality and everyday city life together.
                </p>
              </div>
            </section>

            {/* Section 8: Frequently asked questions */}
            <section id="faqs" className="scroll-mt-24 mb-10 border-t border-[#ede7df] pt-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-['Playfair_Display',Georgia,serif] font-bold text-2xl md:text-[1.85rem] text-[#1a1a1a]">
                  Frequently asked questions
                </h2>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Q&amp;A
                </span>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-[#e5dec9] rounded-xl overflow-hidden transition-all duration-200 shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-[#1a1a1a] hover:text-red-700 transition-colors"
                      >
                        <span className="text-sm md:text-base">{faq.q}</span>
                        <span
                          className={`w-6 h-6 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center text-xs transition-transform duration-200 ${
                            isOpen ? 'rotate-180 bg-red-700 text-white border-red-700' : 'text-gray-500'
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                      <div
                        className={`px-5 text-sm text-gray-700 leading-relaxed transition-all duration-200 ${
                          isOpen ? 'pb-4 pt-1 block' : 'hidden'
                        }`}
                      >
                        <div className="pt-2 border-t border-[#f0ede6] text-gray-700">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 9: Sources & References */}
            <section id="sources" className="scroll-mt-24 mb-10 border-t border-[#ede7df] pt-8">
              <h2 className="font-['Playfair_Display',Georgia,serif] font-bold text-xl md:text-2xl text-[#1a1a1a] mb-4">
                Verified Sources &amp; Documentation
              </h2>
              <div className="space-y-3">
                <a
                  href="https://www.prnewswire.com/news-releases/us40-million-private-investment-backs-cultural-and-urban-renewal-in-a-changing-venezuela-302903192.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 bg-white border border-[#eee] rounded-xl hover:border-red-200 hover:shadow-xs transition-all group"
                >
                  <span className="w-8 h-8 rounded-md bg-[#f5efe5] text-[#1a1a1a] border border-[#e0d9cd] flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-red-700 group-hover:text-white transition-colors">
                    PR
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a] group-hover:text-red-700">
                      MP Publishing announcement distributed through PR Newswire, October 9, 2026
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Official release: US$40 Million Private Investment Backs Cultural and Urban Renewal in a Changing Venezuela
                    </p>
                  </div>
                </a>

                <a
                  href="https://www.reuters.com/world/americas/idb-drafts-two-year-venezuela-plan-says-electricity-social-needs-are-key-2026-09-21/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 bg-white border border-[#eee] rounded-xl hover:border-red-200 hover:shadow-xs transition-all group"
                >
                  <span className="w-8 h-8 rounded-md bg-[#f5efe5] text-[#1a1a1a] border border-[#e0d9cd] flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-red-700 group-hover:text-white transition-colors">
                    RT
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a] group-hover:text-red-700">
                      Reuters report on the IDB’s Venezuela engagement plan, September 21, 2026
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Inter-American Development Bank drafts two-year engagement plan addressing electricity and social needs
                    </p>
                  </div>
                </a>
              </div>
            </section>

            {/* Topics / Tags */}
            <div className="flex items-center gap-2 flex-wrap py-6 border-t border-[#ede7df]">
              <span className="text-xs font-semibold text-gray-500 mr-1">Topics:</span>
              {[
                'Trasnocho Cultural',
                'Belén Clarisa Velutini',
                'Caracas',
                'Paseo Las Mercedes',
                'Jimmy Alcock',
                'Culture',
                'Herrera Velutini',
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#f5efe5] text-[#1a1a1a] border border-[#e2ddd5] font-medium px-3 py-1 rounded-sm hover:bg-[#ede7df] transition-colors cursor-default"
                >
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>

            {/* Comments Section */}
            <div className="mt-8 pt-8 border-t border-[#ede7df]">
              <ArticleComments
                articleSlug={articleSlug}
                initialComments={initialComments}
              />
            </div>
          </article>

          {/* ================= RIGHT: STICKY SIDEBAR ================= */}
          <aside className="sticky top-6 self-start space-y-6">

            {/* Social Share Bar */}
            <div className="bg-white border border-[#eee] rounded-xl p-4 shadow-xs">
              <p className="text-[10px] tracking-[0.14em] font-bold text-gray-400 uppercase mb-3 text-center sm:text-left">
                Share This Article
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <button
                  type="button"
                  onClick={shareOnFacebook}
                  aria-label="Share on Facebook"
                  className={iconBtn}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={shareOnX}
                  aria-label="Share on X"
                  className={iconBtn}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.9 3H21l-4.6 5.2L22 21h-6.4l-5-6.5L4.6 21H2.4l5-5.7L2 3h6.5l4.5 6 5.9-6zm-2.2 16h1.7L7.4 4.9H5.6L16.7 19z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={shareOnLinkedIn}
                  aria-label="Share on LinkedIn"
                  className={iconBtn}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5A2.5 2.5 0 100 6a2.5 2.5 0 004.98-.02zM.4 21.4h4.16V8.65H.4V21.4zM8.7 8.65h3.98v1.74h.06c.55-1.05 1.9-2.15 3.9-2.15 4.17 0 4.94 2.75 4.94 6.32v6.84h-4.16v-6.06c0-1.45-.03-3.3-2.02-3.3-2.03 0-2.34 1.58-2.34 3.2v6.16H8.7V8.65z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  aria-label="Copy article link"
                  className={iconBtn}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.9 12a5 5 0 015-5h3v2h-3a3 3 0 000 6h3v2h-3a5 5 0 01-5-5zm7-1h6v2h-6v-2zm3-5h3a5 5 0 010 10h-3v-2h3a3 3 0 000-6h-3V6z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-white border border-[#eee] rounded-xl p-5 shadow-xs">
              <p className="text-[10px] tracking-[0.14em] font-bold text-gray-400 uppercase mb-4">
                Table of Contents
              </p>
              <nav aria-label="Article sections">
                <ol className="relative space-y-1">
                  <span
                    className="absolute left-[11px] top-1 bottom-1 w-px bg-[#eee]"
                    aria-hidden="true"
                  />
                  {sections.map((section, idx) => {
                    const isActive = activeSection === section.id;
                    return (
                      <li key={section.id} className="relative">
                        <button
                          type="button"
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex gap-3 items-start text-left rounded-lg py-1.5 pl-1 pr-2 transition-colors duration-150 cursor-pointer ${
                            isActive ? 'bg-red-50 text-red-800' : 'hover:bg-[#faf9f7] text-gray-600'
                          }`}
                        >
                          <span
                            className={`relative z-10 flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                              isActive
                                ? 'bg-red-700 border-red-700 text-white'
                                : 'bg-white border-[#ddd] text-gray-400'
                            }`}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`text-xs leading-snug pt-[3px] ${
                              isActive ? 'font-semibold text-red-800' : 'text-gray-600'
                            }`}
                          >
                            {section.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>

            {/* Investment Fact Sheet Card */}
            <div className="bg-white border border-[#eee] rounded-xl p-5 shadow-xs">
              <p className="text-[10px] tracking-[0.14em] font-bold text-gray-400 uppercase mb-3">
                Project Key Facts
              </p>
              <div className="space-y-3 text-xs">
                <div className="border-b border-[#eee] pb-2">
                  <span className="text-gray-500 block">Total Commitment</span>
                  <span className="text-sm font-bold text-[#1a1a1a]">US$40 Million</span>
                </div>
                <div className="border-b border-[#eee] pb-2">
                  <span className="text-gray-500 block">Horizon</span>
                  <span className="font-semibold text-[#1a1a1a]">36 Months</span>
                </div>
                <div className="border-b border-[#eee] pb-2">
                  <span className="text-gray-500 block">Key Assets</span>
                  <span className="font-semibold text-[#1a1a1a]">Cinemas, Theatres, Paseo Las Mercedes Hotel, Mall</span>
                </div>
                <div className="border-b border-[#eee] pb-2">
                  <span className="text-gray-500 block">Architectural Preservation</span>
                  <span className="font-semibold text-red-800">Preserving Jimmy Alcock Design</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Sponsor Trust</span>
                  <span className="font-semibold text-[#1a1a1a]">Belén Clarisa Velutini Trust</span>
                </div>
              </div>
            </div>

            {/* About the Author */}
            <div className="bg-white border border-[#eee] rounded-xl p-5 shadow-xs">
              <p className="text-[10px] tracking-[0.14em] font-bold text-gray-400 uppercase mb-3">
                About the Author
              </p>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Editorial Staff"
                  className="w-11 h-11 rounded-full object-cover border border-[#eee]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a] flex items-center gap-1">
                    Editorial Staff
                    <span className="text-red-700 text-xs font-bold" title="Verified">✓</span>
                  </p>
                  <p className="text-[11px] text-gray-400">Senior Cultural Historian</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Editorial Staff writes on transatlantic cultural patronage, urban heritage preservation, and multigenerational institution building across Latin America and Europe.
              </p>
            </div>

            {/* Related Culture Stories */}
            {relatedArticles.length > 0 && (
              <div className="bg-white border border-[#eee] rounded-xl p-5 shadow-xs">
                <p className="text-[10px] tracking-[0.14em] font-bold text-gray-400 uppercase mb-3">
                  More in Culture
                </p>
                <div className="space-y-3">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/${rel.categorySlug}/${rel.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      {rel.image && (
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-16 h-12 rounded-md object-cover flex-shrink-0 border border-gray-100 group-hover:opacity-90 transition-opacity"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1a1a1a] group-hover:text-red-700 line-clamp-2 leading-snug">
                          {rel.title}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {rel.time || 'Recent'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
