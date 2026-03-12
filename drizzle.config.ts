import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/server/lib/db/schema.ts',
  out: './src/server/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://api_user:api_password@localhost:5432/api_test',
  },
});
