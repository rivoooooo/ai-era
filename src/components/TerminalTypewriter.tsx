"use client";

import { useState, useEffect, useRef } from "react";

interface TypewriterItem {
  label: string;
  value: string;
}

interface TerminalTypewriterProps {
  items: TypewriterItem[];
  lineDelay?: number;
  className?: string;
}

export function TerminalTypewriter({
  items,
  lineDelay = 1000,
  className = "",
}: TerminalTypewriterProps) {
  const [displayedItems, setDisplayedItems] = useState<number>(0);
  const itemRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (itemRef.current < items.length) {
        itemRef.current += 1;
        setDisplayedItems(itemRef.current);
      } else {
        clearInterval(interval);
      }
    }, lineDelay);

    return () => clearInterval(interval);
  }, [items.length, lineDelay]);

  return (
    <div className={`font-mono text-sm ${className}`}>
      {items.map((item, index) => {
        const isVisible = index < displayedItems;
        
        if (!isVisible) {
          return <div key={index} className="mb-1 h-5" />;
        }
        
        return (
          <div key={index} className="mb-1">
            <span className="text-primary">{item.label}:</span>
            <span className="text-primary/60"> {item.value}</span>
          </div>
        );
      })}
    </div>
  );
}
