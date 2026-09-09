import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { getAllCategories } from '@/lib/db';
import './globals.css';

const SITE_URL = 'https://www.financial-journal.xyz';
const SITE_NAME = 'Financial Journal';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Financial Journal - The Leading Business Journal',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Financial Journal is the premier source for global business, market intelligence, economy analysis, corporate finance, technology disruption, and geopolitical reporting.',
  keywords: [
    'Financial Journal',
    'business news',
    'stock market',
    'economy analysis',
    'global finance',
    'corporate news',
    'politics',
    'technology news',
    'market updates',
    'financial journalism',
  ],
  applicationName: SITE_NAME,
  authors: [{ name: `${SITE_NAME} Editorial Team`, url: `${SITE_URL}/our-team` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'business',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-US': `${SITE_URL}/`,
      'es-ES': `${SITE_URL}/`,
    },
  },
  openGraph: {
    title: 'Financial Journal - The Leading Business Journal',
    description:
      'Financial Journal is the premier source for global business, market intelligence, economy analysis, corporate finance, technology disruption, and geopolitical reporting.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES'],
    images: [
      {
        url: `${SITE_URL}/images/img-home.webp`,
        width: 1200,
        height: 630,
        alt: 'Financial Journal - The Leading Business Journal',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financial Journal - The Leading Business Journal',
    description:
      'Financial Journal is the premier source for global business, market intelligence, economy analysis, corporate finance, technology disruption, and geopolitical reporting.',
    images: [`${SITE_URL}/images/img-home.webp`],
    creator: '@Finjournal24',
    site: '@Finjournal24',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const currentLang = cookieStore.get('app_lang')?.value || 'en';
  const categories = getAllCategories();

  const siteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsMediaOrganization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/images/img-home.webp`,
          caption: SITE_NAME,
        },
        description:
          'Financial Journal is an independent news publication delivering rigorous analysis on global economics, markets, politics, and technology.',
        publishingPrinciples: `${SITE_URL}/about`,
        ethicsPolicy: `${SITE_URL}/about`,
        correctionsPolicy: `${SITE_URL}/terms-and-conditions`,
        sameAs: [
          'https://x.com/Finjournal24',
          'https://www.instagram.com/financial_journal_24',
          'https://substack.com/@financialjournal24',
          'https://medium.com/@financialjournal24',
          'https://www.reddit.com/user/financial_journal_24/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['en-US', 'es'],
      },
    ],
  };

  return (
    <html lang={currentLang}>
      <head>
        <JsonLd data={siteSchema} />
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18383193170"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18383193170');
          `}
        </Script>
      </head>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <Header categories={categories} currentLang={currentLang} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}