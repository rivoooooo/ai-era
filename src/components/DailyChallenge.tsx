"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLocale } from "next-intl"
import dailyData from "@/data/daily.json"

interface DailyChallenge {
  id: number
  title: string
  difficulty: "easy" | "intermediate" | "hard"
  time: number
  xp: number
  skills: string[]
}

const DIFFICULTY_CONFIG: Record<string, { color: string; label: string }> = {
  easy: { color: "text-success", label: "EASY" },
  intermediate: { color: "text-warning", label: "INTERMEDIATE" },
  hard: { color: "text-error", label: "HARD" },
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      const diff = endOfDay.getTime() - now.getTime()
      const h = Math.floor(diff / 3600000).toString().padStart(2, "0")
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0")
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0")
      setTimeLeft(`${h}:${m}:${s}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return timeLeft
}

export function DailyChallenge() {
  const locale = useLocale()
  const daily: DailyChallenge = dailyData
  const timeLeft = useCountdown()
  const difficultyConfig = DIFFICULTY_CONFIG[daily.difficulty]

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-primary text-lg">
          <span className="text-primary">{`> DAILY MISSION`}</span>
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-success font-mono">[ ACTIVE ]</span>
          <span className="text-warning font-mono">expires in {timeLeft}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-0 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="border border-primary p-4">
            <div className="text-primary text-[11px] uppercase tracking-wider mb-3">
              MISSION BROADCAST
            </div>
            <div className="text-muted-foreground text-xs mb-2">
              #{daily.id}
            </div>
            <div className="text-foreground text-xl font-bold">
              {daily.title}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <span className="text-muted-foreground text-xs block">challenge_id:</span>
              <span className="text-foreground text-sm">#{daily.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block">status:</span>
              <span className="text-success text-sm font-mono">[ ACTIVE ]</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block">expires:</span>
              <span className="text-warning text-sm font-mono">in {timeLeft}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 mt-6 lg:mt-0">
          <div className="mb-4">
            <span className="text-muted-foreground text-[11px] block mb-1">difficulty</span>
            <div className={`${difficultyConfig.color} text-base font-bold border border-dashed ${difficultyConfig.color} px-3 py-1 inline-block`}>
              [{difficultyConfig.label}]
            </div>
          </div>

          <div className="mb-4 space-y-1">
            <div>
              <span className="text-muted-foreground text-xs">time</span>
              <span className="text-foreground text-sm ml-2">{daily.time}min</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">xp</span>
              <span className="text-success text-sm ml-2 font-bold">+{daily.xp}</span>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-muted-foreground text-xs block mb-2">skills:</span>
            <div className="flex flex-wrap gap-2">
              {daily.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] px-2 py-0.5 border border-dashed border-muted-foreground text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <Link
            href={`/${locale}/challenge/${daily.id}`}
            className="block w-full h-11 text-sm font-medium uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center animate-border-blink"
            style={{
              animation: "border-blink 0.5s step-end infinite",
            }}
          >
            [ EXECUTE ]
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes border-blink {
          0%, 100% {
            box-shadow: inset 0 0 0 1px var(--primary);
          }
          50% {
            box-shadow: inset 0 0 0 1px transparent;
          }
        }
      `}</style>
    </section>
  )
}
