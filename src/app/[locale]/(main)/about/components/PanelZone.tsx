"use client"

import { useState, useEffect } from "react"

interface PanelZoneProps {
  uptime: string
  mouseX: number
  mouseY: number
}

export function PanelZone({ uptime, mouseX, mouseY }: PanelZoneProps) {
  const [timestamp, setTimestamp] = useState("")

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date()
      const time = now.toLocaleTimeString("en-US", { hour12: false })
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.split("/")[1] || "UTC"
      setTimestamp(`${time} [${tz}]`)
    }

    updateTimestamp()
    const interval = setInterval(updateTimestamp, 1000)
    return () => clearInterval(interval)
  }, [])

  const links = [
    { label: "Email", url: "mailto:hello@ai-era.dev" },
    { label: "GitHub", url: "https://github.com/your-org/ai-era" },
    { label: "Twitter", url: "https://twitter.com/ai_era_dev" },
    { label: "Discord", url: "https://discord.gg/ai-era" },
  ]

  return (
    <div className="h-[30vh] px-6 md:px-8 py-6 grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr] gap-6 md:gap-12 border-t border-border bg-background overflow-y-auto md:overflow-visible">
      {/* Column 1: Bio */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-foreground font-mono">YourName</span>
          <span className="text-[11px] text-muted-foreground font-mono">{timestamp}</span>
        </div>
        <div className="border-b border-border" />
        <p className="text-[13px] text-foreground leading-[1.8] font-sans hover:font-mono hover:opacity-70 transition-all duration-200">
          Multidisciplinary developer building the platform I wish existed when I started.
          Focusing on real challenges, AI workflows, and developer education that actually works.
        </p>
        <div className="text-[11px] text-muted-foreground italic font-mono">
          // Currently: building AI-Era
        </div>
      </div>

      {/* Column 2: Links */}
      <div className="space-y-4">
        <div className="space-y-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-[13px] text-foreground py-1 relative w-fit no-underline"
            >
              <span className="text-primary opacity-0 -translate-x-2 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0">
                &gt;
              </span>
              <span className="relative">
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-px bg-primary origin-right scale-x-0 transition-transform duration-400 ease-out group-hover:scale-x-100 group-hover:origin-left" 
                      style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }} />
              </span>
            </a>
          ))}
        </div>
        <div className="border-t border-dashed border-border pt-3 mt-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-2">
            Built with:
          </div>
          <div className="text-[11px] text-muted-foreground leading-[1.8]">
            Next.js · Drizzle
            <br />
            Better Auth · bun
          </div>
        </div>
      </div>

      {/* Column 3: Status */}
      <div className="flex flex-col justify-between text-right">
        <div>
          <div className="text-[11px] text-muted-foreground mb-4">© 2024</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-2">
            System Status
          </div>
          <div className="border-t border-border pt-2 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">version:</span>
              <span className="text-muted-foreground font-mono">v0.1.0</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">modules:</span>
              <span className="text-muted-foreground font-mono">6</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">challenges:</span>
              <span className="text-muted-foreground font-mono">180</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">status:</span>
              <span className="text-success font-mono">[OK]</span>
            </div>
          </div>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground mt-auto">
          <div>X: {mouseX.toString().padStart(4, "0")} Y: {mouseY.toString().padStart(4, "0")}</div>
          <div>UPTIME: {uptime}</div>
        </div>
      </div>
    </div>
  )
}
