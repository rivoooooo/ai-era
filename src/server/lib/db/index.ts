import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://api_user:api_password@localhost:5432/api_test';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
