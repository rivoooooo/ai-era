'use client';

import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { CommandPaletteWrapper } from "@/components/command-palette";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-60px)]">
        {children}
      </main>
      <CommandPaletteWrapper />
    </>
  );
}
