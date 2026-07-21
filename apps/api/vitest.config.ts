import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  resolve: {
    alias: {
      '@ai-harness/infrastructure': path.resolve(root, '../../packages/infrastructure/src/index.ts'),
      '@ai-harness/domain': path.resolve(root, '../../packages/domain/src/index.ts'),
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 30000,
  },
});