import { describe, it, expect } from 'vitest';
import { buildServer } from './server';

describe('API health', () => {
  it('GET /health 返回 ok', async () => {
    const app = await buildServer();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
    await app.close();
  });
});
