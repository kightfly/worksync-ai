import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

export type Db = ReturnType<typeof createDb>

export function createDb(connectionString: string) {
  // Supabase pooler (6543) 不支持 prepared statements
  const client = postgres(connectionString, { max: 10, prepare: false })
  return drizzle(client, { schema })
}

export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is required')
  }
  return url
}
