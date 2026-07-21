import { describe, it, expect, afterAll } from 'vitest';
import { closeDb } from '@ai-harness/infrastructure';
import { buildServer } from '../server.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);
const describeIfDb = hasDatabase ? describe : describe.skip;

describe('POST /api/auth/login', () => {
  it('バリデーションエラーで 400 を返す', async () => {
    const app = await buildServer();
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'invalid', password: '123' },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ error: 'VALIDATION_ERROR' });
    await app.close();
  });
});

describe('POST /api/auth/logout', () => {
  it('Authorization ヘッダーなしで 401', async () => {
    const app = await buildServer();
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({
      error: 'UNAUTHORIZED',
      message: '認証が必要です',
    });
    await app.close();
  });

  it('無効なトークンで 401', async () => {
    const app = await buildServer();
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: { authorization: 'Bearer invalid-token' },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toMatchObject({ error: 'UNAUTHORIZED' });
    await app.close();
  });
});

describeIfDb('POST /api/auth (integration)', () => {
  afterAll(async () => {
    await closeDb();
  });

  it('seed ユーザーでログイン成功', async () => {
    const app = await buildServer();
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.user.email).toBe('test@example.com');
    expect(body.user.name).toBe('テストユーザー');
    expect(body.token).toBeTruthy();
    await app.close();
  });

  it('誤ったパスワードで 401 と統一メッセージ', async () => {
    const app = await buildServer();
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'wrong-password',
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({
      error: 'INVALID_CREDENTIALS',
      message: 'メールアドレスまたはパスワードが正しくありません',
    });
    await app.close();
  });

  it('ログイン後にログアウト成功', async () => {
    const app = await buildServer();
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'password123',
      },
    });
    const { token } = loginRes.json();

    const logoutRes = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.json()).toEqual({ message: 'ログアウトしました' });
    await app.close();
  });
});