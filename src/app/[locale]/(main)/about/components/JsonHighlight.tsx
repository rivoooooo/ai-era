"use client"

import { ReactElement } from "react"

interface JsonHighlightProps {
  content: string
}

export function JsonHighlight({ content }: JsonHighlightProps) {
  const highlightJson = (json: string) => {
    const lines = json.split("\n")

    return lines.map((line, lineIndex) => {
      // Comment line
      if (line.trim().startsWith("//")) {
        return (
          <div key={lineIndex} className="font-mono">
            <span style={{ color: "var(--muted-foreground)", fontStyle: "italic", opacity: 0.6 }}>
              {line}
            </span>
          </div>
        )
      }

      const parts: ReactElement[] = []
      let remaining = line
      let keyIndex = 0

      // Handle indentation
      const indentMatch = remaining.match(/^(\s+)/)
      if (indentMatch) {
        parts.push(
          <span key={`indent-${lineIndex}`}>{indentMatch[1]}</span>
        )
        remaining = remaining.slice(indentMatch[0].length)
      }

      // Check for key: value pattern
      const keyValueMatch = remaining.match(/^"([\w-@/]+)"(\s*:\s*)(.+)$/)
      if (keyValueMatch) {
        const [, key, colon, rest] = keyValueMatch
        
        // Key (primary color)
        parts.push(
          <span key={`key-${lineIndex}-${keyIndex}`} style={{ color: "var(--primary)" }}>
            &ldquo;{key}&rdquo;
          </span>
        )
        keyIndex++
        
        // Colon (muted)
        parts.push(
          <span key={`colon-${lineIndex}-${keyIndex}`} style={{ color: "var(--muted-foreground)" }}>
            {colon}
          </span>
        )
        keyIndex++

        // Process value part
        const commentIdx = rest.indexOf("//")
        if (commentIdx > -1) {
          const value = rest.slice(0, commentIdx)
          const comment = rest.slice(commentIdx)
          
          // Value (secondary color)
          parts.push(
            <span key={`value-${lineIndex}-${keyIndex}`} style={{ color: "var(--secondary)" }}>
              {value}
            </span>
          )
          keyIndex++
          
          // Comment (muted italic)
          parts.push(
            <span key={`comment-${lineIndex}-${keyIndex}`} style={{ color: "var(--muted-foreground)", fontStyle: "italic", opacity: 0.6 }}>
              {comment}
            </span>
          )
        } else {
          // Check if it's a number
          if (/^\d/.test(rest.trim())) {
            parts.push(
              <span key={`number-${lineIndex}-${keyIndex}`} style={{ color: "var(--success)" }}>
                {rest}
              </span>
            )
          } else {
            // String value (secondary)
            parts.push(
              <span key={`value-${lineIndex}-${keyIndex}`} style={{ color: "var(--secondary)" }}>
                {rest}
              </span>
            )
          }
        }
        
        return <div key={lineIndex} className="font-mono">{parts}</div>
      }

      // Braces and brackets (muted)
      return (
        <div key={lineIndex} className="font-mono" style={{ color: "var(--muted-foreground)" }}>
          {line}
        </div>
      )
    })
  }

  return (
    <div className="bg-card border border-border border-l-[3px] border-l-primary p-6 md:p-8 overflow-x-auto text-[13px] leading-[2]">
      {highlightJson(content)}
    </div>
  )
}
