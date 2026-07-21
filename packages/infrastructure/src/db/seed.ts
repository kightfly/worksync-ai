import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import {
  attendanceRecords,
  closeDb,
  getDb,
  tasks,
  users,
} from './index.js';

const SALT_ROUNDS = 10;
const SEED_EMAIL = 'test@example.com';
const SEED_PASSWORD = 'password123';
const SEED_NAME = 'テストユーザー';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../../../../.env.local') });

async function seed(): Promise<void> {
  const db = getDb();

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, SEED_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log('シードデータは既に存在します。スキップします。');
    return;
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);
  const userId = crypto.randomUUID();

  await db.insert(users).values({
    id: userId,
    email: SEED_EMAIL,
    passwordHash,
    name: SEED_NAME,
    isActive: true,
  });

  await db.insert(tasks).values([
    {
      userId,
      title: '要件定義を完了する',
      description: 'PRD とユーザーストーリーを確認する',
      status: 'todo',
    },
    {
      userId,
      title: 'タスク一覧画面を実装する',
      description: 'React + shadcn/ui',
      status: 'in_progress',
    },
    {
      userId,
      title: 'ログイン機能を実装する',
      description: 'JWT 認証',
      status: 'done',
    },
  ]);

  await db.insert(attendanceRecords).values([
    {
      userId,
      checkInTime: new Date('2025-01-15T00:00:00.000Z'),
      checkOutTime: new Date('2025-01-15T09:00:00.000Z'),
      workDate: '2025-01-15',
    },
    {
      userId,
      checkInTime: new Date('2025-01-15T14:00:00.000Z'),
      checkOutTime: new Date('2025-01-15T17:00:00.000Z'),
      workDate: '2025-01-15',
    },
    {
      userId,
      checkInTime: new Date('2025-01-16T00:00:00.000Z'),
      checkOutTime: new Date('2025-01-16T09:30:00.000Z'),
      workDate: '2025-01-16',
    },
  ]);

  console.log('シードデータを投入しました。');
  console.log(`  ユーザー: ${SEED_EMAIL} / ${SEED_PASSWORD}`);
}

seed()
  .catch((error) => {
    console.error('シード投入に失敗しました:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });