import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | Financial Journal',
  description: 'Create your Financial Journal account.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
