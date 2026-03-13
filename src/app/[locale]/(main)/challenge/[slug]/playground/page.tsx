'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import CodeEditor from './components/CodeEditor';
import PreviewFrame from './components/PreviewFrame';
import { getChallengeConfig, type ChallengeConfig, type ChallengeFile } from './utils';
import { EmptyState } from '@/components/ui/empty';

export default function PlaygroundPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string || 'en';
  
  const [challenge, setChallenge] = useState<ChallengeConfig | null>(null);
  const [code, setCode] = useState<ChallengeFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      getChallengeConfig(slug, locale).then(config => {
        if (mounted) {
          setChallenge(config);
          setCode(config?.initCode || []);
          setLoading(false);
        }
      });
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [slug, locale]);

  const handleCodeChange = useCallback((content: string) => {
    setCode(prevCode => {
      if (!prevCode[activeFileIndex]) return prevCode;
      const newCode = [...prevCode];
      newCode[activeFileIndex] = {
        ...newCode[activeFileIndex],
        content
      };
      return newCode;
    });
  }, [activeFileIndex]);

  const hasTitle = useMemo(() => !!challenge?.title, [challenge]);
  const hasDescription = useMemo(() => !!challenge?.description, [challenge]);
  const hasInitCode = useMemo(() => code.length > 0, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--primary)] animate-blink">Loading...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <EmptyState
          variant="error"
          title="Challenge Not Found"
          description="The challenge you're looking for doesn't exist or couldn't be loaded."
          action={
            <Link href="/en/challenge" className="btn-terminal text-sm px-4 py-2">
              [BACK TO CHALLENGES]
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center gap-4">
          <Link 
            href={`/en/challenge/${slug}`}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
          >
            ← Back
          </Link>
          <div>
            {hasTitle ? (
              <h1 className="text-lg font-bold text-[var(--foreground)] text-glow">
                {challenge.title}
              </h1>
            ) : (
              <h1 className="text-lg font-bold text-[var(--muted-foreground)]">
                Untitled Challenge
              </h1>
            )}
            {hasDescription ? (
              <p className="text-xs text-[var(--muted-foreground)]">
                {challenge.description}
              </p>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)] italic">
                No description available
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
          >
            {showDescription ? '[HIDE DESC]' : '[SHOW DESC]'}
          </button>
          <div className="text-xs text-[var(--muted-foreground)]">
            <span className="text-[var(--primary)]">{slug}</span>
            <span className="ml-2 px-1.5 py-0.5 bg-[var(--muted)] rounded text-[10px]">
              {challenge.sandboxType}
            </span>
          </div>
        </div>
      </header>

      {showDescription && (
        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--card)] max-h-48 overflow-y-auto">
          {hasDescription ? (
            <div className="prose prose-sm prose-invert max-w-none">
              <h3 className="text-sm font-bold text-[var(--primary)] mb-2">Challenge Description</h3>
              <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">{challenge.description}</p>
              {challenge.importSource ? (
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-[var(--muted-foreground)] mb-1">Import Source:</h4>
                  <pre className="text-xs bg-[var(--muted)] p-2 rounded overflow-x-auto">
                    <code>{challenge.importSource}</code>
                  </pre>
                </div>
              ) : (
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-[var(--muted-foreground)] mb-1">Import Source:</h4>
                  <p className="text-xs text-[var(--muted-foreground)] italic">No import source available</p>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              variant="warning"
              title="No Description"
              description="This challenge doesn't have a description yet."
            />
          )}
        </div>
      )}

      <main className="flex-1 min-h-0 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-[var(--border)]">
          {hasInitCode ? (
            <CodeEditor 
              files={code} 
              activeFileIndex={activeFileIndex}
              onFileSelect={setActiveFileIndex}
              onChange={handleCodeChange} 
            />
          ) : (
            <div className="h-full flex items-center justify-center p-4 bg-[var(--card)] border border-[var(--border)]">
              <EmptyState
                variant="warning"
                title="No Initial Code"
                description="This challenge doesn't have initial code files. Please check the challenge resources or try a different challenge."
                action={
                  <Link href={`/en/challenge/${slug}`} className="btn-terminal text-xs px-3 py-1.5">
                    [BACK TO CHALLENGE]
                  </Link>
                }
              />
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 h-1/2 md:h-full">
          {hasInitCode ? (
            <PreviewFrame 
              codeSource={code}
              importSource={challenge.importSource}
              sandboxType={challenge.sandboxType}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-4 bg-[var(--card)] border border-[var(--border)]">
              <EmptyState
                variant="warning"
                title="No Preview Available"
                description="This challenge doesn't have preview resources configured. You can still edit the code on the left side."
              />
            </div>
          )}
        </div>
      </main>

      <footer className="px-4 py-2 border-t border-[var(--border)] bg-[var(--card)] text-center">
        <span className="text-xs text-[var(--muted-foreground)]">
          &gt; root@ai-era:~/challenge/{slug}/playground#
          <span className="animate-blink">█</span>
        </span>
      </footer>
    </div>
  );
}
