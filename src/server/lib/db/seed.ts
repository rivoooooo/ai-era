import { db } from './index';
import { categories, challenges } from './schema';

const seedData = async () => {
  console.log('Seeding database...');

  const categoryData = [];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();
  
  console.log(`Inserted ${insertedCategories.length} categories`);

  const categoryMap = new Map(
    insertedCategories.map((c) => [c.name, c.id])
  );

  const challengeData = [];

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
