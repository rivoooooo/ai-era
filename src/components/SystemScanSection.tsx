"use client"

import { useEffect, useRef, useState } from "react"

interface ScanResult {
  id: string
  title: string
  code: string
  progress: number
  description: string
  tags: string[]
}

const SCAN_RESULTS: ScanResult[] = [
  {
    id: "fc-001",
    title: "REAL_FRONTEND_CHALLENGES",
    code: "#FC-001",
    progress: 100,
    description:
      "practice building real ui components and fixing real production bugs. no toy examples. no hand-holding.",
    tags: ["components", "debugging", "real-world"],
  },
  {
    id: "ai-002",
    title: "AI_ASSISTED_DEVELOPMENT",
    code: "#AI-002",
    progress: 82,
    description:
      "learn to collaborate with ai tools instead of fighting them. the future workflow, starting now.",
    tags: ["llm", "copilot", "prompt-eng"],
  },
  {
    id: "db-003",
    title: "DEBUGGING_SKILLS",
    code: "#DB-003",
    progress: 68,
    description:
      "train your ability to read and repair broken production code. ship with confidence.",
    tags: ["console", "traces", "error-handling"],
  },
]

const TOTAL_BARS = 20

function ProgressBar({ progress }: { progress: number }) {
  const filledBars = Math.round((progress / 100) * TOTAL_BARS)
  const emptyBars = TOTAL_BARS - filledBars

  return (
    <span className="font-mono">
      <span className="text-primary">
        {Array.from({ length: filledBars }, () => "█").join("")}
      </span>
      <span className="text-muted">
        {Array.from({ length: emptyBars }, () => "░").join("")}
      </span>{" "}
      {progress.toString().padStart(3, " ")}%
    </span>
  )
}

function ScanCard({
  scan,
  index,
}: {
  scan: ScanResult
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setTimeout(() => setShowProgress(true), 400)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const indentClass = ["ml-0", "ml-8 lg:ml-12", "ml-16 lg:ml-24"][index]

  return (
    <div
      ref={cardRef}
      className={`${indentClass} ${isVisible ? "animate-fade-in" : "opacity-0"}`}
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: "forwards",
      }}
    >
      <div className="border border-border p-4 md:p-5 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm md:text-base font-bold text-primary">
            [OK] {scan.title}
          </h3>
          <span className="text-xs md:text-sm text-muted-foreground font-mono">
            {scan.code}
          </span>
        </div>

        <div
          className={`text-xs md:text-sm text-muted-foreground mb-3 font-mono transition-all duration-600 ${
            showProgress ? "opacity-100" : "opacity-50"
          }`}
        >
          SCANNING:{" "}
          <span
            className={
              showProgress && scan.progress < 100 ? "animate-pulse" : ""
            }
          >
            <ProgressBar progress={scan.progress} />
          </span>
        </div>

        <p className="text-sm text-foreground mb-4 leading-relaxed">
          {scan.description}
        </p>

        <ul className="flex flex-wrap gap-2">
          {scan.tags.map((tag) => (
            <li
              key={tag}
              className="text-[11px] uppercase font-mono text-muted-foreground border border-dashed border-border px-2 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function SystemScanSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <h2 className="sr-only">Platform Features</h2>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <div className="mb-6">
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-none">
              SYSTEM
            </p>
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-none">
              SCAN
            </p>
          </div>

          <div className="text-sm text-muted-foreground font-mono space-y-1 mb-6">
            <p>
              <span className="text-primary">{">"}</span> running diagnostics...
            </p>
          </div>

          <div className="text-sm text-muted-foreground font-mono space-y-1 mb-6">
            <p>
              3 modules loaded <span className="text-primary">[OK]</span>
            </p>
          </div>

          <div className="text-xs text-muted-foreground font-mono pt-4 border-t border-border">
            <p>EST. 2024</p>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col gap-6">
          {SCAN_RESULTS.map((scan, index) => (
            <ScanCard key={scan.id} scan={scan} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
