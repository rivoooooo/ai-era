'use client';

import React, { useMemo } from 'react';
import { ChallengeNode as ChallengeNodeType, Connection } from '@/lib/types/skill-tree';
import ChallengeNode from './ChallengeNode';

interface SkillTreeCanvasProps {
  nodes: ChallengeNodeType[];
  connections: Connection[];
  selectedNodeId: string | null;
  onNodeClick: (node: ChallengeNodeType) => void;
  filteredOutIds: Set<string>;
  reducedMotion: boolean;
}

const NODE_WIDTH = 120;
const NODE_HEIGHT = 80;
const COL_WIDTH = 200;
const ROW_HEIGHT = 120;
const PADDING = 60;

interface CategoryPosition {
  id: string;
  name: string;
  x: number;
}

function generateBezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const startX = x1 + NODE_WIDTH;
  const startY = y1 + NODE_HEIGHT / 2;
  const endX = x2;
  const endY = y2 + NODE_HEIGHT / 2;
  
  const controlOffset = Math.min((endX - startX) / 2, 80);
  
  return `M ${startX} ${startY}
          C ${startX + controlOffset} ${startY}
            ${endX - controlOffset} ${endY}
            ${endX} ${endY}`;
}

export default function SkillTreeCanvas({
  nodes,
  connections,
  selectedNodeId,
  onNodeClick,
  filteredOutIds,
  reducedMotion,
}: SkillTreeCanvasProps) {
  const canvasWidth = useMemo(() => {
    if (nodes.length === 0) return 0;
    const maxCol = Math.max(...nodes.map(n => n.position.x));
    return maxCol + NODE_WIDTH + PADDING * 2;
  }, [nodes]);

  const categoryPositions = useMemo<CategoryPosition[]>(() => {
    const positions: CategoryPosition[] = [];
    const categorySet = new Map<string, { id: string; name: string; x: number }>();
    
    nodes.forEach((node) => {
      if (!categorySet.has(node.categoryName)) {
        categorySet.set(node.categoryName, {
          id: node.categoryId,
          name: node.categoryName,
          x: node.position.x,
        });
      }
    });
    
    categorySet.forEach((cat) => positions.push(cat));
    return positions.sort((a, b) => a.x - b.x);
  }, [nodes]);

  const canvasHeight = ROW_HEIGHT * 5 + PADDING * 2;

  return (
    <div 
      className="skill-tree-canvas relative overflow-x-auto overflow-y-hidden"
      style={{
        width: '100%',
        height: 'clamp(400px, 60vh, 600px)',
      }}
    >
      <svg
        className="absolute inset-0 pointer-events-none"
        width={canvasWidth}
        height={canvasHeight}
        style={{ minWidth: '100%' }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {connections.map((conn) => {
          const sourceNode = nodes.find(n => n.id === conn.sourceId);
          const targetNode = nodes.find(n => n.id === conn.targetId);
          
          if (!sourceNode || !targetNode) return null;
          
          const isFilteredOut = filteredOutIds.has(sourceNode.id) || filteredOutIds.has(targetNode.id);
          
          const pathStyle: React.CSSProperties = {
            fill: 'none',
            transition: 'opacity 150ms ease',
            opacity: isFilteredOut ? 0.1 : (conn.status === 'completed' ? 1 : conn.status === 'active' ? 0.8 : 0.5),
          };
          
          if (conn.status === 'completed') {
            pathStyle.stroke = 'var(--primary)';
            pathStyle.strokeWidth = 2;
            pathStyle.filter = 'url(#glow)';
          } else if (conn.status === 'active') {
            pathStyle.stroke = 'var(--primary)';
            pathStyle.strokeWidth = 1.5;
          } else {
            pathStyle.stroke = 'var(--border)';
            pathStyle.strokeWidth = 1;
            pathStyle.strokeDasharray = '4 4';
          }
          
          return (
            <path
              key={conn.id}
              d={generateBezierPath(
                sourceNode.position.x,
                sourceNode.position.y,
                targetNode.position.x,
                targetNode.position.y
              )}
              style={pathStyle}
            />
          );
        })}
      </svg>
      
      {categoryPositions.map((cat) => (
        <div
          key={cat.id}
          className="absolute flex flex-col items-center"
          style={{
            left: `${cat.x}px`,
            top: `${PADDING - 40}px`,
            width: `${NODE_WIDTH}px`,
          }}
        >
          <span
            className="text-[12px] font-bold uppercase tracking-wider"
            style={{ color: 'var(--primary)' }}
          >
            {cat.name}
          </span>
          <div
            className="w-full h-px mt-1"
            style={{ backgroundColor: 'var(--primary)' }}
          />
        </div>
      ))}
      
      <div
        className="relative"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          minWidth: '100%',
        }}
      >
        {nodes.map((node) => {
          const isFilteredOut = filteredOutIds.has(node.id);
          const isSelected = node.id === selectedNodeId;
          
          return (
            <div
              key={node.id}
              style={{
                opacity: isFilteredOut ? 0.2 : 1,
                transition: 'opacity 150ms ease',
              }}
            >
              <ChallengeNode
                node={node}
                isSelected={isSelected}
                onClick={onNodeClick}
                reducedMotion={reducedMotion}
                animationDelay={Math.floor(node.position.x / COL_WIDTH) * 80}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
