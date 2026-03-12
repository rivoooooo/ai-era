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

const challenges: Challenge[] = []

const categories: { name: string; icon: string }[] = []

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
