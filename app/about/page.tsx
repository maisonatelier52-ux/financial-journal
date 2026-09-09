import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const SITE_URL = 'https://www.financial-journal.xyz';
const SITE_NAME = 'Financial Journal';

export const metadata: Metadata = {
  title: 'About Financial Journal | Mission & Editorial Independence',
  description:
    'Learn about Financial Journal, our newsroom mission, journalistic ethics, global correspondents, and editorial independence.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: `About Us | ${SITE_NAME}`,
    description:
      'Learn about Financial Journal, our newsroom mission, journalistic ethics, global correspondents, and editorial independence.',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/img-home.webp`,
        width: 1200,
        height: 630,
        alt: `About ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `About Us | ${SITE_NAME}`,
    description:
      'Learn about Financial Journal, our newsroom mission, journalistic ethics, global correspondents, and editorial independence.',
    images: [`${SITE_URL}/images/img-home.webp`],
    creator: '@Finjournal24',
    site: '@Finjournal24',
  },
};

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${SITE_NAME}`,
    url: `${SITE_URL}/about`,
    description:
      'Financial Journal is an independent news publication delivering rigorous analysis on global economics, markets, politics, and technology.',
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/img-home.webp`,
      },
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
        name: 'About Us',
        item: `${SITE_URL}/about`,
      },
    ],
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6">
      <JsonLd data={[aboutSchema, breadcrumbSchema]} />
      <div className="mt-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>{' '}
          / About Us
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="border-b pb-2 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                About Financial Journal
              </h1>
              <div className="w-28 h-[2px] bg-red-600 mt-2"></div>
            </div>

            <div className="text-[18px] leading-8 text-gray-900 space-y-6">
              <p>
                Financial Journal is a leading independent news publication covering global economic, political, financial, and business developments.
              </p>

              <h2 className="text-xl font-bold mt-6">Our Mission</h2>
              <p>
                To deliver rigorous, analytical, and objective news that empowers investors, policy makers, and readers worldwide to make informed decisions.
              </p>

              <h2 className="text-xl font-bold mt-6">Editorial Independence</h2>
              <p>
                Our newsroom operates with complete autonomy, adhering strictly to journalistic ethics, factual integrity, and transparent reporting.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="border p-5 mb-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-3">
                Editorial Desk
              </h3>
              <p className="text-sm mb-3">
                Have an inquiry or editorial tip for our newsroom?
              </p>
              <p className="text-red-600 font-semibold mb-1 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                editor@financialjournal.com
              </p>
            </div>

            <div className="bg-gray-100 p-4 text-sm border">
              <span className="font-semibold">Related Links</span>
              <ul className="mt-2 space-y-1">
                <li><Link href="/privacy-policy" className="text-red-600 hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="text-red-600 hover:underline">Terms & Conditions</Link></li>
                <li><Link href="/our-team" className="text-red-600 hover:underline">Our Team</Link></li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}