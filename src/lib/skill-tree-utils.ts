import { 
  ChallengeNode, 
  Connection, 
  SkillTreeData, 
  NodeStatus,
  NodePosition 
} from './types/skill-tree';

const DIFFICULTY_ORDER = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const NODE_WIDTH = 120;
const NODE_HEIGHT = 80;
const COL_WIDTH = 200;
const ROW_HEIGHT = 120;
const PADDING = 60;

interface RawChallenge {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  difficulty: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
}

interface RawDependency {
  challengeId: string;
  dependsOn: string;
}

interface CompletedChallenges {
  [slug: string]: boolean;
}

export function calculateNodePositions(
  challenges: RawChallenge[]
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  
  const categoryMap = new Map<string, RawChallenge[]>();
  
  challenges.forEach((challenge) => {
    const list = categoryMap.get(challenge.categoryName) || [];
    list.push(challenge);
    categoryMap.set(challenge.categoryName, list);
  });
  
  const sortedCategories = Array.from(categoryMap.entries()).sort(
    (a, b) => a[0].localeCompare(b[0])
  );
  
  sortedCategories.forEach(([categoryName, categoryChallenges], colIndex) => {
    const sortedByDifficulty = [...categoryChallenges].sort((a, b) => {
      const aIndex = DIFFICULTY_ORDER.indexOf(a.difficulty);
      const bIndex = DIFFICULTY_ORDER.indexOf(b.difficulty);
      if (aIndex === bIndex) {
        return a.name.localeCompare(b.name);
      }
      return aIndex - bIndex;
    });
    
    sortedByDifficulty.forEach((challenge, rowIndex) => {
      positions.set(challenge.slug, {
        x: PADDING + colIndex * COL_WIDTH,
        y: PADDING + rowIndex * ROW_HEIGHT,
      });
    });
  });
  
  return positions;
}

export function buildSkillTreeData(
  challenges: RawChallenge[],
  dependencies: RawDependency[],
  completedChallenges: CompletedChallenges,
  userLoggedIn: boolean
): SkillTreeData {
  const positions = calculateNodePositions(challenges);
  
  const completedSet = new Set(
    Object.keys(completedChallenges).filter(k => completedChallenges[k])
  );
  
  const dependencyMap = new Map<string, string[]>();
  const reverseDependencyMap = new Map<string, string[]>();
  
  dependencies.forEach((dep) => {
    const dependents = dependencyMap.get(dep.challengeId) || [];
    dependents.push(dep.dependsOn);
    dependencyMap.set(dep.challengeId, dependents);
    
    const prerequisites = reverseDependencyMap.get(dep.dependsOn) || [];
    prerequisites.push(dep.challengeId);
    reverseDependencyMap.set(dep.dependsOn, prerequisites);
  });
  
  const nodes: ChallengeNode[] = challenges.map((challenge) => {
    const position = positions.get(challenge.slug) || { x: 0, y: 0 };
    const prerequisites = reverseDependencyMap.get(challenge.slug) || [];
    const unlocks = dependencyMap.get(challenge.slug) || [];
    
    let status: NodeStatus;
    
    if (!userLoggedIn) {
      status = 'available';
    } else if (completedSet.has(challenge.slug)) {
      status = 'completed';
    } else {
      const allPrereqsCompleted = prerequisites.every(
        (prereqSlug) => completedSet.has(prereqSlug)
      );
      status = allPrereqsCompleted ? 'available' : 'locked';
    }
    
    return {
      id: challenge.id,
      name: challenge.name,
      slug: challenge.slug,
      description: challenge.description,
      difficulty: challenge.difficulty as 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT',
      categoryId: challenge.categoryId,
      categoryName: challenge.categoryName,
      categoryIcon: challenge.categoryIcon,
      status,
      position,
      prerequisites,
      unlocks,
    };
  });
  
  const connections: Connection[] = [];
  
  dependencies.forEach((dep) => {
    const sourceChallenge = challenges.find((c) => c.id === dep.dependsOn);
    const targetChallenge = challenges.find((c) => c.id === dep.challengeId);
    
    if (sourceChallenge && targetChallenge) {
      const sourceCompleted = completedSet.has(sourceChallenge.slug);
      const targetCompleted = completedSet.has(targetChallenge.slug);
      
      let connectionStatus: 'inactive' | 'active' | 'completed';
      
      if (!userLoggedIn) {
        connectionStatus = 'active';
      } else if (sourceCompleted && targetCompleted) {
        connectionStatus = 'completed';
      } else if (sourceCompleted) {
        connectionStatus = 'active';
      } else {
        connectionStatus = 'inactive';
      }
      
      connections.push({
        id: `${dep.dependsOn}-${dep.challengeId}`,
        sourceId: sourceChallenge.id,
        targetId: targetChallenge.id,
        status: connectionStatus,
      });
    }
  });
  
  const categories = Array.from(
    new Set(challenges.map((c) => c.categoryName))
  ).map((name) => {
    const first = challenges.find((c) => c.categoryName === name);
    return {
      id: first?.categoryId || '',
      name,
      icon: first?.categoryIcon || '',
    };
  });
  
  const progress = {
    total: challenges.length,
    completed: nodes.filter((n) => n.status === 'completed').length,
    byDifficulty: {} as Record<string, { total: number; completed: number }>,
  };
  
  DIFFICULTY_ORDER.forEach((diff) => {
    const diffNodes = nodes.filter((n) => n.difficulty === diff);
    progress.byDifficulty[diff] = {
      total: diffNodes.length,
      completed: diffNodes.filter((n) => n.status === 'completed').length,
    };
  });
  
  return { nodes, connections, categories, progress };
}

export function filterNodes(
  nodes: ChallengeNode[],
  options: {
    category: string | null;
    difficulty: string | null;
    status: NodeStatus | null;
    search: string;
  }
): Set<string> {
  const filteredOut = new Set<string>();
  
  nodes.forEach((node) => {
    let shouldFilter = false;
    
    if (options.category && node.categoryName !== options.category) {
      shouldFilter = true;
    }
    
    if (options.difficulty && node.difficulty !== options.difficulty) {
      shouldFilter = true;
    }
    
    if (options.status && node.status !== options.status) {
      shouldFilter = true;
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      const matchesName = node.name.toLowerCase().includes(searchLower);
      const matchesSlug = node.slug.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesSlug) {
        shouldFilter = true;
      }
    }
    
    if (shouldFilter) {
      filteredOut.add(node.id);
    }
  });
  
  return filteredOut;
}
