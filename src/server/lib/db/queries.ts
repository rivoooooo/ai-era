import { db } from '../db/index';
import { categories, challenges, challengeResources, challengeDependencies } from '../db/schema';
import { eq, asc, and, like, or, sql } from 'drizzle-orm';

export interface CategoryWithChallenges {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  displayOrder: number;
  challenges: {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    difficulty: string;
    language: string;
  }[];
}

export interface ChallengesListParams {
  language?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ChallengesListResult {
  data: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    difficulty: string;
    language: string;
    categoryId: string | null;
    category?: {
      id: string;
      name: string;
      icon: string;
    };
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAllCategories() {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder));
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
        id: challenges.id,
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

  const category = challenge.categoryId 
    ? await db.query.categories.findFirst({
        where: eq(categories.id, challenge.categoryId),
      })
    : null;

  return {
    ...challenge,
    category,
  };
}

export async function getChallengeWithResources(slug: string, language: string = 'en', type?: string) {
  const challenge = await getChallengeBySlug(slug, language);
  if (!challenge) return null;

  const resources = await db
    .select()
    .from(challengeResources)
    .where(type 
      ? and(
          eq(challengeResources.challengeId, challenge.id),
          eq(challengeResources.type, type)
        )
      : eq(challengeResources.challengeId, challenge.id)
    );

  return {
    ...challenge,
    resources,
  };
}

export async function getChallengesList(params: ChallengesListParams): Promise<ChallengesListResult> {
  const {
    language = 'en',
    category,
    difficulty,
    page = 1,
    limit = 10,
    search,
  } = params;

  const conditions: any[] = [eq(challenges.language, language)];

  if (category) {
    const categoryResult = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, category))
      .limit(1);
    
    if (categoryResult.length > 0) {
      conditions.push(eq(challenges.categoryId, categoryResult[0].id));
    }
  }

  if (difficulty) {
    conditions.push(eq(challenges.difficulty, difficulty));
  }

  if (search) {
    conditions.push(
      or(
        like(challenges.name, `%${search}%`),
        like(challenges.description, `%${search}%`)
      )
    );
  }

  const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

  const offset = (page - 1) * limit;

  const baseQuery = db
    .select({
      id: challenges.id,
      name: challenges.name,
      slug: challenges.slug,
      description: challenges.description,
      difficulty: challenges.difficulty,
      language: challenges.language,
      categoryId: challenges.categoryId,
    })
    .from(challenges)
    .$dynamic();

  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(challenges)
    .$dynamic();

  const [data, countResult] = await Promise.all([
    whereCondition 
      ? baseQuery.where(whereCondition).orderBy(asc(challenges.createdAt)).limit(limit).offset(offset)
      : baseQuery.orderBy(asc(challenges.createdAt)).limit(limit).offset(offset),
    whereCondition 
      ? countQuery.where(whereCondition)
      : countQuery,
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  const dataWithCategory = await Promise.all(
    data.map(async (item) => {
      const categoryResult = item.categoryId
        ? await db
            .select({
              id: categories.id,
              name: categories.name,
              icon: categories.icon,
            })
            .from(categories)
            .where(eq(categories.id, item.categoryId))
            .limit(1)
        : [];

      return {
        ...item,
        category: categoryResult[0] || null,
      };
    })
  );

  return {
    data: dataWithCategory,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getChallengeResourcesByChallengeSlug(slug: string, language: string = 'en') {
  const challenge = await getChallengeBySlug(slug, language);
  if (!challenge) return [];

  return db
    .select()
    .from(challengeResources)
    .where(eq(challengeResources.challengeId, challenge.id));
}

export async function getChallengeResourcesByType(challengeId: string, type: string) {
  return db
    .select()
    .from(challengeResources)
    .where(and(
      eq(challengeResources.challengeId, challengeId),
      eq(challengeResources.type, type)
    ));
}

export async function getAllChallengeResources(challengeId: string) {
  return db
    .select()
    .from(challengeResources)
    .where(eq(challengeResources.challengeId, challengeId));
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

export async function getAvailableTypes() {
  const result = await db
    .selectDistinct({ type: challengeResources.type })
    .from(challengeResources);
  return result.map(r => r.type);
}

export async function getAvailableDifficulties() {
  const result = await db
    .selectDistinct({ difficulty: challenges.difficulty })
    .from(challenges);
  return result.map(r => r.difficulty);
}

export interface ChallengeDependencyWithDetails {
  id: string;
  challengeId: string;
  dependsOn: string;
  dependsOnChallenge?: {
    id: string;
    name: string;
    slug: string;
    difficulty: string;
  };
}

export async function getChallengeDependencies(challengeId: string): Promise<ChallengeDependencyWithDetails[]> {
  const dependencies = await db
    .select()
    .from(challengeDependencies)
    .where(eq(challengeDependencies.challengeId, challengeId));

  const dependenciesWithDetails = await Promise.all(
    dependencies.map(async (dep) => {
      const dependsOnChallenge = await db
        .select({
          id: challenges.id,
          name: challenges.name,
          slug: challenges.slug,
          difficulty: challenges.difficulty,
        })
        .from(challenges)
        .where(eq(challenges.id, dep.dependsOn))
        .limit(1);

      return {
        ...dep,
        dependsOnChallenge: dependsOnChallenge[0] || null,
      };
    })
  );

  return dependenciesWithDetails;
}

export async function getChallengeDependents(challengeId: string): Promise<ChallengeDependencyWithDetails[]> {
  const dependents = await db
    .select()
    .from(challengeDependencies)
    .where(eq(challengeDependencies.dependsOn, challengeId));

  const dependentsWithDetails = await Promise.all(
    dependents.map(async (dep) => {
      const challenge = await db
        .select({
          id: challenges.id,
          name: challenges.name,
          slug: challenges.slug,
          difficulty: challenges.difficulty,
        })
        .from(challenges)
        .where(eq(challenges.id, dep.challengeId))
        .limit(1);

      return {
        ...dep,
        dependsOnChallenge: challenge[0] || null,
      };
    })
  );

  return dependentsWithDetails;
}

export interface ChallengeDependencyGraph {
  challengeId: string;
  challengeName: string;
  challengeSlug: string;
  dependsOn: string[];
  dependents: string[];
}

export async function getAllChallengeDependencies(): Promise<ChallengeDependencyGraph[]> {
  const allChallenges = await db
    .select({
      id: challenges.id,
      name: challenges.name,
      slug: challenges.slug,
    })
    .from(challenges);

  const allDependencies = await db
    .select()
    .from(challengeDependencies);

  const graphMap = new Map<string, ChallengeDependencyGraph>();

  for (const challenge of allChallenges) {
    graphMap.set(challenge.id, {
      challengeId: challenge.id,
      challengeName: challenge.name,
      challengeSlug: challenge.slug,
      dependsOn: [],
      dependents: [],
    });
  }

  for (const dep of allDependencies) {
    const challengeGraph = graphMap.get(dep.challengeId);
    const dependsOnGraph = graphMap.get(dep.dependsOn);

    if (challengeGraph) {
      challengeGraph.dependsOn.push(dep.dependsOn);
    }
    if (dependsOnGraph) {
      dependsOnGraph.dependents.push(dep.challengeId);
    }
  }

  return Array.from(graphMap.values());
}
