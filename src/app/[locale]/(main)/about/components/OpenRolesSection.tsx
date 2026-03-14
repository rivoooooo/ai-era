"use client"

import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

const needs = ["frontend", "backend", "content", "devrel"]

export function OpenRolesSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 })
  const prefersReducedMotion = useReducedMotion()

  const animationStyle = prefersReducedMotion
    ? {}
    : {
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateX(0)" : "translateX(-16px)",
        transition: "opacity 500ms ease-out, transform 500ms ease-out",
      }

  return (
    <section ref={ref} style={animationStyle}>
      {/* Terminal Window */}
      <div>
        {/* Title Bar */}
        <div className="bg-primary text-primary-foreground px-4 py-1.5 text-[11px] font-bold font-mono">
          +─── OPEN ROLES ───+
        </div>

        {/* Content Area */}
        <div
          className="border border-primary border-t-0 px-7 py-6 text-[13px] leading-[1.9]"
          style={{ background: "color-mix(in srgb, var(--primary) 4%, var(--background))" }}
        >
          <p className="text-foreground">
            We don&apos;t have formal openings right now.
          </p>
          <p className="text-foreground">
            But we&apos;re always interested in people
          </p>
          <p className="text-foreground">
            who care about how developers learn.
          </p>

          <p className="text-foreground mt-4">
            If that&apos;s you:
          </p>

          {/* Needs Array */}
          <div className="mt-3">
            <span className="text-primary font-bold font-mono">{`> `}</span>
            <span className="text-secondary font-bold font-mono">
              needs = [&quot;{needs.join('&quot;, &quot;')}&quot;]
            </span>
          </div>

          {/* CTA Link */}
          <a
            href="https://github.com/your-org/ai-era/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 text-primary hover:underline font-mono group cursor-pointer"
          >
            <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
              → open an issue on GitHub and say hello ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
