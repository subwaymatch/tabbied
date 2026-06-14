import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration used to verify the production build of the site.
 * The site is a static export, so the web server serves the `out/` directory
 * (`npm start` → `serve out`) — make sure `next build` has run first.
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
    command: 'npm start',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
