import type { Metadata } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CommandPaletteWrapper } from "@/components/command-palette";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI ERA - Frontend Developer Challenge Platform",
  description: "AI ERA - Frontend Developer Challenge Platform, includes AI and fundamentals challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={`${jetbrains.variable} antialiased`}
        style={{ 
          fontFamily: "var(--font-jetbrains), monospace",
          backgroundColor: "var(--background)",
          color: "var(--foreground)"
        }}
      >
        {children}
        <CommandPaletteWrapper />
      </body>
    </html>
  );
}
