import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllAuthors } from '@/lib/db';
import JsonLd from '@/components/JsonLd';

const SITE_URL = 'https://www.financial-journal.xyz';
const SITE_NAME = 'Financial Journal';

export const metadata: Metadata = {
  title: 'Our Editorial Team & Correspondents | Financial Journal',
  description:
    'Meet the investigative journalists, economy analysts, and regional correspondents powering Financial Journal.',
  alternates: { canonical: `${SITE_URL}/our-team` },
  openGraph: {
    title: `Our Editorial Team | ${SITE_NAME}`,
    description:
      'Meet the investigative journalists, economy analysts, and regional correspondents powering Financial Journal.',
    url: `${SITE_URL}/our-team`,
    siteName: SITE_NAME,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/img-home.webp`,
        width: 1200,
        height: 630,
        alt: `Our Editorial Team - ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Our Editorial Team | ${SITE_NAME}`,
    description:
      'Meet the investigative journalists, economy analysts, and regional correspondents powering Financial Journal.',
    images: [`${SITE_URL}/images/img-home.webp`],
    creator: '@Finjournal24',
    site: '@Finjournal24',
  },
};

export default function OurTeamPage() {
  const authors = getAllAuthors();

  const teamSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `Our Editorial Team - ${SITE_NAME}`,
    url: `${SITE_URL}/our-team`,
    description: 'Meet the journalists, editors, and correspondents behind Financial Journal.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: authors.map((auth, idx) => ({
        '@type': 'Person',
        position: idx + 1,
        name: auth.name,
        jobTitle: auth.role,
        url: `${SITE_URL}/author/${auth.slug}`,
        image: auth.avatar,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Our Team',
        item: `${SITE_URL}/our-team`,
      },
    ],
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
      <JsonLd data={[teamSchema, breadcrumbSchema]} />
      <div className="border-b-4 border-red-700 pb-4 mb-8 text-center md:text-left">
        <h1 className="text-4xl font-bold font-serif text-red-700 uppercase">
          Our Editorial Team
        </h1>
        <p className="text-gray-600 font-serif text-base mt-2">
          Meet the dedicated investigative journalists, financial analysts, and regional correspondents powering Financial Journal.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {authors.map((author) => (
          <div key={author.slug} className="bg-white border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-red-700 mx-auto mb-4"
            />
            <Link href={`/author/${author.slug}`}>
              <h3 className="font-serif font-bold text-lg text-gray-900 hover:text-red-700">{author.name}</h3>
            </Link>
            <p className="text-red-700 text-xs font-bold uppercase tracking-wider mt-1 mb-3">
              {author.role}
            </p>
            <p className="text-xs text-gray-500 font-serif">
              {author.count} Published Articles
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}