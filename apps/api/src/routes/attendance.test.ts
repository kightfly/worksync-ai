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

describe('GET /api/attendance', () => {
  it('未認証で 401', async () => {
    const app = await buildServer();
    const res = await app.inject({ method: 'GET', url: '/api/attendance' });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it('クエリ不正で 400', async () => {
    const app = await buildServer();
    const token = await loginToken(app);
    const res = await app.inject({
      method: 'GET',
      url: '/api/attendance?startDate=2025-01-01',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('VALIDATION_ERROR');
    await app.close();
  });
});

describeIfDb('Attendance API (integration)', () => {
  afterAll(async () => {
    await closeDb();
  });

  it('C401: 一覧を Tokyo 時刻で返す', async () => {
    const app = await buildServer();
    const token = await loginToken(app);

    const res = await app.inject({
      method: 'GET',
      url: '/api/attendance?startDate=2025-01-15&endDate=2025-01-16',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.records.length).toBeGreaterThan(0);
    expect(body.records[0]?.checkInTime).toMatch(/\+09:00$/);
    expect(body.records[0]).toHaveProperty('workDate');
    await app.close();
  });

  it('C402: 日次集計と期間合計を返す', async () => {
    const app = await buildServer();
    const token = await loginToken(app);

    const res = await app.inject({
      method: 'GET',
      url: '/api/attendance/statistics?startDate=2025-01-15&endDate=2025-01-16',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.dailyStats).toHaveLength(2);
    expect(body.dailyStats[0]).toMatchObject({
      date: '2025-01-15',
    });
    expect(body.totalHours).toBeCloseTo(21.5, 1);
    await app.close();
  });
});
