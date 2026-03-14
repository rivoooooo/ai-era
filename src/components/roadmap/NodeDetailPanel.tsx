'use client';

import { motion } from 'motion/react';
import type { RoadmapNode, NodeStatus } from '@/lib/roadmap/types';

interface NodeDetailPanelProps {
  node: RoadmapNode;
  onClose: () => void;
  onStatusChange: (status: NodeStatus) => void;
}

const STATUS_OPTIONS: { value: NodeStatus; label: string; color: string }[] = [
  { value: 'locked', label: 'Locked', color: 'var(--muted-foreground)' },
  { value: 'available', label: 'Available', color: 'var(--primary)' },
  { value: 'in_progress', label: 'In Progress', color: 'var(--warning)' },
  { value: 'completed', label: 'Completed', color: 'var(--success)' },
];

export function NodeDetailPanel({
  node,
  onClose,
  onStatusChange,
}: NodeDetailPanelProps) {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-6">
        <div className="flex justify-between items-start mb-4">
          <span
            className="text-xs font-bold uppercase px-2 py-1 border"
            style={{
              color: STATUS_OPTIONS.find((s) => s.value === node.status)?.color,
              borderColor: STATUS_OPTIONS.find((s) => s.value === node.status)?.color,
            }}
          >
            {node.status}
          </span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            [X]
          </button>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {node.title}
        </h2>
        <p className="text-sm text-muted-foreground">{node.description}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Selection */}
        <div>
          <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">
            Update Status
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={`p-3 text-sm font-medium border transition-all ${
                  node.status === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:border-primary'
                }`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar (if in progress) */}
        {node.status === 'in_progress' && (
          <div>
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">
              Progress
            </h3>
            <div className="w-full h-2 bg-muted">
              <div
                className="h-full bg-warning transition-all"
                style={{ width: `${node.progress || 0}%` }}
              />
            </div>
            <p className="text-right text-sm mt-1 text-muted-foreground">
              {node.progress || 0}%
            </p>
          </div>
        )}

        {/* Estimated Time */}
        {node.estimatedTime && (
          <div>
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">
              Estimated Time
            </h3>
            <p className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              [T] {node.estimatedTime}
            </p>
          </div>
        )}

        {/* Requirements */}
        {node.requirements && node.requirements.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">
              Requirements
            </h3>
            <ul className="space-y-2">
              {node.requirements.map((req, index) => (
                <li
                  key={index}
                  className="text-sm flex items-center gap-2"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  <span className="text-primary">▸</span>
                  {req.type === 'complete_node' && `Complete: ${req.target}`}
                  {req.type === 'achievement' && `Achievement: ${req.target}`}
                  {req.type === 'skill_level' && `Level ${req.value} required`}
                  {req.type === 'time' && `Time: ${req.target}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resources */}
        {node.resources && node.resources.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              {node.resources.map((resource, index) => (
                <li key={index}>
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-2"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      <span>
                        {resource.type === 'link' && '[L]'}
                        {resource.type === 'video' && '[V]'}
                        {resource.type === 'article' && '[A]'}
                        {resource.type === 'tool' && '[T]'}
                      </span>
                      {resource.title}
                    </a>
                  ) : (
                    <span
                      className="text-sm flex items-center gap-2"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      <span>
                        {resource.type === 'link' && '[L]'}
                        {resource.type === 'video' && '[V]'}
                        {resource.type === 'article' && '[A]'}
                        {resource.type === 'tool' && '[T]'}
                      </span>
                      {resource.title}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rewards */}
        {node.rewards && node.rewards.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">
              Rewards
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {node.rewards.map((reward, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted border border-border text-center"
                >
                  <div className="text-lg mb-1 font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {reward.type === 'xp' && '[XP]'}
                    {reward.type === 'badge' && '[B]'}
                    {reward.type === 'item' && '[I]'}
                    {reward.type === 'title' && '[T]'}
                  </div>
                  <p
                    className="text-xs font-bold"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {reward.type === 'xp' && `+${reward.value} XP`}
                    {reward.type === 'badge' && reward.value}
                    {reward.type === 'item' && reward.value}
                    {reward.type === 'title' && reward.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dependencies */}
        {node.dependencies.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">
              Prerequisites
            </h3>
            <p
              className="text-sm text-muted-foreground"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {node.dependencies.length} node(s) required
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
