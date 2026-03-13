"use client"

import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border pt-8 pb-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-border text-xs overflow-hidden whitespace-nowrap select-none mb-8">
          {"─".repeat(200)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="text-primary font-bold text-lg mb-3">
              {`> system.status`}
            </div>
            <div className="space-y-1 text-sm font-mono">
              <div className="flex gap-4">
                <span className="text-muted-foreground text-xs">version:</span>
                <span className="text-foreground text-xs">v0.1.0</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground text-xs">modules:</span>
                <span className="text-foreground text-xs">6</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground text-xs">challenges:</span>
                <span className="text-foreground text-xs">180</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground text-xs">uptime:</span>
                <span className="text-foreground text-xs">42 days</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground text-xs">status:</span>
                <span className="text-success text-xs">[OK] operational</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-[11px] uppercase mb-3">
              QUICK COMMANDS
            </div>
            <div className="text-muted-foreground text-xs border-b border-dashed border-border pb-2 mb-3">
              ───────────────────
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-mono mb-4">
              <Link href="#" className="text-primary hover:underline">help</Link>
              <Link href="#" className="text-primary hover:underline">modules</Link>
              <Link href="#" className="text-primary hover:underline">start</Link>
              <Link href="#" className="text-primary hover:underline">sandbox</Link>
              <Link href="#" className="text-primary hover:underline">daily</Link>
              <Link href="#" className="text-primary hover:underline">rank</Link>
            </div>
            <div className="text-muted-foreground text-[11px] italic">
              {`> type to interact`}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-border">
          <div className="flex flex-wrap gap-6">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              [Privacy]
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              [Terms]
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              [GitHub]
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              [Twitter]
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © {currentYear} AI-Era. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
