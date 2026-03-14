"use client"

import { FadeInSection } from "./FadeInSection"
import { useInView } from "@/lib/hooks/useInView"
import { useState } from "react"

interface ContactLink {
  label: string
  url: string
}

interface ContactSectionProps {
  title: string
  links: ContactLink[]
  email: string
  okMessage: string
  newsletterTitle: string
  newsletterDescription: string[]
  newsletterPlaceholder: string
  newsletterButton: string
}

export function ContactSection({
  title,
  links,
  email,
  okMessage,
  newsletterDescription,
  newsletterPlaceholder,
  newsletterButton,
}: ContactSectionProps) {
  const [ref] = useInView<HTMLElement>({ threshold: 0.15 })
  const [emailInput, setEmailInput] = useState("")

  return (
    <section ref={ref} className="py-6 md:py-8">
      <FadeInSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Shell Script */}
          <div className="border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-4 py-1.5">
              <div className="text-[11px] font-bold text-primary-foreground font-mono tracking-wider">
                +─── {title} ───+
              </div>
            </div>

            {/* Content */}
            <div className="p-5 md:p-6 bg-card">
              <div className="font-mono text-xs space-y-1">
                <div className="text-muted-foreground italic text-[11px]">#!/bin/bash</div>
                <div>&nbsp;</div>

                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:bg-primary/5 transition-all hover:translate-x-0.5 py-0.5 group"
                  >
                    <span className="text-muted-foreground"># {link.label}</span>
                    <br />
                    <span className="text-success font-bold">
                      open <span className="text-secondary underline">{link.url}</span>
                    </span>
                  </a>
                ))}

                <div>&nbsp;</div>
                <div className="text-muted-foreground"># Email (serious inquiries)</div>
                <div>
                  echo <span className="text-secondary">&ldquo;{email}&rdquo;</span>
                </div>
                <div>&nbsp;</div>
                <div className="text-primary font-bold text-[13px] mt-4">echo &ldquo;{okMessage}&rdquo;</div>
              </div>
            </div>
          </div>

          {/* Right Column - Newsletter */}
          <div className="border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-4 py-1.5">
              <div className="text-[11px] font-bold text-primary-foreground font-mono tracking-wider">
                +─── SUBSCRIBE ───+
              </div>
            </div>

            {/* Content */}
            <div className="p-5 md:p-6 bg-card">
              <div className="text-[13px] text-primary font-mono font-bold mb-4">
                &gt; subscribe --monthly
              </div>

              <div className="space-y-1 mb-6">
                {newsletterDescription.map((line, index) => (
                  <p key={index} className="text-xs text-muted-foreground font-mono leading-[1.8]">
                    {line}
                  </p>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-primary font-bold text-sm font-mono shrink-0">&gt;</span>
                <input
                  type="email"
                  placeholder={newsletterPlaceholder}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 bg-transparent border-0 border-b border-border rounded-none px-0 py-2 text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground text-[11px] font-mono font-medium hover:bg-primary/90 transition-colors h-9">
                  {newsletterButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  )
}
