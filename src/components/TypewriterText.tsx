"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface TypewriterTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

type Phase = "typing" | "pausing" | "deleting";

export function TypewriterText({
  texts,
  typingSpeed = 150,
  deletingSpeed = 80,
  pauseDuration = 5000,
  prefix = "> ",
  suffix = "_",
  className = "",
}: TypewriterTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const charIndexRef = useRef(0);

  const currentFullText = texts[currentTextIndex];

  const nextText = useCallback(() => {
    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    charIndexRef.current = 0;
    setPhase("typing");
  }, [texts.length]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const scheduleNext = (callback: () => void, delay: number) => {
      timeout = setTimeout(callback, delay);
    };

    switch (phase) {
      case "typing": {
        if (charIndexRef.current < currentFullText.length) {
          scheduleNext(() => {
            charIndexRef.current += 1;
            setDisplayText(currentFullText.slice(0, charIndexRef.current));
          }, typingSpeed);
        } else {
          scheduleNext(() => {
            setPhase("pausing");
          }, 0);
        }
        break;
      }

      case "pausing": {
        scheduleNext(() => {
          setPhase("deleting");
        }, pauseDuration);
        break;
      }

      case "deleting": {
        if (displayText.length > 0) {
          scheduleNext(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, deletingSpeed);
        } else {
          scheduleNext(() => {
            nextText();
          }, 0);
        }
        break;
      }
    }

    return () => clearTimeout(timeout);
  }, [
    phase,
    displayText,
    currentFullText,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    nextText,
  ]);

  return (
    <span className={className}>
      {prefix}
      {displayText}
      {suffix}
    </span>
  );
}
