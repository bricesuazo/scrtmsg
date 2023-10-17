import Header from '@/components/header';
import { Providers } from '@/components/providers';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';

import './globals.css';

// export const runtime = 'edge';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'scrtmsg.me | Get message from anonymous.',
  description: 'Get message from anonymous.',
  metadataBase: new URL('https://scrtmsg.me/'),
  openGraph: {
    type: 'website',
    url: 'https://scrtmsg.me/api/og',
    title: 'scrtmsg.me | Get message from anonymous.',
    description: 'Get message from anonymous.',
    images: [
      {
        url: 'https://scrtmsg.me/og.png',
        width: 1200,
        height: 630,
        alt: 'scrtmsg.me | Get message from anonymous.',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>
          <div className="sticky top-0 z-20 bg-background border-b-border border-b">
            <Header />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
