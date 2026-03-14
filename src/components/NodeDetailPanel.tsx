'use client';

import React from 'react';
import Link from 'next/link';
import { ChallengeNode as ChallengeNodeType } from '@/lib/types/skill-tree';
import { useLocale } from 'next-intl';

interface NodeDetailPanelProps {
  node: ChallengeNodeType | null;
  isExpanded: boolean;
  isLoggedIn: boolean;
}

const difficultyColors: Record<string, string> = {
  EASY: 'var(--success)',
  MEDIUM: 'var(--warning)',
  HARD: 'var(--destructive)',
  EXPERT: 'var(--error)',
};

const statusLabels: Record<string, { label: string; color: string }> = {
  locked: { label: 'LOCKED', color: 'var(--muted-foreground)' },
  available: { label: 'AVAILABLE', color: 'var(--primary)' },
  completed: { label: 'COMPLETED', color: 'var(--success)' },
  selected: { label: 'AVAILABLE', color: 'var(--primary)' },
};

export default function NodeDetailPanel({
  node,
  isExpanded,
  isLoggedIn,
}: NodeDetailPanelProps) {
  const locale = useLocale();

  if (!node) {
    return (
      <div className="node-detail-panel p-4">
        <p className="text-sm opacity-60 text-center">
          &gt; hover or click a node to view details
        </p>
      </div>
    );
  }

  const status = statusLabels[node.status] || statusLabels.available;
  const difficultyColor = difficultyColors[node.difficulty] || 'var(--foreground)';

  return (
    <div
      className={`node-detail-panel ${isExpanded ? 'node-detail-panel-expanded' : ''} p-4`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold">
              {node.name}
            </h3>
            <span
              className="text-xs px-2 py-0.5 border inline-block mt-1"
              style={{
                color: difficultyColor,
                borderColor: difficultyColor
              }}
            >
              {node.difficulty}
            </span>
          </div>
          <span
            className="text-xs px-2 py-1 font-bold"
            style={{ color: status.color }}
          >
            [{status.label}]
          </span>
        </div>

        {node.description && (
          <p className="text-sm opacity-80 mb-3">
            $ {node.description}
          </p>
        )}

        {isLoggedIn && isExpanded && (
          <>
            {node.prerequisites.length > 0 && (
              <div className="mb-2">
                <span className="text-xs opacity-60">prerequisites: </span>
                <span className="text-xs">
                  {node.prerequisites.join(', ')}
                </span>
              </div>
            )}

            {node.unlocks.length > 0 && (
              <div className="mb-3">
                <span className="text-xs opacity-60">unlocks: </span>
                <span className="text-xs">
                  {node.unlocks.join(', ')}
                </span>
              </div>
            )}
          </>
        )}

        <div className="flex gap-3 mt-4">
          {node.status !== 'locked' ? (
            <Link
              href={`/${locale}/challenge/${node.slug}`}
              className="btn-terminal text-xs"
            >
              START CHALLENGE
            </Link>
          ) : (
            <button
              className="btn-terminal text-xs opacity-50 cursor-not-allowed"
              disabled
            >
              START CHALLENGE
            </button>
          )}

          <Link
            href={`/${locale}/challenge/${node.slug}`}
            className="outline-button text-xs"
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </div>
  );
}
