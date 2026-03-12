"use client";

import { useState, useEffect, useRef } from "react";

interface AsciiArtTypewriterProps {
  lines: string[];
  lineDelay?: number;
  className?: string;
}

export function AsciiArtTypewriter({
  lines,
  lineDelay = 50,
  className = "",
}: AsciiArtTypewriterProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const lineRef = useRef(0);
  const charRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lineRef.current < lines.length) {
        const currentLine = lines[lineRef.current];
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          const currentDisplayed = newLines[lineRef.current] || "";
          if (currentDisplayed.length < currentLine.length) {
            newLines[lineRef.current] = currentLine + currentLine[currentDisplayed.length];
          } else {
            lineRef.current += 1;
            charRef.current = 0;
          }
          return newLines;
        });
      } else {
        clearInterval(interval);
      }
    }, lineDelay);

    return () => clearInterval(interval);
  }, [lines, lineDelay]);

  return (
    <pre className={`font-mono text-xs md:text-sm leading-none ${className}`}>
      {lines.map((line, index) => (
        <div key={index} className="whitespace-pre">
          {displayedLines[index] || ""}
        </div>
      ))}
    </pre>
  );
}
