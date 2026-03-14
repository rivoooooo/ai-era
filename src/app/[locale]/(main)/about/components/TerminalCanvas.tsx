"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTextScramble } from "../hooks/useTextScramble"

interface TerminalCanvasProps {
  onMouseMove?: (x: number, y: number) => void
}

export function TerminalCanvas({ onMouseMove }: TerminalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const scramble = useTextScramble()

  const chars = "01>$#[]|─░▒▓ .,:;"
  const mousePos = useRef({ x: -1000, y: -1000 })
  const scanY = useRef(0)
  const time = useRef(0)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mousePos.current = { x, y }
    onMouseMove?.(e.clientX, e.clientY)
  }, [onMouseMove])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", handleMouseMove)

    const cols = Math.floor(canvas.offsetWidth / 14)
    const rows = Math.floor(canvas.offsetHeight / 20)
    const grid: { char: string; x: number; y: number; noise: number }[] = []

    // Initialize grid
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (Math.random() < 0.2) {
          grid.push({
            char: chars[Math.floor(Math.random() * chars.length)],
            x: x * 14 + 7,
            y: y * 20 + 14,
            noise: Math.random(),
          })
        }
      }
    }

    let animationId: number

    const render = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      // Clear with background color
      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--background") || "#000"
      ctx.fillRect(0, 0, width, height)

      // Update scanline
      scanY.current = (scanY.current + 1) % rows
      time.current += 0.016

      // Draw characters
      grid.forEach((cell) => {
        const dx = cell.x - mousePos.current.x
        const dy = cell.y - mousePos.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const isScanline = Math.floor(cell.y / 20) === scanY.current

        let char = cell.char
        let opacity = 0.15 + cell.noise * 0.15
        let color = getComputedStyle(canvas).getPropertyValue("--border") || "#333"

        // Mouse disturbance
        if (dist < 150) {
          char = Math.random() > 0.5 ? "0" : "1"
          opacity = 0.3 + (1 - dist / 150) * 0.5
          color = getComputedStyle(canvas).getPropertyValue("--primary") || "#0f0"
        }

        // Scanline highlight
        if (isScanline) {
          opacity = 0.6 + Math.sin(time.current * 3) * 0.2
          color = getComputedStyle(canvas).getPropertyValue("--primary") || "#0f0"
        }

        ctx.fillStyle = color
        ctx.globalAlpha = opacity
        ctx.font = "12px 'JetBrains Mono', monospace"
        ctx.fillText(char, cell.x, cell.y)
      })

      ctx.globalAlpha = 1

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [handleMouseMove])

  const handleMouseEnter = () => {
    if (headlineRef.current) {
      scramble(headlineRef.current, "We are building the training ground\ndevelopers actually need.")
    }
  }

  return (
    <div className="relative h-[70vh] w-full overflow-hidden border-b border-border">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.03) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Headline */}
      <div className="absolute bottom-8 left-8 z-10 max-w-4xl">
        <div
          ref={headlineRef}
          onMouseEnter={handleMouseEnter}
          className="font-bold text-foreground cursor-none"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            lineHeight: 1.2,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          We are building the training ground
          <br />
          developers actually need.
        </div>
        <div className="mt-3 text-xs text-muted-foreground italic font-mono">
          // Exploring the delta between learning and doing.
        </div>
      </div>
    </div>
  )
}
