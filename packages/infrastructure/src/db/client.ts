import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

function createPool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL が設定されていません');
  }

  const useSsl =
    connectionString.includes('supabase.com') ||
    connectionString.includes('sslmode=require');

  return new pg.Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  });
}

let pool: pg.Pool | undefined;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getPool(): pg.Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

export function getDb() {
  if (!dbInstance) {
    dbInstance = drizzle(getPool(), { schema });
  }
  return dbInstance;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = undefined;
    dbInstance = undefined;
  }
}