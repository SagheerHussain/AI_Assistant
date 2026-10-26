import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Festival AI Assistant — Your Guide to Music Festivals',
  description:
    'Explore a fictional demo database of festivals, lineups, and ticket prices. An AI-powered demo assistant inspired by festival discovery experiences. All data is fictional.',
  keywords: ['music festival', 'AI assistant', 'festival finder', 'demo', 'festival guide'],
  openGraph: {
    title: 'Festival AI Assistant',
    description: 'Find your next festival experience with AI. Demo dataset — fictional festivals only.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
