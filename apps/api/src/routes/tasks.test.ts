import { describe, it, expect, afterAll } from 'vitest';
import { closeDb } from '@ai-harness/infrastructure';
import { buildServer } from '../server.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);
const describeIfDb = hasDatabase ? describe : describe.skip;

async function loginToken(app: Awaited<ReturnType<typeof buildServer>>) {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: 'test@example.com',
      password: 'password123',
    },
  });
  return res.json().token as string;
}

describe('GET /api/tasks', () => {
  it('未認証で 401', async () => {
    const app = await buildServer();
    const res = await app.inject({ method: 'GET', url: '/api/tasks' });
    expect(res.statusCode).toBe(401);
    await app.close();
  });
});

describeIfDb('Task API (integration)', () => {
  afterAll(async () => {
    await closeDb();
  });

  it('C301/C302: 作成と一覧取得', async () => {
    const app = await buildServer();
    const token = await loginToken(app);
    const title = `APIテスト-${Date.now()}`;

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title,
        description: '説明',
        dueDate: '2025-03-01',
      },
    });

    expect(createRes.statusCode).toBe(201);
    const created = createRes.json();
    expect(created.title).toBe(title);
    expect(created.status).toBe('todo');

    const listRes = await app.inject({
      method: 'GET',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(listRes.statusCode).toBe(200);
    const tasks = listRes.json().tasks;
    expect(tasks.some((task: { title: string }) => task.title === title)).toBe(
      true,
    );

    await app.close();
  });

  it('C303: 状態更新とタイトル更新', async () => {
    const app = await buildServer();
    const token = await loginToken(app);

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: `更新テスト-${Date.now()}` },
    });
    const { id } = createRes.json();

    const patchRes = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: 'in_progress' },
    });
    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.json().status).toBe('in_progress');

    const doneRes = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: 'done' },
    });
    expect(doneRes.statusCode).toBe(200);
    expect(doneRes.json().status).toBe('done');

    await app.close();
  });

  it('C303: 非法状態遷移で 400', async () => {
    const app = await buildServer();
    const token = await loginToken(app);

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: `非法遷移-${Date.now()}` },
    });
    const { id } = createRes.json();

    const patchRes = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: 'done' },
    });

    expect(patchRes.statusCode).toBe(400);
    expect(patchRes.json()).toMatchObject({
      error: 'INVALID_STATE_TRANSITION',
      message: '無効な状態遷移です',
    });

    await app.close();
  });

  it('C304: 削除で 204', async () => {
    const app = await buildServer();
    const token = await loginToken(app);

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: `削除テスト-${Date.now()}` },
    });
    const { id } = createRes.json();

    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(deleteRes.statusCode).toBe(204);

    const listRes = await app.inject({
      method: 'GET',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${token}` },
    });
    const tasks = listRes.json().tasks;
    expect(tasks.some((task: { id: string }) => task.id === id)).toBe(false);

    await app.close();
  });

  it('存在しないタスク更新で 404', async () => {
    const app = await buildServer();
    const token = await loginToken(app);

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/tasks/00000000-0000-0000-0000-000000000000',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'x' },
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().error).toBe('NOT_FOUND');
    await app.close();
  });
});