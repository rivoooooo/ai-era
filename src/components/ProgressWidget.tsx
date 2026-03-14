'use client';

import React, { useState } from 'react';

interface ProgressWidgetProps {
  total: number;
  completed: number;
  byDifficulty: Record<string, { total: number; completed: number }>;
  isLoggedIn: boolean;
}

const DIFFICULTY_ORDER = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const filled = total > 0 ? Math.round((completed / total) * 12) : 0;
  const empty = 12 - filled;
  
  return (
    <span className="progress-bar-chars">
      {'█'.repeat(filled)}{'░'.repeat(empty)}
    </span>
  );
}

export default function ProgressWidget({
  total,
  completed,
  byDifficulty,
  isLoggedIn,
}: ProgressWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const displayTotal = isLoggedIn ? total : '--';
  const displayCompleted = isLoggedIn ? completed : '--';
  const displayPercentage = isLoggedIn ? `${percentage}%` : '--';

  return (
    <div className="progress-widget">
      <div 
        className="cursor-pointer flex justify-between items-center mb-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--primary)' }}>
          Progress
        </span>
        <span className="text-xs opacity-60">
          {isCollapsed ? '[+]' : '[-]'}
        </span>
      </div>
      
      {!isCollapsed && (
        <>
          <div className="border-b border-border mb-2 pb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>{displayCompleted} / {displayTotal}</span>
              <span>{displayPercentage}</span>
            </div>
            <ProgressBar completed={completed} total={total} />
          </div>
          
          <div className="space-y-1">
            {DIFFICULTY_ORDER.map((diff) => {
              const diffData = byDifficulty[diff];
              if (!diffData || diffData.total === 0) return null;
              
              const displayDiffCompleted = isLoggedIn ? diffData.completed : '--';
              const displayDiffTotal = isLoggedIn ? diffData.total : '--';
              
              return (
                <div key={diff} className="flex justify-between text-xs">
                  <span className="opacity-70">{diff}</span>
                  <span>{displayDiffCompleted}/{displayDiffTotal}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
