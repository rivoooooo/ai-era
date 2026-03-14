"use client"

import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

const contacts = [
  {
    label: "GitHub (bugs, features, discussions)",
    url: "https://github.com/your-org/ai-era",
    command: "open",
  },
  {
    label: "Twitter / X",
    url: "https://twitter.com/ai_era_dev",
    command: "open",
  },
  {
    label: "Email (serious inquiries)",
    url: "mailto:hello@ai-era.dev",
    display: "hello@ai-era.dev",
    command: "echo",
  },
]

export function ContactSection() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 })
  const prefersReducedMotion = useReducedMotion()

  const animationStyle = prefersReducedMotion
    ? {}
    : {
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateX(0)" : "translateX(16px)",
        transition: "opacity 500ms ease-out 100ms, transform 500ms ease-out 100ms",
      }

  return (
    <section ref={ref} style={animationStyle}>
      {/* Terminal Window */}
      <div>
        {/* Title Bar */}
        <div className="bg-primary text-primary-foreground px-4 py-1.5 text-[11px] font-bold font-mono">
          +─── CONTACT.sh ───+
        </div>

        {/* Content Area */}
        <div className="border border-primary border-t-0 px-7 py-6 bg-card">
          {/* Shebang */}
          <div className="text-[11px] text-muted-foreground italic font-mono mb-4">
            #!/bin/bash
          </div>

          {/* Contact Links */}
          <div className="space-y-3">
            {contacts.map((contact, index) => (
              <div key={index}>
                {/* Comment */}
                <div className="text-[12px] text-muted-foreground font-mono mb-1">
                  # {contact.label}
                </div>

                {/* Command Line */}
                <a
                  href={contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[13px] font-mono cursor-pointer group hover:bg-primary/5 px-1 -mx-1 transition-all duration-150 hover:translate-x-0.5"
                >
                  <span className="text-success font-bold">{contact.command}</span>
                  <span className="text-muted-foreground"> </span>
                  {contact.command === "echo" ? (
                    <span className="text-foreground">&quot;{contact.display}&quot;</span>
                  ) : (
                    <span className="text-secondary underline">{contact.url}</span>
                  )}
                </a>
              </div>
            ))}
          </div>

          {/* OK Message */}
          <div className="mt-5 text-[13px] text-primary font-bold font-mono">
            echo &quot;[OK] we read everything.&quot;
          </div>
        </div>
      </div>
    </section>
  )
}
