"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseTypewriterOptions {
  lines: string[]
  charDelay?: number
  lineDelay?: number
}

export function useTypewriter({
  lines,
  charDelay = 30,
  lineDelay = 350,
}: UseTypewriterOptions) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(true)

  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setShouldAnimate(!mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldAnimate(!e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (lines.length === 0) return

    if (!shouldAnimate) {
      setDisplayedLines(lines)
      setIsComplete(true)
      return
    }

    clearAllTimeouts()

    const allChars: { char: string; lineIndex: number }[] = []
    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        allChars.push({ char: "\n", lineIndex: -1 })
      }
      for (let i = 0; i < line.length; i++) {
        allChars.push({ char: line[i], lineIndex })
      }
    })

    let currentLineIndex = 0
    let currentCharIndex = 0

    const processNextChar = () => {
      if (currentLineIndex >= lines.length) {
        setIsComplete(true)
        return
      }

      const currentLine = lines[currentLineIndex]

      if (currentCharIndex >= currentLine.length) {
        setDisplayedLines((prev) => [...prev, currentLine])
        currentLineIndex++
        currentCharIndex = 0

        if (currentLineIndex < lines.length) {
          const timeout = setTimeout(processNextChar, lineDelay)
          timeoutsRef.current.push(timeout)
        } else {
          setIsComplete(true)
        }
        return
      }

      const currentText = currentLine.substring(0, currentCharIndex + 1)
      setDisplayedLines((prev) => {
        const newLines = [...prev]
        newLines[currentLineIndex] = currentText
        return newLines
      })

      currentCharIndex++
      const timeout = setTimeout(processNextChar, charDelay)
      timeoutsRef.current.push(timeout)
    }

    const initialTimeout = setTimeout(processNextChar, lineDelay)
    timeoutsRef.current.push(initialTimeout)

    return () => {
      clearAllTimeouts()
    }
  }, [lines, charDelay, lineDelay, shouldAnimate, clearAllTimeouts])

  return { displayedLines, isComplete }
}
