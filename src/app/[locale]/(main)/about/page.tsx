"use client"

import { useState, useEffect } from "react"
import { TerminalCanvas } from "./components/TerminalCanvas"
import { PanelZone } from "./components/PanelZone"
import { TerminalCursor } from "./components/TerminalCursor"

export default function AboutPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [uptime, setUptime] = useState("00:00:00")

  useEffect(() => {
    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const hours = Math.floor(elapsed / 3600000)
      const minutes = Math.floor((elapsed % 3600000) / 60000)
      const seconds = Math.floor((elapsed % 60000) / 1000)
      
      setUptime(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (x: number, y: number) => {
    setMousePos({ x, y })
  }

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col cursor-none">
      {/* Custom Cursor */}
      <TerminalCursor />

      {/* Canvas Zone (70vh) */}
      <TerminalCanvas onMouseMove={handleMouseMove} />

      {/* Panel Zone (30vh) */}
      <PanelZone
        uptime={uptime}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
      />
    </div>
  )
}
