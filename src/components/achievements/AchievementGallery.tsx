'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Achievement, AchievementType, AchievementRarity } from '@/lib/roadmap/types';
import { AchievementCard } from './AchievementCard';
import { AchievementNotification } from './AchievementNotification';

interface AchievementGalleryProps {
  achievements: Achievement[];
  unlockedIds: string[];
  onAchievementClick?: (achievement: Achievement) => void;
}

type FilterType = 'all' | AchievementType;
type FilterRarity = 'all' | AchievementRarity;
type SortOption = 'default' | 'rarity' | 'recent' | 'progress';

export function AchievementGallery({
  achievements,
  unlockedIds,
  onAchievementClick,
}: AchievementGalleryProps) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const stats = useMemo(() => {
    const total = achievements.length;
    const unlocked = unlockedIds.length;
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    const byRarity = {
      common: achievements.filter((a) => a.rarity === 'common' && unlockedIds.includes(a.id)).length,
      rare: achievements.filter((a) => a.rarity === 'rare' && unlockedIds.includes(a.id)).length,
      epic: achievements.filter((a) => a.rarity === 'epic' && unlockedIds.includes(a.id)).length,
      legendary: achievements.filter((a) => a.rarity === 'legendary' && unlockedIds.includes(a.id)).length,
    };

    return { total, unlocked, percentage, byRarity };
  }, [achievements, unlockedIds]);

  const filteredAchievements = useMemo(() => {
    let filtered = [...achievements];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((a) => a.type === filterType);
    }

    // Filter by rarity
    if (filterRarity !== 'all') {
      filtered = filtered.filter((a) => a.rarity === filterRarity);
    }

    // Filter by unlocked status
    if (showUnlockedOnly) {
      filtered = filtered.filter((a) => unlockedIds.includes(a.id));
    }

    // Sort
    switch (sortBy) {
      case 'rarity':
        const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
        filtered.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        break;
      case 'recent':
        filtered.sort((a, b) => {
          if (!a.unlockedAt) return 1;
          if (!b.unlockedAt) return -1;
          return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
        });
        break;
      case 'progress':
        filtered.sort((a, b) => {
          const progressA = a.maxProgress ? (a.progress || 0) / a.maxProgress : 0;
          const progressB = b.maxProgress ? (b.progress || 0) / b.maxProgress : 0;
          return progressB - progressA;
        });
        break;
    }

    return filtered;
  }, [achievements, filterType, filterRarity, sortBy, showUnlockedOnly, unlockedIds]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-card border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              [TROPHY] Achievements
            </h2>
            <p className="text-sm text-muted-foreground">
              {stats.unlocked}/{stats.total} unlocked ({stats.percentage}%)
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md">
            <div className="w-full h-3 bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary via-warning to-success"
              />
            </div>
          </div>

          {/* Rarity Counts */}
          <div className="flex gap-4 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <div className="text-center">
              <div className="text-muted-foreground">Common</div>
              <div className="font-bold">{stats.byRarity.common}</div>
            </div>
            <div className="text-center">
              <div className="text-primary">Rare</div>
              <div className="font-bold">{stats.byRarity.rare}</div>
            </div>
            <div className="text-center">
              <div className="text-warning">Epic</div>
              <div className="font-bold">{stats.byRarity.epic}</div>
            </div>
            <div className="text-center">
              <div className="text-destructive">Legendary</div>
              <div className="font-bold">{stats.byRarity.legendary}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="bg-card border border-border px-3 py-2 text-sm"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <option value="all">All Types</option>
          <option value="progress">[P] Progress</option>
          <option value="challenge">[C] Challenge</option>
          <option value="hidden">[?] Hidden</option>
          <option value="special">[S] Special</option>
        </select>

        {/* Rarity Filter */}
        <select
          value={filterRarity}
          onChange={(e) => setFilterRarity(e.target.value as FilterRarity)}
          className="bg-card border border-border px-3 py-2 text-sm"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <option value="all">All Rarities</option>
          <option value="common">Common</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-card border border-border px-3 py-2 text-sm"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <option value="default">Default</option>
          <option value="rarity">By Rarity</option>
          <option value="recent">Recently Unlocked</option>
          <option value="progress">By Progress</option>
        </select>

        {/* Toggle */}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showUnlockedOnly}
            onChange={(e) => setShowUnlockedOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Unlocked only
          </span>
        </label>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <AchievementCard
                achievement={achievement}
                isUnlocked={unlockedIds.includes(achievement.id)}
                onClick={() => {
                  setSelectedAchievement(achievement);
                  onAchievementClick?.(achievement);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>[SEARCH]</div>
          <p className="text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            No achievements found matching your filters
          </p>
        </div>
      )}

      {/* Selected Achievement Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <AchievementNotification
            achievement={selectedAchievement}
            isUnlocked={unlockedIds.includes(selectedAchievement.id)}
            onClose={() => setSelectedAchievement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
