"use client";

import { useState, useEffect } from "react";
import { AsciiArtTypewriter } from "./AsciiArtTypewriter";
import { TerminalTypewriter } from "./TerminalTypewriter";

interface TypewriterItem {
  label: string;
  value: string;
}

interface SyncedTypewriterProps {
  logoLines: string[];
  infoItems: TypewriterItem[];
  logoDelay?: number;
  textDelay?: number;
  className?: string;
}

export function SyncedTypewriter({
  logoLines,
  infoItems,
  logoDelay = 50,
  textDelay = 2000,
  className = "",
}: SyncedTypewriterProps) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex flex-col md:flex-row gap-px items-start ${className}`}>
      <div className="flex-shrink-0">
        {started && (
          <AsciiArtTypewriter 
            lines={logoLines}
            lineDelay={logoDelay}
            className="text-primary"
          />
        )}
      </div>
      <div className="flex-1">
        {started && (
          <TerminalTypewriter 
            items={infoItems}
            lineDelay={textDelay}
          />
        )}
      </div>
    </div>
  );
}
