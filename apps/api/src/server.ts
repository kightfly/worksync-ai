import Fastify from 'fastify';

export async function buildServer() {
  const app = Fastify({ logger: false });
  app.get('/health', async () => ({ status: 'ok' }));
  return app;
}
