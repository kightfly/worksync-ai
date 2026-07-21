import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { eq } from 'drizzle-orm';
import { closeDb } from '../db/client.js';
import { users } from '../db/schema.js';
import { UserRepository } from './user.repository.js';
import type { DbClient } from './types.js';
import { getTestDb, hasDatabase, hashPassword, uniqueEmail } from './test-helpers.js';

const describeIfDb = hasDatabase ? describe : describe.skip;

describeIfDb('UserRepository (integration)', () => {
  let db: DbClient;
  let repo: UserRepository;
  const createdIds: string[] = [];

  beforeAll(() => {
    db = getTestDb();
    repo = new UserRepository(db);
  });

  afterAll(async () => {
    for (const id of createdIds) {
      await db.delete(users).where(eq(users.id, id));
    }
    await closeDb();
  });

  it('create / findByEmail / findById / update / soft delete', async () => {
    const email = uniqueEmail('user-repo');
    const passwordHash = await hashPassword('password123');

    const created = await repo.create({
      email,
      passwordHash,
      name: 'リポジトリテスト',
    });
    createdIds.push(created.id);

    expect(created.email).toBe(email);
    expect(created.isActive).toBe(true);

    const byEmail = await repo.findByEmail(email);
    expect(byEmail?.id).toBe(created.id);

    const byId = await repo.findById(created.id);
    expect(byId?.name).toBe('リポジトリテスト');

    const updated = await repo.update(created.id, { name: '更新後' });
    expect(updated.name).toBe('更新後');

    await repo.delete(created.id);
    const inactive = await repo.findByEmail(email);
    expect(inactive).toBeNull();
    const stillExists = await repo.findById(created.id);
    expect(stillExists?.isActive).toBe(false);
  });

  it('withTransaction でロールバックする', async () => {
    const email = uniqueEmail('user-tx');
    const passwordHash = await hashPassword('password123');

    await expect(
      repo.withTransaction(async (txRepo) => {
        await txRepo.create({ email, passwordHash, name: 'TX' });
        throw new Error('rollback');
      }),
    ).rejects.toThrow('rollback');

    const found = await repo.findByEmail(email);
    expect(found).toBeNull();
  });
});