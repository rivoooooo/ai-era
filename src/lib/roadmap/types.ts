// 路线图节点状态
export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed';

// 路线图节点类型
export type NodeType = 'milestone' | 'task' | 'challenge' | 'reward';

// 成就类型
export type AchievementType = 'progress' | 'challenge' | 'hidden' | 'special';

// 成就稀有度
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

// 路线图节点
export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  type: NodeType;
  status: NodeStatus;
  position: { x: number; y: number };
  dependencies: string[];
  branch?: string;
  estimatedTime?: string;
  resources?: Resource[];
  rewards?: Reward[];
  requirements?: Requirement[];
  completedAt?: Date;
  progress?: number;
}

// 资源
export interface Resource {
  type: 'link' | 'video' | 'article' | 'tool';
  title: string;
  url?: string;
}

// 奖励
export interface Reward {
  type: 'xp' | 'badge' | 'item' | 'title';
  value: string | number;
  icon?: string;
}

// 要求
export interface Requirement {
  type: 'complete_node' | 'achievement' | 'skill_level' | 'time';
  target: string;
  value?: number;
}

// 路线图分支
export interface RoadmapBranch {
  id: string;
  name: string;
  description: string;
  color: string;
  nodes: string[];
  requiredLevel?: number;
}

// 路线图
export interface Roadmap {
  id: string;
  title: string;
  description: string;
  nodes: RoadmapNode[];
  branches: RoadmapBranch[];
  connections: Connection[];
}

// 连接线
export interface Connection {
  from: string;
  to: string;
  type: 'required' | 'optional' | 'branch';
}

// 成就
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  rarity: AchievementRarity;
  icon: string;
  condition: AchievementCondition;
  rewards?: Reward[];
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  isHidden?: boolean;
  hint?: string;
}

// 成就条件
export interface AchievementCondition {
  type: 'complete_nodes' | 'complete_branch' | 'reach_level' | 'streak' | 'custom';
  target?: string;
  value?: number;
  customCheck?: (state: UserProgressState) => boolean;
}

// 用户进度状态
export interface UserProgressState {
  userId: string;
  level: number;
  xp: number;
  totalXp: number;
  completedNodes: string[];
  completedBranches: string[];
  achievements: string[];
  currentStreak: number;
  longestStreak: number;
  lastActiveAt: Date;
  nodeProgress: Record<string, number>;
}

// 成就解锁事件
export interface AchievementUnlockEvent {
  achievement: Achievement;
  unlockedAt: Date;
  rewards: Reward[];
}

// 进度更新事件
export interface ProgressUpdateEvent {
  nodeId: string;
  oldStatus: NodeStatus;
  newStatus: NodeStatus;
  progress: number;
  rewards?: Reward[];
}

// 路线图配置
export interface RoadmapConfig {
  id: string;
  title: string;
  theme: 'default' | 'dark' | 'colorful';
  showProgressBar: boolean;
  showConnections: boolean;
  enableAnimations: boolean;
  autoSave: boolean;
  saveInterval: number;
}
