import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import { getCategoriesWithChallenges } from '@/server/lib/db/queries';

const difficultyColors: Record<string, string> = {
  EASY: "var(--success)",
  MEDIUM: "var(--warning)",
  HARD: "var(--chart-3)",
  EXPERT: "var(--error)",
};

export default async function ChallengePage() {
  const tSystem = await getTranslations('system');
  const tDifficulty = await getTranslations('difficulty');
  
  let categories: Awaited<ReturnType<typeof getCategoriesWithChallenges>> = [];
  
  try {
    categories = await getCategoriesWithChallenges();
  } catch (error) {
    console.error('Failed to fetch categories from database:', error);
  }
  
  const totalChallenges = categories.reduce((acc, cat) => acc + cat.challenges.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-glow mb-4 md:mb-6 tracking-tight">
          &gt; CHALLENGES_
          <span className="animate-blink text-xl md:text-2xl">█</span>
        </h1>
        <p className="text-sm md:text-base opacity-60 max-w-2xl mx-auto mb-6">
          {`$ ls -la ./challenges/ --all --recursive`}
        </p>
        <p className="text-xs md:text-sm opacity-40 max-w-xl mx-auto">
          Select a challenge to start your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {categories.map((category) => (
          <div key={category.name} className="card-terminal">
            <div className="card-terminal-header flex justify-between items-center">
              <span>{category.icon} {category.name}</span>
              <span className="opacity-60">[{category.challenges.length}]</span>
            </div>
            <p className="text-xs opacity-60 mb-4 px-1">{category.description}</p>
            <div className="flex flex-col">
              {category.challenges.map((challenge) => (
                <Link
                  key={challenge.slug}
                  href={`/en/challenge/${challenge.slug}`}
                  className="w-full py-2 px-3 hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-all duration-150 group text-left block outline-none border-l-2 border-transparent hover:border-l-primary"
                  style={{ borderColor: "transparent" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">
                      &gt; {challenge.name}
                    </span>
                    <span 
                      className="text-[10px] px-1.5 py-0.5 font-bold"
                      style={{ 
                        color: difficultyColors[challenge.difficulty],
                        border: `1px solid ${difficultyColors[challenge.difficulty]}`,
                        opacity: 0.8
                      }}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                  <span className="text-xs opacity-60 ml-0.5 block mt-0.5">
                    $ {challenge.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card-terminal">
        <div className="card-terminal-header">
          +-- SYSTEM STATUS --+
        </div>
        <div className="p-4 text-sm font-mono">
          <div className="flex justify-between mb-1">
            <span>{tSystem('categories')}:</span>
            <span>[OK] {categories.length || 0}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>{tSystem('challenges')}:</span>
            <span>[OK] {totalChallenges}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>{tSystem('status')}:</span>
            <span>[{tSystem('ready')}]</span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-border">
            <span>{tSystem('difficulty')}:</span>
            <span>[{tDifficulty('EASY')}] [{tDifficulty('MEDIUM')}] [{tDifficulty('HARD')}] [{tDifficulty('EXPERT')}]</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs opacity-40">
        &gt; root@ai-era-web-dev-skills:~/challenges# _
        <span className="animate-blink">█</span>
      </div>
    </div>
  );
}
