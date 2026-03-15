"use client"

import { useEffect, useRef, useState, useMemo } from "react"

const GLITCH_CHARS = "▓▒░█■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯▰▱◆◇■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯▰▱●○◐◑◒◓"

function getRandomGlitchText(length: number): string {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
  }
  return result
}

export function TerminalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const originalText = useMemo(() => ({
    line1: "We are building the training ground",
    line2: "developers actually need.",
  }), [])

  const [glitchText, setGlitchText] = useState(originalText)

  const chars = "01>$#[]|─░▒▓ .,:;"
  const mousePos = useRef({ x: -1000, y: -1000 })
  const scanY = useRef(0)
  const time = useRef(0)

  useEffect(() => {
    if (!isHovered) {
      setGlitchText(originalText)
      return
    }

    const interval = setInterval(() => {
      setGlitchText({
        line1: getRandomGlitchText(originalText.line1.length),
        line2: getRandomGlitchText(originalText.line2.length),
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isHovered, originalText])

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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    resize()
    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", handleMouseMove)

    const cols = Math.floor(canvas.offsetWidth / 14)
    const rows = Math.floor(canvas.offsetHeight / 20)
    const grid: { char: string; x: number; y: number; noise: number }[] = []

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

      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--background") || "#000"
      ctx.fillRect(0, 0, width, height)

      scanY.current = (scanY.current + 1) % rows
      time.current += 0.016

      grid.forEach((cell) => {
        const dx = cell.x - mousePos.current.x
        const dy = cell.y - mousePos.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const isScanline = Math.floor(cell.y / 20) === scanY.current

        let char = cell.char
        let opacity = 0.15 + cell.noise * 0.15
        let color = getComputedStyle(canvas).getPropertyValue("--border") || "#333"

        if (dist < 150) {
          char = Math.random() > 0.5 ? "0" : "1"
          opacity = 0.3 + (1 - dist / 150) * 0.5
          color = getComputedStyle(canvas).getPropertyValue("--primary") || "#0f0"
        }

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
  }, [])

  return (
    <div className="relative h-[70vh] w-full overflow-hidden border-b border-border">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.03) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-7xl px-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="font-bold break-all text-foreground cursor-default select-none transition-all duration-75"
          style={{
            fontSize: "clamp(36px, 3vw, 64px)",
            lineHeight: 1.2,
            fontFamily: "'JetBrains Mono', monospace",
            textShadow: isHovered ? "0 0 10px var(--primary), 0 0 20px var(--primary)" : "none",
          }}
        >
          {glitchText.line1}
          <br />
          {glitchText.line2}
        </div>
        <div className="mt-3 text-xs text-muted-foreground italic font-mono">
          {"// Exploring the delta between learning and doing."}
        </div>
      </div>
    </div>
  )
}
