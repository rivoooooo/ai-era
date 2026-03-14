import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getCategoriesWithChallenges } from '@/server/lib/db/queries';
import ChallengesSkillTree from '@/components/ChallengesSkillTree';

const localeToLanguage: Record<string, string> = {
  'zh': 'zh',
  'en': 'en',
  'ja': 'ja',
};

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const language = localeToLanguage[locale] || 'en';
  
  const t = await getTranslations('challenge');
  
  let categories: Awaited<ReturnType<typeof getCategoriesWithChallenges>> = [];
  
  try {
    categories = await getCategoriesWithChallenges(language);
  } catch (error) {
    console.error('Failed to fetch categories from database:', error);
  }
  
  const rawChallenges = categories.flatMap((cat) =>
    cat.challenges.map((challenge) => ({
      id: challenge.id,
      name: challenge.name,
      slug: challenge.slug,
      description: challenge.description,
      difficulty: challenge.difficulty,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryIcon: cat.icon,
    }))
  );
  
  const rawDependencies: { challengeId: string; dependsOn: string }[] = [];
  
  const completedChallenges: Record<string, boolean> = {};
  
  const isLoggedIn = false;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-glow mb-4 md:mb-6 tracking-tight">
          &gt; CHALLENGES_
          <span className="animate-blink text-xl md:text-2xl">█</span>
        </h1>
        <p className="text-sm md:text-base opacity-60 max-w-2xl mx-auto mb-6">
          $ skill-tree --render --interactive
        </p>
        <p className="text-xs md:text-sm opacity-40 max-w-xl mx-auto">
          Select a challenge to start your learning journey
        </p>
      </div>

      <Suspense fallback={
        <div className="text-center py-20">
          <p className="text-sm opacity-60">&gt; loading skill tree...</p>
        </div>
      }>
        <ChallengesSkillTree
          rawChallenges={rawChallenges}
          rawDependencies={rawDependencies}
          completedChallenges={completedChallenges}
          isLoggedIn={isLoggedIn}
        />
      </Suspense>
    </div>
  );
}
