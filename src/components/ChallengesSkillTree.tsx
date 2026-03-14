'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChallengeNode as ChallengeNodeType, 
  Connection, 
  SkillTreeData,
  FilterOptions 
} from '@/lib/types/skill-tree';
import { buildSkillTreeData, filterNodes } from '@/lib/skill-tree-utils';
import SkillTreeCanvas from './SkillTreeCanvas';
import NodeDetailPanel from './NodeDetailPanel';
import ProgressWidget from './ProgressWidget';
import FilterToolbar from './FilterToolbar';

interface ChallengesSkillTreeProps {
  rawChallenges: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    difficulty: string;
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
  }[];
  rawDependencies: {
    challengeId: string;
    dependsOn: string;
  }[];
  completedChallenges: Record<string, boolean>;
  isLoggedIn: boolean;
}

export default function ChallengesSkillTree({
  rawChallenges,
  rawDependencies,
  completedChallenges,
  isLoggedIn,
}: ChallengesSkillTreeProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    difficulty: null,
    status: null,
    search: '',
  });
  
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const skillTreeData = useMemo<SkillTreeData>(() => {
    return buildSkillTreeData(
      rawChallenges,
      rawDependencies,
      completedChallenges,
      isLoggedIn
    );
  }, [rawChallenges, rawDependencies, completedChallenges, isLoggedIn]);
  
  const filteredOutIds = useMemo(() => {
    return filterNodes(skillTreeData.nodes, {
      category: filters.category,
      difficulty: filters.difficulty,
      status: filters.status,
      search: filters.search,
    });
  }, [skillTreeData.nodes, filters]);
  
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return skillTreeData.nodes.find(n => n.id === selectedNodeId) || null;
  }, [skillTreeData.nodes, selectedNodeId]);
  
  const handleNodeClick = (node: ChallengeNodeType) => {
    setSelectedNodeId(node.id);
    setIsPanelExpanded(true);
  };
  
  return (
    <div className="relative">
      <FilterToolbar
        categories={skillTreeData.categories}
        selectedCategory={filters.category}
        onCategoryChange={(cat) => setFilters(f => ({ ...f, category: cat }))}
        selectedDifficulty={filters.difficulty}
        onDifficultyChange={(diff) => setFilters(f => ({ ...f, difficulty: diff }))}
        selectedStatus={filters.status}
        onStatusChange={(status) => setFilters(f => ({ ...f, status: status as FilterOptions['status'] }))}
        searchQuery={filters.search}
        onSearchChange={(search) => setFilters(f => ({ ...f, search }))}
      />
      
      <div className="relative">
        <SkillTreeCanvas
          nodes={skillTreeData.nodes}
          connections={skillTreeData.connections}
          selectedNodeId={selectedNodeId}
          onNodeClick={handleNodeClick}
          filteredOutIds={filteredOutIds}
          reducedMotion={reducedMotion}
        />
        
        <ProgressWidget
          total={skillTreeData.progress.total}
          completed={skillTreeData.progress.completed}
          byDifficulty={skillTreeData.progress.byDifficulty}
          isLoggedIn={isLoggedIn}
        />
      </div>
      
      <NodeDetailPanel
        node={selectedNode}
        isExpanded={isPanelExpanded}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
