import type { Metadata } from 'next';
import { JetBrains_Mono, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { getLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import Providers from '@/components/providers';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI-Era | Gamified Web Developer Training Platform",
    template: "%s | AI-Era",
  },
  description:
    "AI-Era is a gamified platform for training real frontend, JavaScript, and AI coding skills. Practice real challenges, debug production bugs, and level up as a developer.",
  keywords: [
    "frontend challenges",
    "javascript practice",
    "web developer training",
    "ai coding",
    "debugging skills",
    "prompt engineering",
  ],
  openGraph: {
    title: "AI-Era | Developer Training Platform",
    description: "Gamified frontend and AI skill training for developers.",
    type: "website",
    locale: "en_US",
    siteName: "AI-Era",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Era | Developer Training Platform",
    description: "Gamified frontend and AI skill training for developers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={`${jetbrains.variable} antialiased`}
        style={{ 
          fontFamily: "var(--font-jetbrains), monospace",
        }}
      >
        <Providers messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
