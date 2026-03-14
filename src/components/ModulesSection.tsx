"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import modulesData from "@/data/modules.json"

interface Module {
  id: string
  name: string
  keywords: string[]
  challengeCount: number
}

const ROUTE_MAP: Record<string, string> = {
  ui: "/challenges?module=ui",
  js: "/challenges?module=js",
  ai: "/challenges?module=ai",
  debug: "/challenges?module=debug",
  perf: "/challenges?module=perf",
  system: "/challenges?module=system",
}

function generateProgressBar(count: number, max: number): string {
  const filled = Math.round((count / max) * 10)
  return "█".repeat(filled) + "░".repeat(10 - filled)
}

export function ModulesSection() {
  const locale = useLocale()
  const modules: Module[] = modulesData
  const maxCount = Math.max(...modules.map((m) => m.challengeCount))

  return (
    <section className="py-8 w-full max-w-[100vw] overflow-hidden">
      <h2 className="text-primary text-lg mb-6">
        <span className="text-primary">{`> ls -la /modules/`}</span>
      </h2>

      <div className="w-full overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb:hover]:bg-primary">
        <div className="min-w-max pr-4">
          {modules.map((module, index) => (
            <Link
              key={module.id}
              href={`/${locale}${ROUTE_MAP[module.id]}`}
              className="flex items-center gap-3 py-2 px-3 hover:bg-primary hover:text-primary-foreground transition-all duration-100 cursor-pointer group whitespace-nowrap"
            >
              <span className="text-muted-foreground text-[11px] w-24 shrink-0 group-hover:text-primary-foreground">
                drwxr-xr-x
              </span>
              <span className="text-muted-foreground text-sm w-8 shrink-0 group-hover:text-primary-foreground">
                [{String(index + 1).padStart(2, "0")}]
              </span>
              <h3 className="text-primary font-bold text-sm w-44 shrink-0 group-hover:text-primary-foreground">
                {module.name}/
              </h3>
              <span className="text-secondary text-sm w-28 shrink-0 text-right group-hover:text-primary-foreground">
                {module.challengeCount} challenges
              </span>
              <span className="text-success text-sm w-28 shrink-0 font-mono group-hover:text-primary-foreground">
                {generateProgressBar(module.challengeCount, maxCount)}
              </span>
              <span className="text-muted-foreground text-[12px] w-48 shrink-0 group-hover:text-primary-foreground">
                {module.keywords.join(" · ")}
              </span>
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-dashed border-border">
            <p className="text-muted-foreground text-xs">
              6 directories, 180 challenges total
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
