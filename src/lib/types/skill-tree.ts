export type NodeStatus = 'locked' | 'available' | 'completed' | 'selected';

export interface NodePosition {
  x: number;
  y: number;
}

export interface ChallengeNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  status: NodeStatus;
  position: NodePosition;
  prerequisites: string[];
  unlocks: string[];
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  status: 'inactive' | 'active' | 'completed';
}

export interface SkillTreeData {
  nodes: ChallengeNode[];
  connections: Connection[];
  categories: { id: string; name: string; icon: string; }[];
  progress: {
    total: number;
    completed: number;
    byDifficulty: Record<string, { total: number; completed: number }>;
  };
}

export interface FilterOptions {
  category: string | null;
  difficulty: string | null;
  status: NodeStatus | null;
  search: string;
}
