import { db } from '../db/index';
import { categories, challenges } from '../db/schema';
import { eq, asc } from 'drizzle-orm';

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
  }[];
}

export async function getCategoriesWithChallenges(): Promise<CategoryWithChallenges[]> {
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
      })
      .from(challenges)
      .where(eq(challenges.categoryId, category.id));

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

export async function getChallengeBySlug(slug: string) {
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.slug, slug),
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
