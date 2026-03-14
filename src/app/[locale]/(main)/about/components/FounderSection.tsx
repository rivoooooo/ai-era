"use client"

import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

interface FounderSectionProps {
  name?: string
  role?: string
  handle?: string
  comment?: string[]
}

export function FounderSection({
  name = "YourName",
  role = "Founder & Developer",
  handle = "yourhandle",
  comment = [
    "Built this because I couldn't find",
    "the platform I actually wanted to use.",
  ],
}: FounderSectionProps) {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 })
  const prefersReducedMotion = useReducedMotion()

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const animationStyle = prefersReducedMotion
    ? {}
    : {
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateX(0)" : "translateX(-20px)",
        transition: "opacity 500ms ease-out, transform 500ms ease-out",
      }

  return (
    <section ref={ref} className="mb-8" style={animationStyle}>
      <div className="border border-border border-l-[3px] border-l-primary bg-card p-6 md:p-8 flex items-center gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-20 h-20 border-2 border-primary flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 20%, var(--card))" }}>
            <span className="text-2xl font-bold text-primary font-mono">
              {initials}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <div>
              <div className="text-base font-bold text-foreground font-mono">
                {name}
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                {role}
              </div>
            </div>
            
            <a
              href={`https://github.com/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-secondary hover:underline font-mono shrink-0"
            >
              github.com/{handle}
            </a>
          </div>

          <div className="border-t border-dashed border-border my-2.5" />

          <div className="space-y-1">
            {comment.map((line, index) => (
              <div
                key={index}
                className="text-xs text-muted-foreground italic font-mono leading-[1.7]"
              >
                {"// "}{line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
