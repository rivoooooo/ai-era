import { pgTable, text, timestamp, uuid, integer, uniqueIndex, index, json, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at'),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
  userIdIdx: index('idx_sessions_user_id').on(table.userId),
}));

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
}, (table) => ({
  userIdIdx: index('idx_accounts_user_id').on(table.userId),
  providerIdIdx: index('idx_accounts_provider_id').on(table.providerId, table.accountId),
}));

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
}, (table) => ({
  identifierIdx: index('idx_verifications_identifier').on(table.identifier),
}));

export const sandboxes = pgTable('sandboxes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  type: text('type').notNull(),
  importSource: text('import_source'),
  files: json('files').$type<ChallengeFile[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugUnique: uniqueIndex('sandboxes_slug_unique').on(table.slug),
}));

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
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  sandboxId: uuid('sandbox_id').references(() => sandboxes.id, { onDelete: 'set null' }),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  difficulty: text('difficulty').notNull(),
  language: text('language').notNull().default('en'),
  starterCode: json('starter_code').$type<ChallengeFile[]>(),
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  slugLanguageUnique: uniqueIndex('challenges_slug_language_unique').on(table.slug, table.language),
  languageIdx: index('idx_challenges_language').on(table.language),
  slugLanguageIdx: index('idx_challenges_slug_language').on(table.slug, table.language),
}));

export interface ChallengeFile {
  filename: string;
  language: string;
  content: string;
}

export const challengeResources = pgTable('challenge_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  importSource: text('import_source'),
  initCode: json('init_code').$type<ChallengeFile[]>(),
  codeSource: json('code_source').$type<ChallengeFile[]>(),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdIdx: index('idx_challenge_resources_challenge_id').on(table.challengeId),
  typeIdx: index('idx_challenge_resources_type').on(table.type),
  challengeTypeUnique: uniqueIndex('challenge_resources_challenge_type_unique').on(table.challengeId, table.type),
}));

export const challengeDependencies = pgTable('challenge_dependencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  dependsOn: uuid('depends_on').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdIdx: index('idx_challenge_dependencies_challenge_id').on(table.challengeId),
  dependsOnIdx: index('idx_challenge_dependencies_depends_on').on(table.dependsOn),
  challengeDependsUnique: uniqueIndex('challenge_dependencies_challenge_depends_unique').on(table.challengeId, table.dependsOn),
}));

export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  admin: many(admins),
}));

export const sandboxesRelations = relations(sandboxes, ({ many }) => ({
  challenges: many(challenges),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  challenges: many(challenges),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  category: one(categories, {
    fields: [challenges.categoryId],
    references: [categories.id],
  }),
  sandbox: one(sandboxes, {
    fields: [challenges.sandboxId],
    references: [sandboxes.id],
  }),
  resources: many(challengeResources),
  dependencies: many(challengeDependencies),
}));

export const challengeResourcesRelations = relations(challengeResources, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeResources.challengeId],
    references: [challenges.id],
  }),
}));

export const challengeDependenciesRelations = relations(challengeDependencies, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeDependencies.challengeId],
    references: [challenges.id],
  }),
  dependsOnChallenge: one(challenges, {
    fields: [challengeDependencies.dependsOn],
    references: [challenges.id],
    relationName: 'depends_on_challenge',
  }),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;
export type ChallengeResource = typeof challengeResources.$inferSelect;
export type NewChallengeResource = typeof challengeResources.$inferInsert;
export type ChallengeDependency = typeof challengeDependencies.$inferSelect;
export type NewChallengeDependency = typeof challengeDependencies.$inferInsert;
export type Sandbox = typeof sandboxes.$inferSelect;
export type NewSandbox = typeof sandboxes.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
