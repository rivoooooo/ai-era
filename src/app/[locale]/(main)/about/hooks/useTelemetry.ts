"use client"

import { useState, useEffect, useRef } from "react"

interface TelemetryData {
  mouseX: number
  mouseY: number
  uptime: string
}

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    mouseX: 0,
    mouseY: 0,
    uptime: "00:00:00",
  })

  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTelemetry((prev) => ({
        ...prev,
        mouseX: e.clientX,
        mouseY: e.clientY,
      }))
    }

    window.addEventListener("mousemove", handleMouseMove)

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const hours = Math.floor(elapsed / 3600000)
      const minutes = Math.floor((elapsed % 3600000) / 60000)
      const seconds = Math.floor((elapsed % 60000) / 1000)
      
      setTelemetry((prev) => ({
        ...prev,
        uptime: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      }))
    }, 1000)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(interval)
    }
  }, [])

  return telemetry
}
