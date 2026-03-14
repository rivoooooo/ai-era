"use client"

import { CharacterDivider } from "./CharacterDivider"
import Link from "next/link"

interface HeroSectionProps {
  title: string[]
  subtitle: string[]
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  // Parse title into three lines
  const line1 = "We are building"
  const line2 = "the training ground"
  const line3 = "developers actually need."

  return (
    <section className="min-h-[60vh] flex flex-col justify-center py-6 md:py-8">
      <div className="text-sm text-muted-foreground mb-4 font-mono">
        {`> cat ABOUT.md`}
      </div>

      <CharacterDivider className="mb-8" />

      {/* Main Title - Three Lines with CSS Animation */}
      <div className="mb-8" style={{ fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.15 }}>
        <div 
          className="font-bold animate-fade-in-up"
          style={{ color: "var(--muted-foreground)", animationDelay: "0ms" }}
        >
          {line1}
        </div>
        <div 
          className="font-bold animate-fade-in-up"
          style={{ color: "var(--foreground)", animationDelay: "150ms" }}
        >
          {line2}
        </div>
        <div 
          className="font-bold animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <span className="text-primary">developers actually need</span>
          <span className="text-secondary">.</span>
        </div>
      </div>

      <CharacterDivider className="mb-8" />

      {/* Subtitle - Two Column Layout */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-10 animate-fade-in-up"
        style={{ animationDelay: "500ms" }}
      >
        {/* Left Column */}
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-mono">
            {subtitle[0] || "Not another tutorial site."}
          </p>
          <p className="text-muted-foreground text-xs font-mono">
            {subtitle[1] || "Not another bootcamp."}
          </p>
          <p className="text-muted-foreground text-xs font-mono">
            Not another documentation page.
          </p>
        </div>

        {/* Right Column */}
        <div className="space-y-1 md:text-right">
          <p className="text-foreground text-xs font-mono">Built by developers</p>
          <p className="text-foreground text-xs font-mono">who got tired</p>
          <p className="text-foreground text-xs font-mono">of the alternatives.</p>
        </div>
      </div>

      <CharacterDivider className="mb-8" />

      {/* CTA Buttons */}
      <div 
        className="flex flex-wrap gap-4 animate-fade-in-up"
        style={{ animationDelay: "650ms" }}
      >
        <Link
          href="/challenge"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-mono font-medium hover:bg-primary/90 transition-colors"
        >
          EXPLORE CHALLENGES →
        </Link>
        <a
          href="https://github.com/your-org/ai-era"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-xs font-mono font-medium hover:bg-muted transition-colors"
        >
          VIEW ON GITHUB
        </a>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 500ms ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
