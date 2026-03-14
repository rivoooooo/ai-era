'use client';

import type { RoadmapNode } from '@/lib/roadmap/types';

interface ProgressStatsProps {
  nodes: RoadmapNode[];
}

export function ProgressStats({ nodes }: ProgressStatsProps) {
  const total = nodes.length;
  const completed = nodes.filter((n) => n.status === 'completed').length;
  const inProgress = nodes.filter((n) => n.status === 'in_progress').length;
  const available = nodes.filter((n) => n.status === 'available').length;
  const locked = nodes.filter((n) => n.status === 'locked').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const barLength = 20;
  const filledLength = Math.round((percentage / 100) * barLength);
  const progressBar =
    '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

  return (
    <div
      className="bg-card border border-border p-4 min-w-[280px]"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold uppercase text-muted-foreground">
          +─── PROGRESS ───+
        </span>
      </div>

      <div className="mb-4">
        <div className="text-primary text-sm mb-1">
          {progressBar} {percentage}%
        </div>
        <div className="text-xs text-muted-foreground">
          {completed}/{total} nodes completed
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-success">●</span>
          <span className="text-muted-foreground">Completed:</span>
          <span className="font-bold">{completed}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-warning">●</span>
          <span className="text-muted-foreground">In Progress:</span>
          <span className="font-bold">{inProgress}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary">●</span>
          <span className="text-muted-foreground">Available:</span>
          <span className="font-bold">{available}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">●</span>
          <span className="text-muted-foreground">Locked:</span>
          <span className="font-bold">{locked}</span>
        </div>
      </div>
    </div>
  );
}
