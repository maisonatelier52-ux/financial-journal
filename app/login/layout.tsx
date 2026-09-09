import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Financial Journal',
  description: 'Sign in to your Financial Journal account.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
