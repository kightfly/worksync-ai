import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { eq } from 'drizzle-orm';
import { closeDb } from '../db/client.js';
import { tasks, users } from '../db/schema.js';
import { TaskRepository } from './task.repository.js';
import { UserRepository } from './user.repository.js';
import type { DbClient } from './types.js';
import { getTestDb, hasDatabase, hashPassword, uniqueEmail } from './test-helpers.js';

const describeIfDb = hasDatabase ? describe : describe.skip;

describeIfDb('TaskRepository (integration)', () => {
  let db: DbClient;
  let userRepo: UserRepository;
  let taskRepo: TaskRepository;
  let userId = '';
  const taskIds: string[] = [];

  beforeAll(() => {
    db = getTestDb();
    userRepo = new UserRepository(db);
    taskRepo = new TaskRepository(db);
  });

  afterAll(async () => {
    for (const id of taskIds) {
      await db.delete(tasks).where(eq(tasks.id, id));
    }
    if (userId) {
      await db.delete(users).where(eq(users.id, userId));
    }
    await closeDb();
  });

  it('CRUD と状態フィルタ', async () => {
    const user = await userRepo.create({
      email: uniqueEmail('task-repo'),
      passwordHash: await hashPassword('password123'),
      name: 'タスクユーザー',
    });
    userId = user.id;

    const todo = await taskRepo.create({
      userId,
      title: 'TODO タスク',
      status: 'todo',
    });
    const inProgress = await taskRepo.create({
      userId,
      title: '進行中タスク',
      status: 'in_progress',
    });
    taskIds.push(todo.id, inProgress.id);

    const all = await taskRepo.findByUserId(userId);
    expect(all.length).toBeGreaterThanOrEqual(2);

    const filtered = await taskRepo.findByUserId(userId, { status: 'todo' });
    expect(filtered.every((task) => task.status === 'todo')).toBe(true);

    const found = await taskRepo.findById(todo.id, userId);
    expect(found?.title).toBe('TODO タスク');

    const updated = await taskRepo.update(todo.id, userId, {
      title: '更新タイトル',
      status: 'in_progress',
    });
    expect(updated.title).toBe('更新タイトル');
    expect(updated.status).toBe('in_progress');

    await taskRepo.delete(inProgress.id, userId);
    const deleted = await taskRepo.findById(inProgress.id, userId);
    expect(deleted).toBeNull();
    taskIds.splice(taskIds.indexOf(inProgress.id), 1);
  });
});