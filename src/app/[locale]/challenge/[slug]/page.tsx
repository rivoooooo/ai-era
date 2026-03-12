'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { getChallengeConfig, type ChallengeConfig } from '@/app/[locale]/challenge/[slug]/playground/utils';
import PreviewFrame from '@/app/[locale]/challenge/[slug]/playground/components/PreviewFrame';

interface Question {
  id: number;
  question: string;
  options?: string[];
  answer?: string;
  code?: string;
}

interface Challenge {
  slug: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  category: string;
  questions: Question[];
  content?: {
    intro: string;
    objectives: string[];
    hints: string[];
  };
}

const challenges: Record<string, Challenge> = {}

const playgroundChallenges: string[] = [];

const difficultyColors: Record<string, string> = {
  EASY: "var(--success)",
  MEDIUM: "var(--warning)",
  HARD: "var(--chart-3)",
  EXPERT: "var(--error)",
};

export default function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const challenge = challenges[slug];
  const isPlayground = playgroundChallenges.includes(slug);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewCode, setPreviewCode] = useState({
    html: '',
    css: '',
    js: ''
  });
  const [challengeConfig, setChallengeConfig] = useState<ChallengeConfig | null>(null);

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

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card-terminal">
            <div className="card-terminal-header">
              +-- ERROR --+
            </div>
            <div className="p-8 text-center">
              <p className="text-lg mb-4">Challenge not found</p>
              <Link href="/en/challenge" className="btn-terminal inline-block">
                [BACK TO CHALLENGES]
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <Link href="/en/challenge" className="hover:text-[var(--primary)] transition-colors">
                Challenges
              </Link>
              <span>/</span>
              <span>{challenge.slug}</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">
              {challenge.title}
            </h1>
            <p className="text-sm opacity-60 mb-4">{challenge.description}</p>
            
            <div className="flex flex-wrap gap-4 text-xs">
              <span 
                className="px-2 py-1 font-bold"
                style={{ 
                  color: difficultyColors[challenge.difficulty],
                  border: `1px solid ${difficultyColors[challenge.difficulty]}`
                }}
              >
                {challenge.difficulty}
              </span>
              <span className="opacity-60 py-1">{challenge.category}</span>
            </div>
          </div>

          {isPlayground && challenge.content && (
            <div className="card-terminal flex-1 overflow-auto">
              <div className="card-terminal-header shrink-0">
                +-- 挑战介绍 --+
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--primary)] mb-2">概述</h3>
                  <p className="text-sm opacity-80">{challenge.content.intro}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-[var(--primary)] mb-2">学习目标</h3>
                  <ul className="space-y-1">
                    {challenge.content.objectives.map((obj, i) => (
                      <li key={i} className="text-sm opacity-80 flex items-start gap-2">
                        <span className="text-[var(--primary)]">▸</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-[var(--primary)] mb-2">提示</h3>
                  <ul className="space-y-1">
                    {challenge.content.hints.map((hint, i) => (
                      <li key={i} className="text-sm opacity-60 flex items-start gap-2">
                        <span className="text-[var(--warning)]">💡</span>
                        <span dangerouslySetInnerHTML={{ __html: hint.replace(/</g, '&lt;').replace(/>/g, '&gt;') }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!isPlayground && (
            <div className="space-y-6">
              {challenge.questions.map((q, index) => (
                <div key={q.id} className="card-terminal">
                  <div className="card-terminal-header">
                    +-- QUESTION {index + 1} --+
                  </div>
                  <div className="p-4">
                    <p className="text-sm mb-4 font-bold">
                      {q.id}. {q.question}
                    </p>
                    
                    {q.code && (
                      <pre className="bg-[var(--background)] border border-[var(--border)] p-4 mb-4 text-xs md:text-sm overflow-x-auto">
                        <code>{q.code}</code>
                      </pre>
                    )}

                    {q.options && (
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => (
                          <label 
                            key={optIndex}
                            className="flex items-start gap-3 p-3 border border-[var(--border)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer transition-all"
                          >
                            <input 
                              type="radio" 
                              name={`question-${q.id}`}
                              className="mt-0.5 accent-[var(--primary)]"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <button className="btn-terminal text-lg px-8 py-3">
                  [SUBMIT ANSWERS]
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 md:mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link 
              href="/en/challenge"
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
                    href={`/en/challenge/${slug}/playground`}
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
          &gt; root@ai-era:~/challenge/{challenge.slug}# _
          <span className="animate-blink">█</span>
        </div>
      )}
    </div>
  );
}
