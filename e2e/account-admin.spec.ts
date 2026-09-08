// The account area and the admin tier, rendered against a stubbed session.
//
// Sessions come from /api/auth/get-session, which the export has no Worker
// behind here, so each test answers it itself: no session, a member's, an
// admin's. What is under test is the pages' own logic - who sees the nav,
// who sees "Not found", that the data lands in the tables - not better-auth.
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.join(__dirname, '..');
const REQUIRED = ['account/sites', 'account/usage', 'admin', 'admin/users'].map((route) =>
  path.join(REPO_ROOT, 'out', route, 'index.html')
);

const session = (role: string | null) => ({
  session: { id: 's', userId: 'u1', expiresAt: '2030-01-01T00:00:00Z' },
  user: { id: 'u1', name: 'Pat', email: 'pat@example.com', emailVerified: true, role },
});

const stubSession = (page: Page, role: string | null | 'none') =>
  page.route('**/api/auth/get-session', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: role === 'none' ? 'null' : JSON.stringify(session(role)) })
  );

test.describe('account and admin pages', () => {
  test.skip(REQUIRED.some((file) => !fs.existsSync(file)), 'run `npm run build` first');

  // The layout links typekit and Google Fonts; with no outbound network those
  // requests hang until a proxy resets them and `load` waits on stylesheets.
  // Nothing under test needs the fonts, so they are refused outright.
  test.beforeEach(async ({ page }) => {
    await page.route(/https:\/\/(use\.typekit\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)\//, (route) => route.abort());
  });

  test('signed out, the account area asks you to sign in', async ({ page }) => {
    await stubSession(page, 'none');
    await page.goto('/account/sites/');
    // The heading uses a typographic apostrophe; match the words.
    await expect(page.getByRole('heading', { name: /signed out/ })).toBeVisible();
  });

  test('a member sees their sites and usage', async ({ page }) => {
    await stubSession(page, null);
    await page.route('**/api/studio/sites', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sites: [{ id: 'abc', slug: 'verdant', templateName: 'Verdant', title: 'Ye Joo Park', stance: 'Warmly Grounded', palette: ['#fff', '#000'], revisions: 3, createdAt: '2026-09-01T00:00:00Z', updatedAt: '2026-09-02T00:00:00Z' }],
        }),
      })
    );
    await page.route('**/api/account/usage', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ resetsAt: '2026-09-03T00:00:00Z', usage: [{ endpoint: 'site', label: 'sites', used: 2, cap: 10 }], recent: [] }),
      })
    );

    await page.goto('/account/sites/');
    await expect(page.getByRole('navigation', { name: 'Account' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Ye Joo Park/ })).toHaveAttribute('href', '/studio/site/?id=abc');
    await expect(page.getByText('3 revisions')).toBeVisible();

    await page.goto('/account/usage/');
    await expect(page.getByText('2 / 10 today')).toBeVisible();
  });

  test('the admin tier is "Not found" to a member and a dashboard to an admin', async ({ page }) => {
    await stubSession(page, null);
    await page.goto('/admin/');
    await expect(page.getByRole('heading', { name: 'Not found' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Admin' })).toHaveCount(0);

    await stubSession(page, 'admin');
    await page.route('**/api/admin/overview', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ users: 42, newUsersThisWeek: 5, generationsThisWeek: 17, sitesThisWeek: 6, fallbackRate: 0.12, aiCallsToday: 9, aiCostToday: 0.734, imagesThisWeek: 3 }),
      })
    );
    await page.route('**/api/admin/users?*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ users: [{ id: 'u2', name: 'Sam', email: 'sam@example.com', emailVerified: true, role: null, banned: false, createdAt: '2026-09-01T00:00:00Z', sites: 1, generations: 2 }] }),
      })
    );

    await page.goto('/admin/');
    await expect(page.getByRole('navigation', { name: 'Admin' })).toBeVisible();
    await expect(page.getByText('42')).toBeVisible();
    await expect(page.getByText('12%')).toBeVisible();

    await page.goto('/admin/users/');
    await expect(page.getByRole('link', { name: 'sam@example.com' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Make admin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ban' })).toBeVisible();
  });
});
