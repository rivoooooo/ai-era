"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLocale } from "next-intl"
import { useTypewriter } from "@/lib/hooks/useTypewriter"
import { TypewriterText } from "@/components/TypewriterText"
import { asciiList } from "@/data/ascii"

const HERO_LINES = [
  "> AI-Era_",
  "booting developer training system...",
  "[✓] frontend challenge engine",
  "[✓] ai-assisted coding",
  "[✓] debugging arena",
  "[✓] skill progression",
  "system online",
]

const SUBTITLE_TEXTS = [
  "Web Dev Skills",
  "Frontend Challenges",
  "AI Coding",
  "Debugging Arena",
]

export function HeroSection() {
  const locale = useLocale()
  const { displayedLines, isComplete } = useTypewriter({
    lines: HERO_LINES,
    charDelay: 30,
    lineDelay: 350,
  })

  const [ascii, setAscii] = useState("")

  useEffect(() => {
    setAscii(asciiList[Math.floor(Math.random() * asciiList.length)])
  }, [])

  return (
    <>
      <h1 className="sr-only">
        AI-Era — Gamified Web Developer Training: Frontend Challenges & AI Coding
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        <div className="w-full md:w-[55%]">
          <div className="mb-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-glow tracking-tight">
              <TypewriterText
                texts={["AI-Era", ...SUBTITLE_TEXTS]}
                typingSpeed={120}
                deletingSpeed={80}
                pauseDuration={5000}
                prefix=""
                suffix="_"
              />
              <span className="animate-blink text-2xl md:text-3xl ml-1">█</span>
            </h2>
          </div>

          <div className="font-mono text-sm md:text-base leading-relaxed whitespace-pre">
            {displayedLines.map((line, index) => (
              <div key={index}>
                {line}
                {index === displayedLines.length - 1 && isComplete && (
                  <span className="animate-blink inline-block ml-1">█</span>
                )}
              </div>
            ))}
          </div>

          {isComplete && (
            <>
              <p className="mt-6 text-sm md:text-base text-muted-foreground">
                AI-Era is a gamified platform for training real web developer skills
                in the age of AI.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/challenge`}
                  className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
                >
                  Start Challenges
                </Link>
                <Link
                  href={`/${locale}/challenge`}
                  className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-lg border border-border bg-transparent hover:bg-muted transition-colors"
                >
                  Explore Modules
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-[45%] md:pt-2">
          <pre className="text-[12px] leading-[1.4] text-primary font-mono overflow-x-auto">
            {ascii}
          </pre>
        </div>
      </div>
    </>
  )
}
