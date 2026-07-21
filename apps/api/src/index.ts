import { getEnv } from './config/env.js';
import { buildServer } from './server.js';

async function main() {
  const app = await buildServer();
  const { port } = getEnv();
  await app.listen({ port, host: '0.0.0.0' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});