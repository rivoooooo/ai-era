"use client"

import { FadeInSection } from "./FadeInSection"
import { TypewriterText } from "./TypewriterText"
import { MemberCard } from "./MemberCard"
import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"
import { CharacterDivider } from "./CharacterDivider"

interface TeamMember {
  name: string
  role: string
  handle: string
  comment?: string[]
}

interface TeamSectionProps {
  title: string
  subtitle: string[]
  members: TeamMember[]
}

export function TeamSection({ subtitle, members }: TeamSectionProps) {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.15 })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section ref={ref} className="py-6 md:py-8">
      <FadeInSection>
        <div className="text-sm text-primary mb-2 font-mono font-bold">
          {isInView ? (
            <TypewriterText text={`> cat TEAM.config`} charDelay={18} />
          ) : (
            <span>&nbsp;</span>
          )}
        </div>

        <CharacterDivider className="mb-4" />

        <div className="space-y-1 mb-8">
          {subtitle.map((line, index) => (
            <div
              key={index}
              className="text-xs text-muted-foreground italic font-mono"
            >
              {"// "}{line}
            </div>
          ))}
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          style={{
            opacity: isInView || prefersReducedMotion ? 1 : 0,
            transform:
              isInView || prefersReducedMotion
                ? "translateY(0)"
                : "translateY(20px)",
            transition: "opacity 400ms ease-out, transform 400ms ease-out",
          }}
        >
          {members.map((member, index) => (
            <div
              key={member.handle}
              style={{
                opacity: isInView || prefersReducedMotion ? 1 : 0,
                transform:
                  isInView || prefersReducedMotion
                    ? "scale(1)"
                    : "scale(0.95)",
                transition: `opacity 400ms ease-out ${index * 40}ms, transform 400ms ease-out ${index * 40}ms`,
              }}
            >
              <MemberCard {...member} index={index} />
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  )
}
