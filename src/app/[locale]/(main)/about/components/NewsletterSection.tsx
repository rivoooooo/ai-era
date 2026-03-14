"use client"

import { useState } from "react"
import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 })
  const prefersReducedMotion = useReducedMotion()

  const animationStyle = prefersReducedMotion
    ? {}
    : {
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms",
      }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription
    console.log("Subscribe:", email)
    setEmail("")
  }

  return (
    <section ref={ref} className="mt-8" style={animationStyle}>
      {/* Terminal Window */}
      <div>
        {/* Title Bar */}
        <div className="bg-primary text-primary-foreground px-4 py-1.5 text-[11px] font-bold font-mono">
          +─── SUBSCRIBE ───+
        </div>

        {/* Content Area */}
        <div className="border border-primary border-t-0 px-7 py-6 bg-card">
          {/* Command */}
          <div className="text-[13px] text-primary font-bold font-mono mb-3">
            {`> subscribe --monthly`}
          </div>

          {/* Description */}
          <p className="text-[12px] text-muted-foreground mb-5">
            Stay updated on new challenges and platform updates.
          </p>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Input Line */}
            <div className="flex items-center gap-2 flex-1">
              <span className="text-primary font-bold font-mono text-[13px] flex-shrink-0">{`>`}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent border-0 border-b border-border focus:border-primary focus:outline-none text-[13px] py-1.5 text-foreground placeholder:text-muted-foreground font-mono"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="h-[34px] px-4 text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono flex-shrink-0"
            >
              [ SUBSCRIBE ]
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
