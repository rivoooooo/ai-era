'use client';

import { useState, use, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getChallengeConfig, type ChallengeConfig } from '@/app/[locale]/challenge/[slug]/playground/utils';
import PreviewFrame from '@/app/[locale]/challenge/[slug]/playground/components/PreviewFrame';

const localeToLanguage: Record<string, string> = {
  'zh': 'zh',
  'en': 'en',
  'ja': 'ja',
};

const difficultyColors: Record<string, string> = {
  EASY: "var(--success)",
  MEDIUM: "var(--warning)",
  HARD: "var(--chart-3)",
  EXPERT: "var(--error)",
};

function ChallengeContent({ 
  slug, 
  locale 
}: { 
  slug: string;
  locale: string;
}) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || localeToLanguage[locale] || 'en';
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewCode, setPreviewCode] = useState({
    html: '',
    css: '',
    js: ''
  });
  const [challengeConfig, setChallengeConfig] = useState<ChallengeConfig | null>(null);
  const [challengeData, setChallengeData] = useState<{
    name: string;
    description: string;
    difficulty: string;
    category?: { name: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const response = await fetch(`/api/challenges/${slug}?lang=${lang}`);
        if (!response.ok) {
          throw new Error('Challenge not found');
        }
        const data = await response.json();
        setChallengeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load challenge');
      } finally {
        setLoading(false);
      }
    }
    
    fetchChallenge();
  }, [slug, lang]);

  useEffect(() => {
    if (slug && !challengeConfig) {
      getChallengeConfig(slug).then(config => {
        if (config) {
          setChallengeConfig(config);
          setPreviewCode(config.defaultCode);
        }
      });
    }
  }, [slug, challengeConfig]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 flex items-center justify-center">
        <div className="text-[var(--primary)] animate-blink">Loading...</div>
      </div>
    );
  }

  if (error || !challengeData) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card-terminal">
            <div className="card-terminal-header">
              +-- ERROR --+
            </div>
            <div className="p-8 text-center">
              <p className="text-lg mb-4">{error || 'Challenge not found'}</p>
              <Link href={`/${locale}/challenge`} className="btn-terminal inline-block">
                [BACK TO CHALLENGES]
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPlayground = !!challengeConfig;

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`min-h-screen bg-[var(--background)] ${isFullscreen ? 'fixed inset-0 z-50' : 'p-4 md:p-8'}`}>
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleFullscreen}
            className="btn-terminal text-sm px-4 py-2 bg-[var(--card)]"
          >
            [退出全屏]
          </button>
        </div>
      )}

      <div className={`${isFullscreen ? 'h-full' : 'max-w-7xl mx-auto'} flex flex-col lg:flex-row gap-4 md:gap-6`}>
        <div className={`${isFullscreen ? 'w-full lg:w-1/3' : 'w-full'} flex flex-col`}>
          <div className="mb-4 md:mb-6">
            <div className="flex items-center gap-2 text-xs opacity-60 mb-2">
              <Link href={`/${locale}/challenge`} className="hover:text-[var(--primary)] transition-colors">
                Challenges
              </Link>
              <span>/</span>
              <span>{slug}</span>
              <span className="text-[var(--muted-foreground)]">({lang})</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">
              {challengeData.name}
            </h1>
            <p className="text-sm opacity-60 mb-4">{challengeData.description}</p>
            
            <div className="flex flex-wrap gap-4 text-xs">
              <span 
                className="px-2 py-1 font-bold"
                style={{ 
                  color: difficultyColors[challengeData.difficulty],
                  border: `1px solid ${difficultyColors[challengeData.difficulty]}`
                }}
              >
                {challengeData.difficulty}
              </span>
              <span className="opacity-60 py-1">{challengeData.category?.name}</span>
            </div>
          </div>

          {isPlayground && (
            <div className="card-terminal flex-1 overflow-auto">
              <div className="card-terminal-header shrink-0">
                +-- 挑战介绍 --+
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--primary)] mb-2">概述</h3>
                  <p className="text-sm opacity-80">学习如何使用这个挑战的相关功能</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-[var(--primary)] mb-2">学习目标</h3>
                  <ul className="space-y-1">
                    <li className="text-sm opacity-80 flex items-start gap-2">
                      <span className="text-[var(--primary)]">▸</span>
                      掌握相关技能
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-[var(--primary)] mb-2">提示</h3>
                  <ul className="space-y-1">
                    <li className="text-sm opacity-60 flex items-start gap-2">
                      <span className="text-[var(--warning)]">💡</span>
                      参考官方文档
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 md:mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link 
              href={`/${locale}/challenge`}
              className="btn-terminal text-sm px-4 py-2"
            >
              [← 返回列表]
            </Link>
          </div>
        </div>

        {isPlayground && (
          <div className={`${isFullscreen ? 'w-full lg:w-2/3' : 'w-full'} flex flex-col`}>
            <div className="card-terminal flex-1 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--primary)]">
                    实时预览
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {challengeConfig ? challengeConfig.title : 'Loading...'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFullscreen}
                    className="btn-terminal text-xs px-3 py-1.5"
                  >
                    {isFullscreen ? '[退出全屏]' : '[全屏显示]'}
                  </button>
                  <Link
                    href={`/${locale}/challenge/${slug}/playground`}
                    className="btn-terminal text-xs px-3 py-1.5"
                  >
                    [前往 Playground]
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                {challengeConfig ? (
                  <PreviewFrame code={previewCode} dependencies={challengeConfig.dependencies} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-[var(--primary)] animate-blink">Loading preview...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {!isFullscreen && (
        <div className="mt-4 md:mt-6 text-center text-xs opacity-40">
          &gt; root@ai-era:~/challenge/{slug}# _
          <span className="animate-blink">█</span>
        </div>
      )}
    </div>
  );
}

export default function ChallengePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const resolvedParams = use(params);
  const { slug, locale } = resolvedParams;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 flex items-center justify-center">
        <div className="text-[var(--primary)] animate-blink">Loading...</div>
      </div>
    }>
      <ChallengeContent slug={slug} locale={locale} />
    </Suspense>
  );
}
