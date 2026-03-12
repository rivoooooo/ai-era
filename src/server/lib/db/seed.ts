import { db } from './index';
import { categories, challenges } from './schema';

const seedData = async () => {
  console.log('Seeding database...');

  const categoryData = [
    {
      name: 'PLAYGROUND',
      description: 'Interactive code playgrounds',
      icon: '[PLAYGROUND]',
      displayOrder: 0,
    },
    {
      name: 'AI CHALLENGES',
      description: 'Modern AI tools & prompt engineering',
      icon: '[AI]',
      displayOrder: 1,
    },
    {
      name: 'FRONTEND PRINCIPLES',
      description: 'Core frontend fundamentals',
      icon: '[FUNDAMENTALS]',
      displayOrder: 2,
    },
    {
      name: 'PERFORMANCE',
      description: 'Web performance optimization',
      icon: '[PERF]',
      displayOrder: 3,
    },
    {
      name: 'NETWORK',
      description: 'HTTP & network protocols',
      icon: '[NET]',
      displayOrder: 4,
    },
    {
      name: 'CSS MASTERY',
      description: 'Advanced CSS techniques',
      icon: '[CSS]',
      displayOrder: 5,
    },
    {
      name: 'TOOLING',
      description: 'Build tools & dev workflow',
      icon: '[TOOLS]',
      displayOrder: 6,
    },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();
  
  console.log(`Inserted ${insertedCategories.length} categories`);

  const categoryMap = new Map(
    insertedCategories.map((c) => [c.name, c.id])
  );

  const challengeData = [
    {
      categoryId: categoryMap.get('PLAYGROUND')!,
      slug: 'html-basics',
      name: 'html-basics',
      description: 'HTML basic training',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('PLAYGROUND')!,
      slug: 'css-flexbox',
      name: 'css-flexbox',
      description: 'Flexbox layout practice',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('PLAYGROUND')!,
      slug: 'css-grid',
      name: 'css-grid',
      description: 'CSS Grid layout',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('PLAYGROUND')!,
      slug: 'animation-css',
      name: 'animation-css',
      description: 'CSS animations',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('PLAYGROUND')!,
      slug: 'dom-manipulation',
      name: 'dom-manipulation',
      description: 'DOM operations',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('PLAYGROUND')!,
      slug: 'react-basics',
      name: 'react-basics',
      description: 'React counter demo',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('PLAYGROUND')!,
      slug: 'react-todo',
      name: 'react-todo',
      description: 'React Todo List',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('PLAYGROUND')!,
      slug: 'canvas-animation',
      name: 'canvas-animation',
      description: 'Canvas animation',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('PLAYGROUND')!,
      slug: 'fetch-api',
      name: 'fetch-api',
      description: 'Fetch API demo',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('AI CHALLENGES')!,
      slug: 'prompt-engineering',
      name: 'prompt-engineering',
      description: 'Master AI prompt writing',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('AI CHALLENGES')!,
      slug: 'ai-code-review',
      name: 'ai-code-review',
      description: 'AI-powered code review',
      difficulty: 'MEDIUM',
    },
    {
      categoryId: categoryMap.get('AI CHALLENGES')!,
      slug: 'copilot-mastery',
      name: 'copilot-mastery',
      description: 'GitHub Copilot advanced usage',
      difficulty: 'MEDIUM',
    },
    {
      categoryId: categoryMap.get('AI CHALLENGES')!,
      slug: 'ai-debugging',
      name: 'ai-debugging',
      description: 'Debug with AI assistants',
      difficulty: 'HARD',
    },
    {
      categoryId: categoryMap.get('AI CHALLENGES')!,
      slug: 'rag-system',
      name: 'rag-system',
      description: 'Build RAG from scratch',
      difficulty: 'EXPERT',
    },
    {
      categoryId: categoryMap.get('FRONTEND PRINCIPLES')!,
      slug: 'event-loop',
      name: 'event-loop',
      description: 'JavaScript Event Loop',
      difficulty: 'MEDIUM',
    },
    {
      categoryId: categoryMap.get('FRONTEND PRINCIPLES')!,
      slug: 'closure-mastery',
      name: 'closure-mastery',
      description: 'Deep dive into Closures',
      difficulty: 'MEDIUM',
    },
    {
      categoryId: categoryMap.get('FRONTEND PRINCIPLES')!,
      slug: 'this-binding',
      name: 'this-binding',
      description: "Understanding 'this' binding",
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('FRONTEND PRINCIPLES')!,
      slug: 'async-patterns',
      name: 'async-patterns',
      description: 'Async/Await patterns',
      difficulty: 'HARD',
    },
    {
      categoryId: categoryMap.get('FRONTEND PRINCIPLES')!,
      slug: 'react-rendering',
      name: 'react-rendering',
      description: 'React rendering optimization',
      difficulty: 'EXPERT',
    },
    {
      categoryId: categoryMap.get('PERFORMANCE')!,
      slug: 'bundle-analysis',
      name: 'bundle-analysis',
      description: 'Analyze and optimize bundles',
      difficulty: 'MEDIUM',
    },
    {
      categoryId: categoryMap.get('PERFORMANCE')!,
      slug: 'lazy-loading',
      name: 'lazy-loading',
      description: 'Code splitting strategies',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('PERFORMANCE')!,
      slug: 'rendering-strategies',
      name: 'rendering-strategies',
      description: 'CSR vs SSR vs SSG vs ISR',
      difficulty: 'HARD',
    },
    {
      categoryId: categoryMap.get('PERFORMANCE')!,
      slug: 'memory-leaks',
      name: 'memory-leaks',
      description: 'Detect and fix memory leaks',
      difficulty: 'EXPERT',
    },
    {
      categoryId: categoryMap.get('NETWORK')!,
      slug: 'http-basics',
      name: 'http-basics',
      description: 'HTTP methods & status codes',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('NETWORK')!,
      slug: 'cors-deep-dive',
      name: 'cors-deep-dive',
      description: 'CORS preflight & policies',
      difficulty: 'MEDIUM',
    },
    {
      categoryId: categoryMap.get('NETWORK')!,
      slug: 'cache-strategies',
      name: 'cache-strategies',
      description: 'Browser caching patterns',
      difficulty: 'HARD',
    },
    {
      categoryId: categoryMap.get('NETWORK')!,
      slug: 'websocket',
      name: 'websocket',
      description: 'Real-time communication',
      difficulty: 'MEDIUM',
    },
    {
      categoryId: categoryMap.get('CSS MASTERY')!,
      slug: 'grid-layout',
      name: 'grid-layout',
      description: 'CSS Grid deep dive',
      difficulty: 'MEDIUM',
    },
    {
      categoryId: categoryMap.get('CSS MASTERY')!,
      slug: 'flexbox-mastery',
      name: 'flexbox-mastery',
      description: 'Flexbox advanced patterns',
      difficulty: 'EASY',
    },
    {
      categoryId: categoryMap.get('CSS MASTERY')!,
      slug: 'animation',
      name: 'animation',
      description: 'High-performance animations',
      difficulty: 'HARD',
    },
    {
      categoryId: categoryMap.get('CSS MASTERY')!,
      slug: 'css-architecture',
      name: 'css-architecture',
      description: 'Scalable CSS systems',
      difficulty: 'EXPERT',
    },
    {
      categoryId: categoryMap.get('TOOLING')!,
      slug: 'webpack-basics',
      name: 'webpack-basics',
      description: 'Webpack configuration',
      difficulty: 'MEDIUM',
    },
    {
      categoryId: categoryMap.get('TOOLING')!,
      slug: 'vite-mastery',
      name: 'vite-mastery',
      description: 'Vite plugin development',
      difficulty: 'HARD',
    },
    {
      categoryId: categoryMap.get('TOOLING')!,
      slug: 'eslint-rules',
      name: 'eslint-rules',
      description: 'Custom ESLint rules',
      difficulty: 'EXPERT',
    },
    {
      categoryId: categoryMap.get('TOOLING')!,
      slug: 'ci-cd-pipeline',
      name: 'ci-cd-pipeline',
      description: 'GitHub Actions workflow',
      difficulty: 'MEDIUM',
    },
  ];

  const insertedChallenges = await db
    .insert(challenges)
    .values(challengeData)
    .returning();

  console.log(`Inserted ${insertedChallenges.length} challenges`);
  console.log('Seeding completed!');
};

seedData()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
