"use client"

import { useEffect, useRef } from "react"

export function TerminalCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const outlineRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Check if mobile/touch device
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
    if (isTouchDevice) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }

    const loop = () => {
      smooth.current.x += (pos.current.x - smooth.current.x) * 0.12
      smooth.current.y += (pos.current.y - smooth.current.y) * 0.12
      if (outlineRef.current) {
        outlineRef.current.style.left = `${smooth.current.x}px`
        outlineRef.current.style.top = `${smooth.current.y}px`
      }
      requestAnimationFrame(loop)
    }

    window.addEventListener("mousemove", onMove)
    loop()

    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed w-[6px] h-[6px] bg-primary pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
      />
      {/* Outer outline */}
      <div
        ref={outlineRef}
        className="fixed w-8 h-8 border border-primary pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 opacity-60 hidden md:block"
      />
    </>
  )
}
