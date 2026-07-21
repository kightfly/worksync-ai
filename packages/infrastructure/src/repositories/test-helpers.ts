import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDb } from '../db/client.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../../../../.env.local') });

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function getTestDb() {
  if (!hasDatabase) {
    throw new Error('DATABASE_URL is required for integration tests');
  }
  return getDb();
}