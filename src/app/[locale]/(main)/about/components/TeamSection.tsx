"use client"

import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

interface TeamMember {
  name: string
  role: string
  handle: string
  comment?: string
}

interface TeamSectionProps {
  members?: TeamMember[]
}

export function TeamSection({ members = [] }: TeamSectionProps) {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 })
  const prefersReducedMotion = useReducedMotion()

  const displayMembers = members.length > 0 ? members : [
    { name: "YourName", role: "Founder & Developer", handle: "yourhandle", comment: "Building the future of developer education." }
  ]

  const isSingleMember = displayMembers.length === 1

  return (
    <section ref={ref} className="mb-8">
      {/* Command Line Title */}
      <div className="mb-6">
        <div className="text-[13px] font-bold text-primary font-mono">
          {`> cat TEAM.config`}
        </div>
        <div className="text-[10px] text-border tracking-widest font-mono mt-1">
          {'─'.repeat(50)}
        </div>
        <div className="text-[12px] text-muted-foreground italic font-mono mt-2">
          {"// Including contributors and developers"}
        </div>
        <div className="text-[12px] text-muted-foreground italic font-mono">
          {"// who care about how we learn."}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className={`grid gap-4 ${isSingleMember ? 'grid-cols-1 max-w-xs' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
        {displayMembers.map((member, index) => {
          const initials = member.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()

          const cardStyle = prefersReducedMotion
            ? {}
            : {
                opacity: isInView ? 1 : 0,
                transform: isInView ? "scale(1)" : "scale(0.95)",
                transition: `opacity 400ms ease-out ${index * 40}ms, transform 400ms ease-out ${index * 40}ms`,
              }

          return (
            <div
              key={index}
              className="group border border-border bg-card p-5 flex flex-col gap-2.5 hover:border-primary hover:bg-[color-mix(in_srgb,var(--primary)_5%,var(--card))] hover:-translate-y-[3px] transition-all duration-150"
              style={cardStyle}
            >
              {/* Avatar */}
              <div className="w-12 h-12 border border-border group-hover:border-primary flex items-center justify-center grayscale-[15%] group-hover:grayscale-0 transition-all duration-150"
                style={{ background: "color-mix(in srgb, var(--primary) 15%, var(--card))" }}
              >
                <span className="text-sm font-bold text-primary font-mono">{initials}</span>
              </div>

              {/* Info */}
              <div>
                <div className="text-[13px] font-bold text-foreground font-mono">{member.name}</div>
                <div className="text-[11px] text-muted-foreground font-mono">{member.role}</div>
              </div>

              {/* Comment */}
              {member.comment && (
                <div className="border-t border-dashed border-border pt-2 mt-1">
                  <div className="text-[11px] text-muted-foreground italic font-mono leading-[1.6]">
                    {"// "}{member.comment}
                  </div>
                </div>
              )}

              {/* Handle */}
              <a
                href={`https://github.com/${member.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-secondary hover:underline font-mono mt-auto"
              >
                @{member.handle}
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}
