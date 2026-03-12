import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TypewriterText } from '@/components/TypewriterText';
import { ModeToggle } from "@/components/mode-toggle";

interface Challenge {
  name: string;
  description: string;
  href: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
}

interface Category {
  name: string;
  description: string;
  challenges: Challenge[];
  icon: string;
}

const categories: Category[] = [
  {
    name: "AI CHALLENGES",
    description: "Modern AI tools & prompt engineering",
    icon: "[AI]",
    challenges: [
      { name: "prompt-engineering", description: "Master AI prompt writing", href: "/challenge/prompt-engineering", difficulty: "EASY" },
      { name: "ai-code-review", description: "AI-powered code review", href: "/challenge/ai-code-review", difficulty: "MEDIUM" },
      { name: "copilot-mastery", description: "GitHub Copilot advanced usage", href: "/challenge/copilot-mastery", difficulty: "MEDIUM" },
      { name: "ai-debugging", description: "Debug with AI assistants", href: "/challenge/ai-debugging", difficulty: "HARD" },
      { name: "rag-system", description: "Build RAG from scratch", href: "/challenge/rag-system", difficulty: "EXPERT" },
    ],
  },
  {
    name: "FRONTEND PRINCIPLES",
    description: "Core frontend fundamentals",
    icon: "[FUNDAMENTALS]",
    challenges: [
      { name: "event-loop", description: "JavaScript Event Loop", href: "/challenge/event-loop", difficulty: "MEDIUM" },
      { name: "closure-mastery", description: "Deep dive into Closures", href: "/challenge/closure-mastery", difficulty: "MEDIUM" },
      { name: "this-binding", description: "Understanding 'this' binding", href: "/challenge/this-binding", difficulty: "EASY" },
      { name: "async-patterns", description: "Async/Await patterns", href: "/challenge/async-patterns", difficulty: "HARD" },
      { name: "react-rendering", description: "React rendering optimization", href: "/challenge/react-rendering", difficulty: "EXPERT" },
    ],
  },
  {
    name: "PERFORMANCE",
    description: "Web performance optimization",
    icon: "[PERF]",
    challenges: [
      { name: "bundle-analysis", description: "Analyze and optimize bundles", href: "/challenge/bundle-analysis", difficulty: "MEDIUM" },
      { name: "lazy-loading", description: "Code splitting strategies", href: "/challenge/lazy-loading", difficulty: "EASY" },
      { name: "rendering-strategies", description: "CSR vs SSR vs SSG vs ISR", href: "/challenge/rendering-strategies", difficulty: "HARD" },
      { name: "memory-leaks", description: "Detect and fix memory leaks", href: "/challenge/memory-leaks", difficulty: "EXPERT" },
    ],
  },
  {
    name: "NETWORK",
    description: "HTTP & network protocols",
    icon: "[NET]",
    challenges: [
      { name: "http-basics", description: "HTTP methods & status codes", href: "/challenge/http-basics", difficulty: "EASY" },
      { name: "cors-deep-dive", description: "CORS preflight & policies", href: "/challenge/cors-deep-dive", difficulty: "MEDIUM" },
      { name: "cache-strategies", description: "Browser caching patterns", href: "/challenge/cache-strategies", difficulty: "HARD" },
      { name: "websocket", description: "Real-time communication", href: "/challenge/websocket", difficulty: "MEDIUM" },
    ],
  },
  {
    name: "CSS MASTERY",
    description: "Advanced CSS techniques",
    icon: "[CSS]",
    challenges: [
      { name: "grid-layout", description: "CSS Grid deep dive", href: "/challenge/grid-layout", difficulty: "MEDIUM" },
      { name: "flexbox-mastery", description: "Flexbox advanced patterns", href: "/challenge/flexbox-mastery", difficulty: "EASY" },
      { name: "animation", description: "High-performance animations", href: "/challenge/animation", difficulty: "HARD" },
      { name: "css-architecture", description: "Scalable CSS systems", href: "/challenge/css-architecture", difficulty: "EXPERT" },
    ],
  },
  {
    name: "TOOLING",
    description: "Build tools & dev workflow",
    icon: "[TOOLS]",
    challenges: [
      { name: "webpack-basics", description: "Webpack configuration", href: "/challenge/webpack-basics", difficulty: "MEDIUM" },
      { name: "vite-mastery", description: "Vite plugin development", href: "/challenge/vite-mastery", difficulty: "HARD" },
      { name: "eslint-rules", description: "Custom ESLint rules", href: "/challenge/eslint-rules", difficulty: "EXPERT" },
      { name: "ci-cd-pipeline", description: "GitHub Actions workflow", href: "/challenge/ci-cd-pipeline", difficulty: "MEDIUM" },
    ],
  },
];

const difficultyColors: Record<string, string> = {
  EASY: "var(--success)",
  MEDIUM: "var(--warning)",
  HARD: "var(--chart-3)",
  EXPERT: "var(--error)",
};

function splitIntoColumns<T>(arr: T[], numCols = 3): Array<T[]> {
  const cols: Array<T[]> = Array.from({ length: numCols }, () => []);
  let colIndex = 0;
  arr.forEach((item) => {
    cols[colIndex].push(item);
    if (colIndex < numCols - 1) {
      colIndex++;
    } else {
      colIndex = 0;
    }
  });
  return cols;
}

export default async function Home() {
  const t = await getTranslations('header');
  const tNav = await getTranslations('nav');
  const tSystem = await getTranslations('system');
  const tDifficulty = await getTranslations('difficulty');
  
  const totalChallenges = categories.reduce((acc, cat) => acc + cat.challenges.length, 0);

  return (
    <main className="min-h-screen">
      <div className="scanlines" />
      
      <nav className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="text-sm font-bold tracking-wider text-glow">
              &gt; AI-ERA_
            </Link>
            <div className="flex items-center gap-4 md:gap-6 text-xs">
              <Link href="/" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [{tNav('home')}]
              </Link>
              <Link href="/challenge" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [{tNav('challenges')}]
              </Link>
              <Link href="/about" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [{tNav('about')}]
              </Link>
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-glow mb-4 md:mb-6 tracking-tight">
            <TypewriterText
              texts={["AI-Era", "Web Dev Skills"]}
              typingSpeed={120}
              deletingSpeed={80}
              pauseDuration={5000}
              prefix="> "
              suffix="_"
            />
            <span className="animate-blink text-2xl md:text-3xl">█</span>
          </h1>
          <p className="text-sm md:text-base opacity-60 max-w-2xl mx-auto mb-6">
            {`$ ./start_challenge.sh --category=all --difficulty=expert`}
          </p>
          <p className="text-xs md:text-sm opacity-40 max-w-xl mx-auto">
            {t('description')}
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
                    key={challenge.name}
                    href={challenge.href}
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
              <span>[OK] {categories.length}</span>
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
    </main>
  );
}
