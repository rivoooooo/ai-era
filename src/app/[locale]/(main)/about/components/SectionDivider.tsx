"use client"

interface SectionDividerProps {
  current: number
  total: number
}

export function SectionDivider({ current, total }: SectionDividerProps) {
  return (
    <div className="overflow-hidden select-none py-8">
      <div
        className="text-border/40 text-xs tracking-widest whitespace-nowrap font-mono"
      >
        {'─'.repeat(60)}
        {` // section ${current} of ${total} `}
        {'─'.repeat(200)}
      </div>
    </div>
  )
}
