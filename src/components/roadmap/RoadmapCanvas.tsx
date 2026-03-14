'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { RoadmapNode, NodeStatus, RoadmapBranch } from '@/lib/roadmap/types';
import { NodeDetailPanel } from './NodeDetailPanel';
import { ProgressStats } from './ProgressStats';

interface RoadmapCanvasProps {
  nodes: RoadmapNode[];
  branches: RoadmapBranch[];
  onNodeClick?: (node: RoadmapNode) => void;
  onNodeStatusChange?: (nodeId: string, status: NodeStatus) => void;
  selectedNodeId?: string | null;
}

const STATUS_COLORS: Record<NodeStatus, string> = {
  locked: 'var(--muted-foreground)',
  available: 'var(--primary)',
  in_progress: 'var(--warning)',
  completed: 'var(--success)',
};

const STATUS_ICONS: Record<NodeStatus, string> = {
  locked: '[X]',
  available: '[ ]',
  in_progress: '[~]',
  completed: '[V]',
};

const NODE_TYPE_ICONS: Record<string, string> = {
  milestone: '(*)',
  task: '[T]',
  challenge: '[C]',
  reward: '[R]',
};

export function RoadmapCanvas({
  nodes,
  branches,
  onNodeClick,
  onNodeStatusChange,
  selectedNodeId,
}: RoadmapCanvasProps) {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Calculate bounds
  const bounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 800 };
    const xs = nodes.map((n) => n.position.x);
    const ys = nodes.map((n) => n.position.y);
    return {
      minX: Math.min(...xs) - 100,
      minY: Math.min(...ys) - 100,
      maxX: Math.max(...xs) + 200,
      maxY: Math.max(...ys) + 200,
    };
  }, [nodes]);

  const handleNodeClick = useCallback(
    (node: RoadmapNode) => {
      setSelectedNode(node);
      onNodeClick?.(node);
    },
    [onNodeClick]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === containerRef.current) {
        setIsDragging(true);
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      }
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPan({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        });
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.3), 2));
  }, []);

  // Draw connections
  const connections = useMemo(() => {
    const lines: React.ReactElement[] = [];
    nodes.forEach((node) => {
      node.dependencies.forEach((depId) => {
        const depNode = nodes.find((n) => n.id === depId);
        if (depNode) {
          const isActive = depNode.status === 'completed';
          lines.push(
            <line
              key={`${depId}-${node.id}`}
              x1={depNode.position.x + 60}
              y1={depNode.position.y + 30}
              x2={node.position.x}
              y2={node.position.y + 30}
              stroke={isActive ? 'var(--primary)' : 'var(--border)'}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={isActive ? undefined : '5,5'}
              opacity={isActive ? 1 : 0.5}
            />
          );
        }
      });
    });
    return lines;
  }, [nodes]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Progress Stats */}
      <div className="absolute top-4 left-4 z-20">
        <ProgressStats nodes={nodes} />
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setScale((s) => Math.min(s * 1.2, 2))}
          className="w-10 h-10 bg-card border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-lg"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s * 0.8, 0.3))}
          className="w-10 h-10 bg-card border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-lg"
        >
          −
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPan({ x: 0, y: 0 });
          }}
          className="w-10 h-10 bg-card border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
        >
          ⌂
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`${bounds.minX} ${bounds.minY} ${bounds.maxX - bounds.minX} ${bounds.maxY - bounds.minY}`}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Grid */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="var(--border)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect
            x={bounds.minX}
            y={bounds.minY}
            width={bounds.maxX - bounds.minX}
            height={bounds.maxY - bounds.minY}
            fill="url(#grid)"
          />

          {/* Connections */}
          {connections}

          {/* Nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              transform={`translate(${node.position.x}, ${node.position.y})`}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              <motion.rect
                width={120}
                height={60}
                rx={0}
                fill={
                  node.status === 'completed'
                    ? 'color-mix(in srgb, var(--success) 20%, var(--card))'
                    : node.status === 'in_progress'
                      ? 'color-mix(in srgb, var(--warning) 20%, var(--card))'
                      : 'var(--card)'
                }
                stroke={STATUS_COLORS[node.status]}
                strokeWidth={selectedNodeId === node.id ? 3 : 2}
                strokeDasharray={node.status === 'in_progress' ? '5,5' : undefined}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />

              {/* Status Icon */}
              <text
                x={10}
                y={20}
                fontSize={14}
                fill={STATUS_COLORS[node.status]}
              >
                {STATUS_ICONS[node.status]}
              </text>

              {/* Type Icon */}
              <text
                x={100}
                y={20}
                fontSize={14}
                textAnchor="end"
              >
                {NODE_TYPE_ICONS[node.type]}
              </text>

              {/* Title */}
              <text
                x={60}
                y={35}
                fontSize={11}
                fontWeight={600}
                textAnchor="middle"
                fill="var(--foreground)"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {node.title.length > 12
                  ? node.title.slice(0, 12) + '...'
                  : node.title}
              </text>

              {/* Progress Bar */}
              {node.status === 'in_progress' && node.progress !== undefined && (
                <g>
                  <rect
                    x={10}
                    y={45}
                    width={100}
                    height={6}
                    fill="var(--muted)"
                  />
                  <rect
                    x={10}
                    y={45}
                    width={100 * (node.progress / 100)}
                    height={6}
                    fill="var(--warning)"
                  />
                </g>
              )}

              {/* Hover Tooltip */}
              {hoveredNode === node.id && (
                <g transform="translate(0, -40)">
                  <rect
                    x={-10}
                    y={0}
                    width={140}
                    height={30}
                    fill="var(--popover)"
                    stroke="var(--border)"
                    rx={0}
                  />
                  <text
                    x={60}
                    y={20}
                    fontSize={10}
                    textAnchor="middle"
                    fill="var(--popover-foreground)"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    Click to view details
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Node Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onStatusChange={(status) => {
              onNodeStatusChange?.(selectedNode.id, status);
              setSelectedNode((prev) =>
                prev ? { ...prev, status } : null
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function for useMemo
function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const [state, setState] = useState<T>(factory);
  useEffect(() => {
    setState(factory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}
