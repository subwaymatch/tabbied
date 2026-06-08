import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration used to verify the production build of the site.
 * The web server runs `next start`, so make sure `next build` has run first
 * (the `webServer.command` below also builds to be safe when run standalone).
 */
export default defineConfig({
  testDir: './e2e',
  // The pages do heavy client-side css-doodle rendering against a single
  // server, so run serially to avoid flakiness from resource contention.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'yarn start',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
