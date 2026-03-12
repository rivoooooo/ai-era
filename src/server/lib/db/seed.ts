import { db } from './index';
import { categories, challenges } from './schema';

const seedData = async () => {
  console.log('Seeding database...');

  const categoryData = [
    { name: 'JavaScript', description: 'JavaScript 编程挑战', icon: 'js', displayOrder: 1 },
    { name: 'TypeScript', description: 'TypeScript 类型挑战', icon: 'ts', displayOrder: 2 },
    { name: 'React', description: 'React 组件挑战', icon: 'react', displayOrder: 3 },
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
      categoryId: categoryMap.get('JavaScript')!,
      slug: 'array-sum',
      name: '数组求和',
      description: '编写一个函数，计算数组中所有元素的和',
      difficulty: 'easy',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('JavaScript')!,
      slug: 'array-sum',
      name: 'Array Sum',
      description: 'Write a function that calculates the sum of all elements in an array',
      difficulty: 'easy',
      language: 'en',
    },
    {
      categoryId: categoryMap.get('JavaScript')!,
      slug: 'palindrome-check',
      name: '回文检测',
      description: '判断一个字符串是否为回文',
      difficulty: 'medium',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('JavaScript')!,
      slug: 'palindrome-check',
      name: 'Palindrome Check',
      description: 'Determine if a string is a palindrome',
      difficulty: 'medium',
      language: 'en',
    },
    {
      categoryId: categoryMap.get('TypeScript')!,
      slug: 'generic-repository',
      name: '泛型仓库',
      description: '实现一个泛型数据仓库接口',
      difficulty: 'hard',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('TypeScript')!,
      slug: 'generic-repository',
      name: 'Generic Repository',
      description: 'Implement a generic data repository interface',
      difficulty: 'hard',
      language: 'en',
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
