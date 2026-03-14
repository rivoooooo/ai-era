'use client';

import React from 'react';
import { ChallengeNode as ChallengeNodeType } from '@/lib/types/skill-tree';

interface ChallengeNodeProps {
  node: ChallengeNodeType;
  isSelected: boolean;
  onClick: (node: ChallengeNodeType) => void;
  reducedMotion: boolean;
  animationDelay?: number;
}

const difficultyColors: Record<string, string> = {
  EASY: 'var(--success)',
  MEDIUM: 'var(--warning)', 
  HARD: 'var(--destructive)',
  EXPERT: 'var(--error)',
};

export default function ChallengeNode({
  node,
  isSelected,
  onClick,
  reducedMotion,
  animationDelay = 0,
}: ChallengeNodeProps) {
  const getStatusClass = () => {
    if (isSelected) return 'skill-node-selected';
    switch (node.status) {
      case 'locked':
        return 'skill-node-locked';
      case 'available':
        return 'skill-node-available';
      case 'completed':
        return 'skill-node-completed';
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (node.status !== 'locked') {
      onClick(node);
    }
  };

  const animationStyle = reducedMotion
    ? {}
    : {
        animationDelay: `${animationDelay}ms`,
      };

  return (
    <div
      className={`skill-node ${getStatusClass()}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        ...animationStyle,
      }}
      onClick={handleClick}
      role="button"
      tabIndex={node.status !== 'locked' ? 0 : -1}
      aria-label={`${node.name} - ${node.status}`}
      aria-disabled={node.status === 'locked'}
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className="difficulty-badge"
          style={{
            color: difficultyColors[node.difficulty],
            borderColor: difficultyColors[node.difficulty],
          }}
        >
          {node.difficulty}
        </span>
        {node.status === 'locked' && (
          <span className="text-xs opacity-60">[X]</span>
        )}
        {node.status === 'completed' && (
          <span className="text-xs" style={{ color: 'var(--primary)' }}>[✓]</span>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <span className="text-[11px] font-medium truncate text-center leading-tight">
          {node.name}
        </span>
      </div>
      
      <div className="mt-1">
        <span className="text-[10px] opacity-60 truncate block">
          $ {node.slug}
        </span>
      </div>
    </div>
  );
}
