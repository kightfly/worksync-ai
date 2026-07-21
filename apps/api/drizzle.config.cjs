const { config } = require('dotenv');
const { resolve } = require('path');

config({ path: resolve(__dirname, '../../.env.local') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL が .env.local に設定されていません');
}

const useSsl =
  connectionString.includes('supabase.com') ||
  connectionString.includes('sslmode=require');

/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: '../../packages/infrastructure/src/db/schema.ts',
  out: '../../packages/infrastructure/drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  },
};