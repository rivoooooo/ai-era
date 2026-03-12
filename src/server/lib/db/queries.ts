import { db } from '../db/index';
import { categories, challenges } from '../db/schema';
import { eq, asc, and } from 'drizzle-orm';

export interface CategoryWithChallenges {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  displayOrder: number;
  challenges: {
    name: string;
    description: string | null;
    slug: string;
    difficulty: string;
    language: string;
  }[];
}

export async function getCategoriesWithChallenges(language: string = 'en'): Promise<CategoryWithChallenges[]> {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder));

  const result: CategoryWithChallenges[] = [];

  for (const category of allCategories) {
    const categoryChallenges = await db
      .select({
        name: challenges.name,
        description: challenges.description,
        slug: challenges.slug,
        difficulty: challenges.difficulty,
        language: challenges.language,
      })
      .from(challenges)
      .where(and(
        eq(challenges.categoryId, category.id),
        eq(challenges.language, language)
      ));

    result.push({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      displayOrder: category.displayOrder ?? 0,
      challenges: categoryChallenges,
    });
  }

  return result;
}

export async function getChallengeBySlug(slug: string, language: string = 'en') {
  const challenge = await db.query.challenges.findFirst({
    where: and(
      eq(challenges.slug, slug),
      eq(challenges.language, language)
    ),
  });

  if (!challenge) return null;

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, challenge.categoryId),
  });

  return {
    ...challenge,
    category,
  };
}

export async function getChallengesByLanguage(language: string) {
  return db
    .select()
    .from(challenges)
    .where(eq(challenges.language, language));
}

export async function getAvailableLanguages() {
  const result = await db
    .selectDistinct({ language: challenges.language })
    .from(challenges);
  return result.map(r => r.language);
}
