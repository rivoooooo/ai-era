'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  Roadmap,
  RoadmapNode,
  Achievement,
  UserProgressState,
  NodeStatus,
  AchievementUnlockEvent,
} from './types';

const STORAGE_KEY = 'roadmap_progress';

const defaultUserState: UserProgressState = {
  userId: 'user',
  level: 1,
  xp: 0,
  totalXp: 0,
  completedNodes: [],
  completedBranches: [],
  achievements: [],
  currentStreak: 0,
  longestStreak: 0,
  lastActiveAt: new Date(),
  nodeProgress: {},
};

interface UseRoadmapOptions {
  roadmap: Roadmap;
  achievements: Achievement[];
  autoSave?: boolean;
}

interface UseRoadmapReturn {
  nodes: RoadmapNode[];
  userState: UserProgressState;
  unlockedAchievements: Achievement[];
  lockedAchievements: Achievement[];
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
  updateNodeStatus: (nodeId: string, status: NodeStatus) => void;
  updateNodeProgress: (nodeId: string, progress: number) => void;
  checkAchievements: () => AchievementUnlockEvent[];
  resetProgress: () => void;
  getNodeById: (id: string) => RoadmapNode | undefined;
  getAvailableNodes: () => RoadmapNode[];
  getCompletedNodes: () => RoadmapNode[];
  isLoaded: boolean;
}

export function useRoadmap({
  roadmap,
  achievements,
  autoSave = true,
}: UseRoadmapOptions): UseRoadmapReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize user state with default values (for SSR)
  const [userState, setUserState] = useState<UserProgressState>(defaultUserState);

  // Initialize nodes with status (for SSR)
  const [nodes, setNodes] = useState<RoadmapNode[]>(() => {
    return roadmap.nodes.map((node) => ({
      ...node,
      status: calculateInitialStatus(node, roadmap.nodes),
    }));
  });

  // Load from localStorage on client side only
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserState({
          ...parsed,
          lastActiveAt: new Date(parsed.lastActiveAt),
        });
        
        // Restore node statuses based on saved progress
        setNodes((prevNodes) => {
          return prevNodes.map((node) => ({
            ...node,
            status: parsed.completedNodes.includes(node.id) 
              ? 'completed' 
              : calculateInitialStatus(node, prevNodes),
          }));
        });
      } catch {
        // Invalid saved data, use defaults
      }
    }
    setIsLoaded(true);
  }, []);

  // Calculate progress
  const progress = useMemo(() => {
    const total = nodes.length;
    const completed = nodes.filter((n) => n.status === 'completed').length;
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [nodes]);

  // Split achievements
  const { unlockedAchievements, lockedAchievements } = useMemo(() => {
    const unlocked = achievements.filter((a) =>
      userState.achievements.includes(a.id)
    );
    const locked = achievements.filter(
      (a) => !userState.achievements.includes(a.id)
    );
    return { unlockedAchievements: unlocked, lockedAchievements: locked };
  }, [achievements, userState.achievements]);

  // Save to localStorage
  useEffect(() => {
    if (autoSave && isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    }
  }, [userState, autoSave, isLoaded]);

  // Calculate initial status based on dependencies
  function calculateInitialStatus(
    node: RoadmapNode,
    allNodes: RoadmapNode[]
  ): NodeStatus {
    if (node.dependencies.length === 0) return 'available';
    const depsCompleted = node.dependencies.every((depId) => {
      const dep = allNodes.find((n) => n.id === depId);
      return dep?.status === 'completed';
    });
    return depsCompleted ? 'available' : 'locked';
  }

  // Update node status
  const updateNodeStatus = useCallback(
    (nodeId: string, status: NodeStatus) => {
      setNodes((prevNodes) => {
        const newNodes = prevNodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, status };
          }
          return node;
        });

        // Update dependent nodes
        return newNodes.map((node) => {
          if (node.dependencies.includes(nodeId)) {
            const depsCompleted = node.dependencies.every((depId) => {
              const dep = newNodes.find((n) => n.id === depId);
              return dep?.status === 'completed';
            });
            if (depsCompleted && node.status === 'locked') {
              return { ...node, status: 'available' };
            }
          }
          return node;
        });
      });

      // Update user state
      setUserState((prev) => {
        const completedNodes =
          status === 'completed'
            ? [...new Set([...prev.completedNodes, nodeId])]
            : prev.completedNodes.filter((id) => id !== nodeId);

        // Calculate XP rewards
        const node = roadmap.nodes.find((n) => n.id === nodeId);
        let xpGain = 0;
        if (status === 'completed' && node?.rewards) {
          xpGain = node.rewards
            .filter((r) => r.type === 'xp')
            .reduce((sum, r) => sum + (r.value as number), 0);
        }

        return {
          ...prev,
          completedNodes,
          xp: prev.xp + xpGain,
          totalXp: prev.totalXp + xpGain,
          lastActiveAt: new Date(),
        };
      });
    },
    [roadmap.nodes]
  );

  // Update node progress
  const updateNodeProgress = useCallback((nodeId: string, progress: number) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, progress: Math.min(100, Math.max(0, progress)) } : node
      )
    );

    setUserState((prev) => ({
      ...prev,
      nodeProgress: { ...prev.nodeProgress, [nodeId]: progress },
    }));
  }, []);

  // Check and unlock achievements
  const checkAchievements = useCallback((): AchievementUnlockEvent[] => {
    const events: AchievementUnlockEvent[] = [];

    lockedAchievements.forEach((achievement) => {
      let shouldUnlock = false;

      switch (achievement.condition.type) {
        case 'complete_nodes':
          shouldUnlock =
            userState.completedNodes.length >= (achievement.condition.value || 0);
          break;
        case 'complete_branch':
          shouldUnlock = achievement.condition.target
            ? userState.completedBranches.includes(achievement.condition.target)
            : false;
          break;
        case 'reach_level':
          shouldUnlock = userState.level >= (achievement.condition.value || 0);
          break;
        case 'streak':
          shouldUnlock =
            userState.currentStreak >= (achievement.condition.value || 0);
          break;
        case 'custom':
          shouldUnlock = achievement.condition.customCheck?.(userState) || false;
          break;
      }

      if (shouldUnlock) {
        setUserState((prev) => ({
          ...prev,
          achievements: [...prev.achievements, achievement.id],
        }));

        events.push({
          achievement,
          unlockedAt: new Date(),
          rewards: achievement.rewards || [],
        });
      }
    });

    return events;
  }, [lockedAchievements, userState]);

  // Reset progress
  const resetProgress = useCallback(() => {
    setUserState(defaultUserState);

    setNodes(
      roadmap.nodes.map((node) => ({
        ...node,
        status: calculateInitialStatus(node, roadmap.nodes),
        progress: 0,
      }))
    );

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [roadmap.nodes]);

  // Helper functions
  const getNodeById = useCallback(
    (id: string) => nodes.find((n) => n.id === id),
    [nodes]
  );

  const getAvailableNodes = useCallback(
    () => nodes.filter((n) => n.status === 'available'),
    [nodes]
  );

  const getCompletedNodes = useCallback(
    () => nodes.filter((n) => n.status === 'completed'),
    [nodes]
  );

  return {
    nodes,
    userState,
    unlockedAchievements,
    lockedAchievements,
    progress,
    updateNodeStatus,
    updateNodeProgress,
    checkAchievements,
    resetProgress,
    getNodeById,
    getAvailableNodes,
    getCompletedNodes,
    isLoaded,
  };
}
