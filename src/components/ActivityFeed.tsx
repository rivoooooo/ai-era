"use client"

import { useState, useEffect, useRef } from "react"
import activityData from "@/data/activity.json"

const HANDLES = ["dev_kai", "alex", "tom", "lisa", "sarah", "mike", "newdev", "j0hn"]
const MODULES = ["UI Engineering", "JavaScript Core", "AI Integration", "Debugging", "Performance", "System Design"]
const BADGES = ["Code Ninja", "Bug Hunter", "Speed Demon", "Architect", "Problem Solver", "Fast Learner"]

interface LogEntry {
  id: number
  timestamp: string
  handle: string
  action: string
}

const generateTimestamp = () => {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const generateAction = (): string => {
  const template = getRandomElement(activityData as string[])
  return template
    .replace("%n", String(Math.floor(Math.random() * 900) + 100))
    .replace("%l", String(Math.floor(Math.random() * 10) + 3))
    .replace("%m", getRandomElement(MODULES))
    .replace("%b", getRandomElement(BADGES))
}

const createLogEntry = (): LogEntry => ({
  id: Date.now() + Math.random(),
  timestamp: generateTimestamp(),
  handle: getRandomElement(HANDLES),
  action: generateAction(),
})

const createInitialLogs = (): LogEntry[] => 
  Array.from({ length: 5 }, () => createLogEntry())

export function ActivityFeed() {
  const [logs, setLogs] = useState<LogEntry[]>(createInitialLogs)
  const [online, setOnline] = useState(12)
  const [solving, setSolving] = useState(4)
  const [today, setToday] = useState(47)
  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogs((prevLogs) => {
        const newEntry = createLogEntry()
        const updatedLogs = [...prevLogs, newEntry]
        if (updatedLogs.length > 20) {
          return updatedLogs.slice(-20)
        }
        return updatedLogs
      })
    }, 5000)

    const statsInterval = setInterval(() => {
      setOnline((prev) => Math.max(8, Math.min(20, prev + Math.floor(Math.random() * 3) - 1)))
      setSolving((prev) => Math.max(2, Math.min(8, prev + Math.floor(Math.random() * 3) - 1)))
    }, 3000)

    const todayInterval = setInterval(() => {
      setToday((prev) => prev + 1)
    }, 30000)

    return () => {
      clearInterval(logInterval)
      clearInterval(statsInterval)
      clearInterval(todayInterval)
    }
  }, [])

  return (
    <section className="py-8">
      <h2 className="text-primary text-lg mb-6">
        <span className="text-primary">{`> tail -f /var/log/activity.log`}</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-13 gap-8">
        <div className="lg:col-span-8 relative">
          <div 
            ref={logContainerRef}
            className="h-80 border border-border bg-card p-4 overflow-hidden"
          >
            <div className="space-y-1 font-mono text-sm">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2 py-0.5 animate-fade-in">
                  <span className="text-muted-foreground text-[11px] shrink-0 w-20" suppressHydrationWarning>
                    [{log.timestamp}]
                  </span>
                  <span className="text-secondary font-bold shrink-0 w-20" suppressHydrationWarning>
                    {log.handle}
                  </span>
                  <span className="text-foreground text-[13px]" suppressHydrationWarning>
                    {log.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-primary text-[11px]">
            <span className="animate-blink">▓</span>
            <span>LIVE</span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="border border-border bg-card p-4">
            <div className="text-muted-foreground text-[11px] uppercase mb-2">LIVE STATS</div>
            <div className="text-muted-foreground text-xs border-b border-dashed border-border pb-2 mb-2">───</div>
            <div className="space-y-1 text-sm" key={online}>
              <span className="text-muted-foreground">online:</span>{" "}
              <span className="text-foreground animate-flash">{online}</span>
            </div>
            <div className="space-y-1 text-sm" key={solving}>
              <span className="text-muted-foreground">solving:</span>{" "}
              <span className="text-foreground animate-flash">{solving}</span>
            </div>
            <div className="space-y-1 text-sm" key={today}>
              <span className="text-muted-foreground">today:</span>{" "}
              <span className="text-foreground animate-flash">{today}</span>
            </div>
            <div className="space-y-1 text-sm">
              <span className="text-muted-foreground">streak:</span>{" "}
              <span className="text-foreground">3 days</span>
            </div>
          </div>

          <div className="border border-border bg-card p-4">
            <div className="text-muted-foreground text-[11px] uppercase mb-2">TOP TODAY</div>
            <div className="text-muted-foreground text-xs border-b border-dashed border-border pb-2 mb-2">───</div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">#1</span>{" "}
                <span className="text-secondary">dev_kai</span>{" "}
                <span className="text-success">+840 xp</span>
              </div>
              <div>
                <span className="text-muted-foreground">#2</span>{" "}
                <span className="text-secondary">alex</span>{" "}
                <span className="text-success">+720 xp</span>
              </div>
              <div>
                <span className="text-muted-foreground">#3</span>{" "}
                <span className="text-secondary">sarah</span>{" "}
                <span className="text-success">+560 xp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-flash {
          animation: flash 100ms ease-in-out;
        }
      `}</style>
    </section>
  )
}
