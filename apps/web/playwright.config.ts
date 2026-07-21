import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT ?? 5173);
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`;
const apiPort = Number(process.env.E2E_API_PORT ?? 3100);
const apiBaseURL = process.env.E2E_API_BASE_URL ?? `http://127.0.0.1:${apiPort}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'cd /d ../.. && set "PORT=' + apiPort + '" && npm run dev -w apps/api',
      url: `${apiBaseURL}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command:
        'set "VITE_API_BASE_URL=' +
        apiBaseURL +
        '" && npm run dev -- --host 127.0.0.1 --port ' +
        port,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
