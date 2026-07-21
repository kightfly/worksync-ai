import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../../../../.env.local') });

export function getEnv() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET が .env.local に設定されていません');
  }
  return {
    jwtSecret,
    port: Number(process.env.PORT ?? 3000),
  };
}