'use client';

import { useState, use, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { EmptyState } from '@/components/ui/empty';
import { LoadingPage, LoadingSkeletonCard } from '@/components/ui/loading';
import { useChallenge } from '@/lib/hooks/useChallenge';
import { cn } from '@/lib/utils';

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

const typeLabels: Record<string, { zh: string; en: string }> = {
  html: { zh: 'HTML', en: 'HTML' },
  react: { zh: 'React', en: 'React' },
  vue: { zh: 'Vue', en: 'Vue' },
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
  const typeParam = searchParams.get('type');
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(typeParam || '');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

  const { data: challengeData, loading, error, refetch, retryCount } = useChallenge(
    slug,
    lang,
    typeParam || undefined,
    {
      retry: 3,
      retryDelay: 1000,
      timeout: 10000,
    }
  );

  useEffect(() => {
    if (typeParam && typeParam !== selectedType) {
      setSelectedType(typeParam);
      setSelectedFileIndex(0);
    }
  }, [typeParam, selectedType]);

  useEffect(() => {
    if (challengeData?.resources && challengeData.resources.length > 0 && !selectedType) {
      setSelectedType(challengeData.resources[0].type);
      setSelectedFileIndex(0);
    }
  }, [challengeData, selectedType]);

  const handleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedFileIndex(0);
  };

  const handleFileSelect = (index: number) => {
    setSelectedFileIndex(index);
  };

  const renderPreview = (): string => {
    if (!challengeData?.resources) return '';
    
    const currentResource = challengeData.resources.find(r => r.type === selectedType);
    if (!currentResource?.codeSource) return '';
    
    const htmlFile = currentResource.codeSource.find(f => f.filename.endsWith('.html'));
    if (htmlFile) {
      return htmlFile.content;
    }
    
    const jsxFile = currentResource.codeSource.find(f => f.filename.endsWith('.jsx') || f.filename.endsWith('.js'));
    if (jsxFile) {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>body { font-family: Arial, sans-serif; padding: 20px; }</style>
</head>
<body>
  <div id="root"></div>
  <script src="https://esm.sh/react@19/umd/react.development.js"></script>
  <script src="https://esm.sh/react-dom@19/umd/react-dom.development.js"></script>
  <script type="module">
${jsxFile.content.replace(/import .+ from .+/g, '').replace(/export default/g, '')}
  </script>
</body>
</html>`;
    }
    
    return currentResource.codeSource[0]?.content || '';
  };

  const hasName = !!challengeData?.name;
  const hasDescription = !!challengeData?.description;
  const hasDifficulty = !!challengeData?.difficulty;
  const hasCategory = !!challengeData?.category?.name;
  const hasResources = challengeData?.resources && challengeData.resources.length > 0;
  const currentResource = challengeData?.resources?.find(r => r.type === selectedType);
  const availableTypes = challengeData?.resources?.map(r => r.type) || [];
  const currentFiles = currentResource?.initCode || currentResource?.codeSource || [];
  const hasFiles = currentFiles.length > 0;
  const currentFile = currentFiles[selectedFileIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <LoadingSkeletonCard className="mb-4" />
            <LoadingSkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (error || !challengeData) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 flex flex-col items-center justify-center gap-4">
        <EmptyState
          variant="error"
          title="Challenge Not Found"
          description={error || "The challenge you're looking for doesn't exist or couldn't be loaded."}
          action={
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => refetch()} 
                className="btn-terminal text-sm px-4 py-2"
              >
                [RETRY {retryCount > 0 && `(${retryCount})`}]
              </button>
              <Link href={`/${locale}/challenge`} className="btn-terminal text-sm px-4 py-2">
                [BACK TO CHALLENGES]
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen bg-[var(--background)]',
      isFullscreen ? 'fixed inset-0 z-50' : 'p-4 md:p-8'
    )}>
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

      <div className={cn(
        isFullscreen ? 'h-full' : 'max-w-7xl mx-auto',
        'flex flex-col lg:flex-row gap-4 md:gap-6'
      )}>
        <div className={cn(
          'flex flex-col',
          isFullscreen ? 'w-full lg:w-1/3' : 'w-full'
        )}>
          <div className="mb-4 md:mb-6">
            <div className="flex items-center gap-2 text-xs opacity-60 mb-2">
              <Link href={`/${locale}/challenge`} className="hover:text-[var(--primary)] transition-colors">
                Challenges
              </Link>
              <span>/</span>
              <span>{slug}</span>
              <span className="text-[var(--muted-foreground)]">({lang})</span>
            </div>
            
            {hasName ? (
              <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">
                {challengeData.name}
              </h1>
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--muted-foreground)] mb-2">
                Untitled Challenge
              </h1>
            )}
            
            {hasDescription ? (
              <p className="text-sm opacity-60 mb-4">{challengeData.description}</p>
            ) : (
              <p className="text-sm opacity-60 mb-4 italic">No description available</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-xs">
              {hasDifficulty ? (
                <span 
                  className="px-2 py-1 font-bold"
                  style={{ 
                    color: difficultyColors[challengeData.difficulty],
                    border: `1px solid ${difficultyColors[challengeData.difficulty]}`
                  }}
                >
                  {challengeData.difficulty}
                </span>
              ) : (
                <span className="px-2 py-1 font-bold opacity-50">Unknown Difficulty</span>
              )}
              {hasCategory ? (
                <span className="opacity-60 py-1">{challengeData.category?.name}</span>
              ) : (
                <span className="opacity-60 py-1 italic">No category</span>
              )}
            </div>
          </div>

          {hasResources ? (
            <>
              {availableTypes.length > 0 && (
                <div className="card-terminal mb-4">
                  <div className="card-terminal-header shrink-0">
                    +-- 选择技术栈 --+
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {availableTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => handleTypeChange(type)}
                          className={cn(
                            'px-3 py-1.5 text-sm font-bold transition-all',
                            selectedType === type 
                              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' 
                              : 'bg-[var(--muted)] hover:bg-[var(--accent)]'
                          )}
                        >
                          {typeLabels[type]?.[lang as 'zh' | 'en'] || type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentResource && (
                <>
                  {currentResource.importSource ? (
                    <div className="card-terminal mb-4">
                      <div className="card-terminal-header shrink-0">
                        +-- 依赖引入 --+
                      </div>
                      <div className="p-4">
                        <pre className="text-xs bg-[var(--background)] p-3 rounded overflow-x-auto">
                          <code className="text-[var(--primary)]">{currentResource.importSource}</code>
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="card-terminal mb-4">
                      <div className="card-terminal-header shrink-0">
                        +-- 依赖引入 --+
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-[var(--muted-foreground)] italic">No import source available</p>
                      </div>
                    </div>
                  )}

                  {hasFiles ? (
                    <>
                      <div className="card-terminal mb-4">
                        <div className="card-terminal-header shrink-0">
                          +-- 文件列表 --+
                        </div>
                        <div className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {currentFiles.map((file, index) => (
                              <button
                                key={file.filename}
                                onClick={() => handleFileSelect(index)}
                                className={cn(
                                  'px-3 py-1.5 text-xs font-bold transition-all',
                                  selectedFileIndex === index 
                                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' 
                                    : 'bg-[var(--muted)] hover:bg-[var(--accent)]'
                                )}
                              >
                                {file.filename}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="card-terminal flex-1 overflow-auto">
                        <div className="card-terminal-header shrink-0">
                          +-- 代码编辑器: {currentFile?.filename} --+
                        </div>
                        <div className="p-4">
                          <pre className="text-xs bg-[var(--background)] p-3 rounded overflow-x-auto whitespace-pre-wrap">
                            <code>{currentFile?.content || ''}</code>
                          </pre>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="card-terminal mb-4">
                      <div className="card-terminal-header shrink-0">
                        +-- 文件列表 --+
                      </div>
                      <div className="p-4">
                        <EmptyState
                          variant="warning"
                          title="No Files Available"
                          description="This resource doesn't have any files."
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="card-terminal mb-4">
              <div className="card-terminal-header shrink-0">
                +-- 资源 --+
              </div>
              <div className="p-4">
                <EmptyState
                  variant="warning"
                  title="No Resources Available"
                  description="This challenge doesn't have any resources yet."
                />
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

        {currentResource && hasFiles ? (
          <div className={cn(
            'flex flex-col',
            isFullscreen ? 'w-full lg:w-2/3' : 'w-full'
          )}>
            <div className="card-terminal flex-1 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--primary)]">
                    实时预览
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {typeLabels[currentResource.type]?.[lang as 'zh' | 'en'] || currentResource.type}
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
                    href={`/${locale}/challenge/${slug}/playground?type=${selectedType}`}
                    className="btn-terminal text-xs px-3 py-1.5"
                  >
                    [前往 Playground]
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 min-h-0 p-4 bg-white">
                <iframe
                  srcDoc={renderPreview()}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-modals"
                  title="Preview"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={cn(
            'flex flex-col',
            isFullscreen ? 'w-full lg:w-2/3' : 'w-full'
          )}>
            <div className="card-terminal flex-1 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
              <EmptyState
                variant="warning"
                title="No Preview Available"
                description={hasResources ? "This resource doesn't have preview files." : "No resources available for preview."}
              />
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
    <Suspense fallback={<LoadingPage text="Loading page..." />}>
      <ChallengeContent slug={slug} locale={locale} />
    </Suspense>
  );
}
