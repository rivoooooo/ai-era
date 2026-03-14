'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Achievement } from '@/lib/roadmap/types';

interface AchievementNotificationProps {
  achievement: Achievement;
  isUnlocked: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function AchievementNotification({
  achievement,
  isUnlocked,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
}: AchievementNotificationProps) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  const rarityColors = {
    common: 'var(--muted-foreground)',
    rare: 'var(--primary)',
    epic: 'var(--warning)',
    legendary: 'var(--destructive)',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-card border-2 max-w-md w-full p-8 relative"
        style={{ borderColor: rarityColors[achievement.rarity] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          [X]
        </button>

        {/* Achievement Icon */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-8xl inline-block"
          >
            {achievement.icon}
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <span
            className="text-xs font-bold px-3 py-1 border mb-3 inline-block"
            style={{
              color: rarityColors[achievement.rarity],
              borderColor: rarityColors[achievement.rarity],
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {achievement.rarity.toUpperCase()}
          </span>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {isUnlocked ? '[!] Achievement Unlocked!' : 'Achievement Details'}
          </h2>
          <h3 className="text-xl mt-2">{achievement.name}</h3>
        </div>

        {/* Description */}
        <p className="text-center text-muted-foreground mb-6">
          {achievement.description}
        </p>

        {/* Progress */}
        {achievement.maxProgress && achievement.maxProgress > 1 && (
          <div className="mb-6">
            <div className="w-full h-3 bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%`,
                }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-full bg-primary"
              />
            </div>
            <p className="text-center text-sm mt-2 text-muted-foreground">
              Progress: {achievement.progress || 0}/{achievement.maxProgress}
            </p>
          </div>
        )}

        {/* Rewards */}
        {achievement.rewards && achievement.rewards.length > 0 && (
          <div className="border-t border-border pt-6">
            <h4
              className="text-sm font-bold uppercase text-muted-foreground mb-4 text-center"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Rewards
            </h4>
            <div className="flex justify-center gap-4">
              {achievement.rewards.map((reward, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-lg mb-1 font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {reward.type === 'xp' && '[XP]'}
                    {reward.type === 'badge' && '[B]'}
                    {reward.type === 'item' && '[I]'}
                    {reward.type === 'title' && '[T]'}
                  </div>
                  <p
                    className="text-xs font-bold"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {reward.type === 'xp' && `+${reward.value} XP`}
                    {reward.type === 'badge' && reward.value}
                    {reward.type === 'item' && reward.value}
                    {reward.type === 'title' && reward.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {isUnlocked ? 'AWESOME!' : 'CLOSE'}
        </button>
      </motion.div>
    </motion.div>
  );
}

// Toast notification component for achievement unlocks
interface AchievementToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed top-4 right-4 z-50 bg-card border-2 border-primary p-4 max-w-sm"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl">{achievement.icon}</div>
        <div className="flex-1">
          <p className="text-xs text-primary font-bold uppercase">
            Achievement Unlocked!
          </p>
          <h4 className="font-bold">{achievement.name}</h4>
          <p className="text-xs text-muted-foreground">
            {achievement.rarity.toUpperCase()}
          </p>
        </div>
        <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
          [X]
        </button>
      </div>
    </motion.div>
  );
}
