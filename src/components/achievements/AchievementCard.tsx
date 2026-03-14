'use client';

import { motion } from 'motion/react';
import type { Achievement, AchievementRarity, AchievementType } from '@/lib/roadmap/types';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  onClick?: () => void;
}

const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: 'var(--muted-foreground)',
  rare: 'var(--primary)',
  epic: 'var(--warning)',
  legendary: 'var(--destructive)',
};

const RARITY_LABELS: Record<AchievementRarity, string> = {
  common: 'COMMON',
  rare: 'RARE',
  epic: 'EPIC',
  legendary: 'LEGENDARY',
};

const TYPE_ICONS: Record<AchievementType, string> = {
  progress: '[P]',
  challenge: '[C]',
  hidden: '[?]',
  special: '[S]',
};

export function AchievementCard({
  achievement,
  isUnlocked,
  onClick,
}: AchievementCardProps) {
  const rarityColor = RARITY_COLORS[achievement.rarity];

  if (achievement.isHidden && !isUnlocked) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-card border border-border p-4 cursor-pointer opacity-50"
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>[?]</div>
          <div>
            <h3
              className="font-bold text-muted-foreground"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Hidden Achievement
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {achievement.hint || 'Keep exploring to unlock this achievement'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-card border-2 p-4 cursor-pointer transition-all ${
        isUnlocked ? 'border-primary' : 'border-border opacity-60'
      }`}
      onClick={onClick}
      style={{
        borderColor: isUnlocked ? rarityColor : undefined,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`text-4xl ${isUnlocked ? '' : 'grayscale'}`}
          style={{ filter: isUnlocked ? undefined : 'grayscale(100%)' }}
        >
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 border"
              style={{
                color: rarityColor,
                borderColor: rarityColor,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {RARITY_LABELS[achievement.rarity]}
            </span>
            <span className="text-lg">{TYPE_ICONS[achievement.type]}</span>
          </div>

          <h3
            className="font-bold text-foreground"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {achievement.name}
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            {achievement.description}
          </p>

          {/* Progress Bar */}
          {achievement.maxProgress && achievement.maxProgress > 1 && (
            <div className="mt-3">
              <div className="w-full h-2 bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {achievement.progress || 0}/{achievement.maxProgress}
              </p>
            </div>
          )}

          {/* Unlocked Date */}
          {isUnlocked && achievement.unlockedAt && (
            <p
              className="text-xs text-success mt-2"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              [V] Unlocked on{' '}
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}

          {/* Rewards */}
          {isUnlocked && achievement.rewards && achievement.rewards.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Rewards:</p>
              <div className="flex gap-2">
                {achievement.rewards.map((reward, index) => (
                  <span
                    key={index}
                    className="text-xs bg-muted px-2 py-1"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {reward.type === 'xp' && `+${reward.value} XP`}
                    {reward.type === 'badge' && `[B] ${reward.value}`}
                    {reward.type === 'item' && `[I] ${reward.value}`}
                    {reward.type === 'title' && `[T] ${reward.value}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
