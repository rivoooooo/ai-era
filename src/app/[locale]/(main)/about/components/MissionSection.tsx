"use client"

import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

export function MissionSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 })
  const prefersReducedMotion = useReducedMotion()

  const animationStyle = prefersReducedMotion
    ? {}
    : {
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateX(0)" : "translateX(-20px)",
        transition: "opacity 500ms ease-out, transform 500ms ease-out",
      }

  return (
    <section
      ref={ref}
      className="py-16 md:py-20"
      style={animationStyle}
    >
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-16">
        {/* Left Column - Sticky Labels */}
        <div className="md:sticky md:top-[100px] md:self-start md:border-r-2 md:border-primary md:pr-8">
          <div className="text-[11px] font-bold text-primary tracking-[0.15em] mb-2 font-mono">
            ## MISSION
          </div>
          <div className="text-[10px] text-border tracking-widest font-mono mb-2">
            {'─'.repeat(16)}
          </div>
          <div className="text-[10px] text-success border border-dashed border-success px-2 py-0.5 inline-block font-mono mt-2">
            [ACTIVE]
          </div>
          <div className="text-[10px] text-muted-foreground font-mono mt-3">
            commit:
          </div>
          <div className="text-[10px] text-secondary font-mono font-bold">
            a3f9d12
          </div>
          <div className="text-[10px] text-muted-foreground font-mono mt-2">
            2024-01-01
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="space-y-6">
          <p className="text-[15px] leading-[1.9] text-foreground">
            The way developers learn hasn&apos;t kept up with the way they work.
          </p>
          <p className="text-[15px] leading-[1.9] text-foreground">
            AI tools didn&apos;t arrive with a manual. Neither did the new expectations placed on every developer who picks them up.
          </p>

          {/* Dot Separator */}
          <div className="text-border text-xs tracking-[0.3em] font-mono py-2">
            {'· · · · · · · · · · · · · · · · · · · ·'}
          </div>

          <p className="text-[15px] leading-[1.9] text-foreground">
            AI-Era was built to close that gap.
          </p>
          <p className="text-[15px] leading-[1.9] text-foreground">
            <strong className="text-primary font-bold">Real challenges</strong>.{' '}
            <strong className="text-primary font-bold">Real bugs</strong>.{' '}
            <strong className="text-primary font-bold">Real AI collaboration patterns</strong>.{' '}
            The kind of practice that actually prepares you for what&apos;s in the codebase on Monday.
          </p>
        </div>
      </div>
    </section>
  )
}
