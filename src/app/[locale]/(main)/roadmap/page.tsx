'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoadmapCanvas } from '@/components/roadmap/RoadmapCanvas';
import { AchievementGallery } from '@/components/achievements/AchievementGallery';
import { AchievementToast } from '@/components/achievements/AchievementNotification';
import { useRoadmap } from '@/lib/roadmap/useRoadmap';
import { sampleRoadmap, sampleAchievements } from '@/lib/roadmap/data';
import type { Achievement, AchievementUnlockEvent } from '@/lib/roadmap/types';

type Tab = 'roadmap' | 'achievements';

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<Tab>('roadmap');
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);
  const [isClient, setIsClient] = useState(false);

  const {
    nodes,
    userState,
    unlockedAchievements,
    lockedAchievements,
    progress,
    updateNodeStatus,
    checkAchievements,
    resetProgress,
    isLoaded,
  } = useRoadmap({
    roadmap: sampleRoadmap,
    achievements: sampleAchievements,
    autoSave: true,
  });

  // Mark as client-side rendered
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for new achievements when nodes change
  useEffect(() => {
    const events = checkAchievements();
    if (events.length > 0) {
      const newAchievements = events.map((e) => e.achievement);
      setRecentUnlocks((prev) => [...prev, ...newAchievements]);
    }
  }, [nodes, checkAchievements]);

  const dismissToast = useCallback((achievementId: string) => {
    setRecentUnlocks((prev) => prev.filter((a) => a.id !== achievementId));
  }, []);

  // Show loading state until client-side hydration is complete
  if (!isClient || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            &gt; LOADING_ROADMAP<span className="animate-blink">█</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            $ initializing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                &gt; LEARNING_ROADMAP_
                <span className="animate-blink">█</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                $ track-progress --visualize --achievements
              </p>
            </div>

            {/* User Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p
                  className="text-xs text-muted-foreground uppercase"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Level
                </p>
                <p className="text-2xl font-bold text-primary">{userState.level}</p>
              </div>
              <div className="text-right">
                <p
                  className="text-xs text-muted-foreground uppercase"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  XP
                </p>
                <p className="text-2xl font-bold text-warning">{userState.xp}</p>
              </div>
              <div className="text-right">
                <p
                  className="text-xs text-muted-foreground uppercase"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Achievements
                </p>
                <p className="text-2xl font-bold text-success">
                  {unlockedAchievements.length}/{sampleAchievements.length}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground border border-border hover:border-primary'
              }`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              [MAP] ROADMAP
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === 'achievements'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground border border-border hover:border-primary'
              }`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              [TROPHY] ACHIEVEMENTS ({unlockedAchievements.length})
            </button>
            <button
              onClick={resetProgress}
              className="ml-auto px-4 py-3 text-sm text-muted-foreground border border-border hover:border-destructive hover:text-destructive transition-colors"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              ↺ RESET
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'roadmap' ? (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-card border border-border rounded-none overflow-hidden">
                <div className="h-[70vh]">
                  <RoadmapCanvas
                    nodes={nodes}
                    branches={sampleRoadmap.branches}
                    onNodeStatusChange={updateNodeStatus}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                {[
                  { status: 'completed', label: 'Completed', color: 'var(--success)' },
                  { status: 'in_progress', label: 'In Progress', color: 'var(--warning)' },
                  { status: 'available', label: 'Available', color: 'var(--primary)' },
                  { status: 'locked', label: 'Locked', color: 'var(--muted-foreground)' },
                ].map((item) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2"
                      style={{ borderColor: item.color, backgroundColor: `${item.color}20` }}
                    />
                    <span
                      className="text-sm"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementGallery
                achievements={sampleAchievements}
                unlockedIds={unlockedAchievements.map((a) => a.id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Achievement Toasts */}
      <AnimatePresence>
        {recentUnlocks.map((achievement) => (
          <AchievementToast
            key={achievement.id}
            achievement={achievement}
            onDismiss={() => dismissToast(achievement.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
