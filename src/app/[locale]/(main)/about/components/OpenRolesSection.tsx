"use client"

import { FadeInSection } from "./FadeInSection"
import { useInView } from "@/lib/hooks/useInView"

interface OpenRolesSectionProps {
  title: string
  description: string[]
  needsLabel: string
  needs: string[]
  ctaText: string
  ctaLink: string
}

export function OpenRolesSection({
  title,
  description,
  needsLabel,
  needs,
  ctaText,
  ctaLink,
}: OpenRolesSectionProps) {
  const [ref] = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} className="py-6 md:py-8">
      <FadeInSection>
        <div className="border border-primary overflow-hidden">
          {/* Header Bar */}
          <div className="bg-primary px-4 py-1.5">
            <div className="text-[11px] font-bold text-primary-foreground font-mono tracking-wider">
              +─── {title} ───+
            </div>
          </div>

          {/* Content */}
          <div 
            className="p-6 md:p-8"
            style={{ background: "color-mix(in srgb, var(--primary) 4%, var(--background))" }}
          >
            <div className="space-y-4 text-sm text-foreground font-mono leading-[1.9] mb-6">
              {description.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>

            <div className="text-sm font-mono mb-6">
              <span className="text-primary mr-2">&gt;</span>
              <span className="text-secondary font-bold">
                {needsLabel} = [{needs.map(n => `"${n}"`).join(", ")}]
              </span>
            </div>

            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-primary font-mono hover:underline transition-transform hover:translate-x-1"
            >
              → {ctaText} ↗
            </a>
          </div>
        </div>
      </FadeInSection>
    </section>
  )
}
