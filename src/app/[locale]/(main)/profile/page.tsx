"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "@/lib/hooks/use-session";
import { useTranslations } from "next-intl";

interface UserStats {
  totalXp: number;
  completedCount: number;
  inProgressCount: number;
  streakDays: number;
  progressList: ProgressItem[];
}

interface ProgressItem {
  id: string;
  challengeId: string;
  status: "in_progress" | "completed";
  startedAt: string;
  completedAt: string | null;
  xpEarned: number;
  challengeName?: string;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "1", name: "First Step", icon: "🏆", description: "Complete your first challenge", unlocked: false },
  { id: "2", name: "Streak Master", icon: "⭐", description: "7 day streak", unlocked: false },
  { id: "3", name: "Challenger", icon: "🎯", description: "Complete 10 challenges", unlocked: false },
  { id: "4", name: "On Fire", icon: "🔥", description: "30 day streak", unlocked: false },
  { id: "5", name: "Enlightened", icon: "💡", description: "Complete an advanced challenge", unlocked: false },
];

export default function ProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const { session, loading } = useSession();
  const t = useTranslations("profile");

  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.push(`/${locale}/login`);
    }
  }, [loading, session, router, locale]);

  useEffect(() => {
    async function fetchStats() {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);

          const updatedAchievements = ACHIEVEMENTS.map((achievement) => {
            if (achievement.id === "1" && data.completedCount >= 1) {
              return { ...achievement, unlocked: true };
            }
            if (achievement.id === "2" && data.streakDays >= 7) {
              return { ...achievement, unlocked: true };
            }
            if (achievement.id === "3" && data.completedCount >= 10) {
              return { ...achievement, unlocked: true };
            }
            if (achievement.id === "4" && data.streakDays >= 30) {
              return { ...achievement, unlocked: true };
            }
            return achievement;
          });
          setAchievements(updatedAchievements);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoadingData(false);
      }
    }

    if (session?.user?.id) {
      fetchStats();
    }
  }, [session?.user?.id]);

  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 500) + 1;
  };

  const calculateRank = (xp: number): string => {
    if (xp >= 10000) return "S";
    if (xp >= 5000) return "A";
    if (xp >= 2500) return "B";
    if (xp >= 1000) return "C";
    if (xp >= 500) return "D";
    return "E";
  };

  const formatTimeAgo = (date: string | null): string => {
    if (!date) return "N/A";
    try {
      const now = new Date();
      const past = new Date(date);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      return past.toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p
            className="text-lg font-bold"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            &gt; LOADING<span className="animate-blink">█</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            $ fetching user data...
          </p>
        </div>
      </div>
    );
  }

  const level = stats ? calculateLevel(stats.totalXp) : 1;
  const rank = stats ? calculateRank(stats.totalXp) : "E";

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h1
              className="font-mono text-sm font-medium tracking-wider text-foreground uppercase"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              [ USER PROFILE ]
            </h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border border-border bg-muted flex items-center justify-center">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="text-4xl font-bold text-muted-foreground"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {session.user.name?.[0]?.toUpperCase() ||
                        session.user.email[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-wider mb-1"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    username
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {session.user.name || "Anonymous User"}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-wider mb-1"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    email
                  </p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {session.user.email}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-wider mb-1"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    member since
                  </p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border bg-card mt-6">
          <div className="border-b border-border px-6 py-4">
            <h2
              className="font-mono text-sm font-medium tracking-wider text-foreground uppercase"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              [ STATS ]
            </h2>
          </div>

          <div className="p-6">
            {loadingData ? (
              <div className="text-center py-8">
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  &gt; loading stats...
                </p>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-border p-4">
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-wider mb-1"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    XP
                  </p>
                  <p
                    className="text-3xl font-bold text-warning"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {stats.totalXp}
                  </p>
                </div>
                <div className="border border-border p-4">
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-wider mb-1"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    Challenges
                  </p>
                  <p
                    className="text-3xl font-bold text-success"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {stats.completedCount}
                  </p>
                </div>
                <div className="border border-border p-4">
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-wider mb-1"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    Rank
                  </p>
                  <p
                    className="text-3xl font-bold text-primary"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {rank}
                  </p>
                </div>
                <div className="border border-border p-4">
                  <p
                    className="text-xs text-muted-foreground uppercase tracking-wider mb-1"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    Streak
                  </p>
                  <p
                    className="text-3xl font-bold text-destructive"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {stats.streakDays}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  No stats available
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border border-border bg-card mt-6">
          <div className="border-b border-border px-6 py-4">
            <h2
              className="font-mono text-sm font-medium tracking-wider text-foreground uppercase"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              [ RECENT ACTIVITY ]
            </h2>
          </div>

          <div className="p-6">
            {loadingData ? (
              <div className="text-center py-8">
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  &gt; loading activity...
                </p>
              </div>
            ) : stats && stats.progressList.length > 0 ? (
              <div className="space-y-2">
                {stats.progressList.slice(0, 5).map((progress) => (
                  <div
                    key={progress.id}
                    className="border border-border p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm"
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {progress.status === "completed" ? (
                          <span className="text-success">&gt;</span>
                        ) : (
                          <span className="text-warning">&gt;</span>
                        )}
                      </span>
                      <span
                        className="text-sm"
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {progress.status === "completed"
                          ? `Completed challenge`
                          : `Started challenge`}
                      </span>
                    </div>
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {formatTimeAgo(
                        progress.completedAt || progress.startedAt
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  No recent activity
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border border-border bg-card mt-6">
          <div className="border-b border-border px-6 py-4">
            <h2
              className="font-mono text-sm font-medium tracking-wider text-foreground uppercase"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              [ ACHIEVEMENTS ]
            </h2>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`w-20 h-20 border flex flex-col items-center justify-center transition-colors ${
                    achievement.unlocked
                      ? "border-warning bg-warning/10"
                      : "border-border bg-muted/50 opacity-50"
                  }`}
                  title={achievement.description}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <span
                    className="text-xs mt-1 text-center px-1"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {achievement.unlocked ? achievement.name : "???"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}