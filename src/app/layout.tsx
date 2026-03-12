import type { Metadata } from 'next';
import { JetBrains_Mono, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { CommandPaletteWrapper } from '@/components/command-palette';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getLocale } from 'next-intl/server';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-Era Web Dev Skills",
  description: "AI-Era Web Dev Skills - Frontend Developer Challenge Platform",
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
          backgroundColor: "var(--background)",
          color: "var(--foreground)"
        }}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <CommandPaletteWrapper />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}