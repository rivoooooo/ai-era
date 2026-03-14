"use client"

import { useCallback, useRef } from "react"

const CHARS = "!<>-_\\/[]{}—=+*^?#01"

export function useTextScramble() {
  const frameRef = useRef<number | null>(null)

  const scramble = useCallback((el: HTMLElement, originalText: string) => {
    const length = originalText.length
    let frame = 0
    const queue = originalText.split("").map((char, i) => ({
      to: char,
      start: Math.floor(Math.random() * 20),
      end: Math.floor(Math.random() * 20) + 20,
      char: "",
    }))

    const update = () => {
      let output = ""
      let complete = 0

      queue.forEach((item) => {
        if (frame >= item.end) {
          complete++
          output += item.to
        } else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = CHARS[Math.floor(Math.random() * CHARS.length)]
          }
          output += `<span style="opacity:0.4;font-family:monospace">${item.char}</span>`
        } else {
          output += item.to
        }
      })

      el.innerHTML = output
      if (complete < length) {
        frameRef.current = requestAnimationFrame(update)
        frame++
      }
    }

    cancelAnimationFrame(frameRef.current!)
    update()
  }, [])

  return scramble
}
