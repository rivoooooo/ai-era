"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandPalette,
} from "@/components/ui/command"

interface Challenge {
  slug: string
  name: string
  description: string
  category: string
  difficulty: string
}

const challenges: Challenge[] = [
  { slug: "prompt-engineering", name: "Prompt Engineering", description: "Master AI prompt writing", category: "AI CHALLENGES", difficulty: "EASY" },
  { slug: "ai-code-review", name: "AI Code Review", description: "AI-powered code review", category: "AI CHALLENGES", difficulty: "MEDIUM" },
  { slug: "copilot-mastery", name: "Copilot Mastery", description: "GitHub Copilot advanced usage", category: "AI CHALLENGES", difficulty: "MEDIUM" },
  { slug: "ai-debugging", name: "AI Debugging", description: "Debug with AI assistants", category: "AI CHALLENGES", difficulty: "HARD" },
  { slug: "rag-system", name: "RAG System", description: "Build RAG from scratch", category: "AI CHALLENGES", difficulty: "EXPERT" },
  { slug: "event-loop", name: "Event Loop", description: "JavaScript Event Loop", category: "FRONTEND PRINCIPLES", difficulty: "MEDIUM" },
  { slug: "closure-mastery", name: "Closure Mastery", description: "Deep dive into Closures", category: "FRONTEND PRINCIPLES", difficulty: "MEDIUM" },
  { slug: "this-binding", name: "This Binding", description: "Understanding 'this' binding", category: "FRONTEND PRINCIPLES", difficulty: "EASY" },
  { slug: "async-patterns", name: "Async Patterns", description: "Async/Await patterns", category: "FRONTEND PRINCIPLES", difficulty: "HARD" },
  { slug: "react-rendering", name: "React Rendering", description: "React rendering optimization", category: "FRONTEND PRINCIPLES", difficulty: "EXPERT" },
  { slug: "bundle-analysis", name: "Bundle Analysis", description: "Analyze and optimize bundles", category: "PERFORMANCE", difficulty: "MEDIUM" },
  { slug: "lazy-loading", name: "Lazy Loading", description: "Code splitting strategies", category: "PERFORMANCE", difficulty: "EASY" },
  { slug: "rendering-strategies", name: "Rendering Strategies", description: "CSR vs SSR vs SSG vs ISR", category: "PERFORMANCE", difficulty: "HARD" },
  { slug: "memory-leaks", name: "Memory Leaks", description: "Detect and fix memory leaks", category: "PERFORMANCE", difficulty: "EXPERT" },
  { slug: "http-basics", name: "HTTP Basics", description: "HTTP methods & status codes", category: "NETWORK", difficulty: "EASY" },
  { slug: "cors-deep-dive", name: "CORS Deep Dive", description: "CORS preflight & policies", category: "NETWORK", difficulty: "MEDIUM" },
  { slug: "cache-strategies", name: "Cache Strategies", description: "Browser caching patterns", category: "NETWORK", difficulty: "HARD" },
  { slug: "websocket", name: "WebSocket", description: "Real-time communication", category: "NETWORK", difficulty: "MEDIUM" },
  { slug: "grid-layout", name: "Grid Layout", description: "CSS Grid deep dive", category: "CSS MASTERY", difficulty: "MEDIUM" },
  { slug: "flexbox-mastery", name: "Flexbox Mastery", description: "Flexbox advanced patterns", category: "CSS MASTERY", difficulty: "EASY" },
  { slug: "animation", name: "Animation", description: "High-performance animations", category: "CSS MASTERY", difficulty: "HARD" },
  { slug: "css-architecture", name: "CSS Architecture", description: "Scalable CSS systems", category: "CSS MASTERY", difficulty: "EXPERT" },
  { slug: "webpack-basics", name: "Webpack Basics", description: "Webpack configuration", category: "TOOLING", difficulty: "MEDIUM" },
  { slug: "vite-mastery", name: "Vite Mastery", description: "Vite plugin development", category: "TOOLING", difficulty: "HARD" },
  { slug: "eslint-rules", name: "ESLint Rules", description: "Custom ESLint rules", category: "TOOLING", difficulty: "EXPERT" },
  { slug: "ci-cd-pipeline", name: "CI/CD Pipeline", description: "GitHub Actions workflow", category: "TOOLING", difficulty: "MEDIUM" },
]

const categories = [
  { name: "AI CHALLENGES", icon: "[AI]" },
  { name: "FRONTEND PRINCIPLES", icon: "[FUNDAMENTALS]" },
  { name: "PERFORMANCE", icon: "[PERF]" },
  { name: "NETWORK", icon: "[NET]" },
  { name: "CSS MASTERY", icon: "[CSS]" },
  { name: "TOOLING", icon: "[TOOLS]" },
]

const difficultyColors: Record<string, { color: string; border: string }> = {
  EASY: { color: "var(--success)", border: "var(--success)" },
  MEDIUM: { color: "var(--warning)", border: "var(--warning)" },
  HARD: { color: "var(--chart-3)", border: "var(--chart-3)" },
  EXPERT: { color: "var(--error)", border: "var(--error)" },
}

export function CommandPaletteWrapper() {
  const router = useRouter()
  const t = useTranslations("commandPalette")

  const groupedChallenges = React.useMemo(() => {
    const groups: Record<string, Challenge[]> = {}
    challenges.forEach((challenge) => {
      if (!groups[challenge.category]) {
        groups[challenge.category] = []
      }
      groups[challenge.category].push(challenge)
    })
    return groups
  }, [])

  return (
    <CommandPalette 
      title={t("title")} 
      description={t("description")}
      searchText={t("title")}
    >
      <CommandInput placeholder={t("placeholder")} />
      <CommandList>
        <CommandEmpty>{t("noResults")}</CommandEmpty>
        
        <CommandGroup heading={t("navigation")}>
          <CommandItem onSelect={() => router.push("/")}>
            <span>&gt; {t("home")}</span>
            <span className="ml-2 opacity-60">{t("homeDesc")}</span>
          </CommandItem>
          <CommandItem onSelect={() => router.push("/challenge/event-loop")}>
            <span>&gt; Event Loop</span>
            <span className="ml-2 opacity-60">{t("sampleChallenge")}</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        {categories.map((category) => (
          <CommandGroup key={category.name} heading={`${category.icon} ${category.name}`}>
            {groupedChallenges[category.name]?.map((challenge) => (
              <CommandItem
                key={challenge.slug}
                onSelect={() => router.push(`/challenge/${challenge.slug}`)}
              >
                <span>&gt; {challenge.name}</span>
                <span className="ml-2 opacity-60">$ {challenge.description}</span>
                <span 
                  className="ml-auto text-[10px] px-1.5 py-0.5"
                  style={{ 
                    color: difficultyColors[challenge.difficulty]?.color,
                    border: `1px solid ${difficultyColors[challenge.difficulty]?.border}`
                  }}
                >
                  {challenge.difficulty}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        
        <CommandSeparator />
        
        <CommandGroup heading={t("system")}>
          <CommandItem onSelect={() => console.log("Status: Ready")}>
            <span>&gt; {t("systemStatus")}</span>
            <span className="ml-2 opacity-60">{t("systemStatusDesc")}</span>
          </CommandItem>
          <CommandItem onSelect={() => console.log("Clear cache")}>
            <span>&gt; {t("clearCache")}</span>
            <span className="ml-2 opacity-60">{t("clearCacheDesc")}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandPalette>
  )
}
