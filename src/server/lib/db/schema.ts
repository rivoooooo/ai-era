import { pgTable, text, timestamp, uuid, integer, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon').notNull(),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const challenges = pgTable('challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  difficulty: text('difficulty').notNull(),
  language: text('language').notNull().default('en'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  slugLanguageUnique: uniqueIndex('challenges_slug_language_unique').on(table.slug, table.language),
  languageIdx: index('idx_challenges_language').on(table.language),
  slugLanguageIdx: index('idx_challenges_slug_language').on(table.slug, table.language),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;
