// The workspace: a site's latest revision, on its template.
//
// Same seam as e2e/studio-preview.spec.ts, one document up: the route fetches
// a stored *revision* rather than deriving three strings from a direction, and
// what has to hold is that a full document - every text slot - lands on the
// packaged page and the page says what it knows about the document's state.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.join(__dirname, '..');
const SLUG = 'verdant';

const REQUIRED = [
  path.join(REPO_ROOT, 'out', 'studio', 'site', 'index.html'),
  path.join(REPO_ROOT, 'out', 'downloads', SLUG, 'index.html'),
  path.join(REPO_ROOT, 'out', 'studio', 'preview-runtime.js'),
  path.join(REPO_ROOT, 'out', 'editable', `${SLUG}.json`),
];

const siteDocument = (overrides: Record<string, unknown> = {}) => ({
  id: 'e2esite',
  mine: false,
  slug: SLUG,
  templateName: 'Verdant',
  title: 'Ye Joo Park',
  stance: 'Warmly Grounded',
  palette: ['#F7F4EF', '#7A3B1F', '#C98B5E', '#2E2018'],
  revisions: 1,
  createdAt: '2026-09-02T00:00:00Z',
  updatedAt: '2026-09-02T00:00:00Z',
  generationId: 'e2egen',
  directionIndex: 0,
  description: 'A realtor in Champaign, IL.',
  specVersion: 1,
  templateChanged: false,
  latest: {
    n: 1,
    source: 'ai',
    model: 'test',
    instruction: null,
    createdAt: '2026-09-02T00:00:00Z',
    edits: {
      specVersion: 1,
      slug: SLUG,
      edits: {
        text: {
          'brand.name': 'Ye Joo Park',
          'hero.title': 'Property, {em}made personal{/em}.',
          'hero.lede': 'Residential, commercial, and property management.',
          // Below the masthead - what the three-string preview cannot reach.
          'nav.0': 'Buy',
          'cta.primary': 'Book a valuation',
        },
        palette: ['#F7F4EF', '#7A3B1F', '#C98B5E', '#2E2018'],
      },
    },
  },
  ...overrides,
});

test.describe('studio site', () => {
  test.skip(
    REQUIRED.some((file) => !fs.existsSync(file)),
    'run `npm run build` first - needs the exported route, the packaged template and the preview runtime'
  );

  test('renders the latest revision, masthead and below', async ({ page }) => {
    await page.route('**/api/studio/sites/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(siteDocument()) })
    );

    await page.goto('/studio/site/?id=e2esite');

    const frame = page.frameLocator('iframe');
    await expect(frame.locator('[data-edit="brand.name"]').first()).toHaveText('Ye Joo Park', {
      timeout: 15_000,
    });
    await expect(frame.locator('[data-edit="hero.title"]')).toHaveText('Property, made personal.');
    await expect(frame.locator('[data-edit="hero.title"] em')).toHaveText('made personal');
    await expect(frame.locator('[data-edit="cta.primary"]').first()).toHaveText('Book a valuation');
    await expect(frame.locator('[data-edit="nav.0"]').first()).toHaveText('Buy');

    await expect(page.getByRole('heading', { level: 1, name: 'Ye Joo Park' })).toBeVisible();
    await expect(page.getByText('revision 1')).toBeVisible();
    await expect(page.getByRole('status')).toHaveCount(0);
  });

  test('says when the document is only the brand copy, and when the template moved', async ({
    page,
  }) => {
    await page.route('**/api/studio/sites/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          siteDocument({
            templateChanged: true,
            latest: { ...siteDocument().latest, source: 'fallback' },
          })
        ),
      })
    );

    await page.goto('/studio/site/?id=e2esite');

    await expect(page.getByText('only the brand name, headline and tagline')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText('has been updated since this site was made')).toBeVisible();
  });

  test('the owner gets the editor, and typing reaches the page live', async ({ page }) => {
    await page.route('**/api/studio/sites/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(siteDocument({ mine: true })),
      })
    );
    // Registered after, so it is tried first: the history the chat panel lists.
    await page.route('**/api/studio/sites/e2esite/revisions', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          revisions: [
            { n: 2, source: 'ai', instruction: 'Warmer headline', createdAt: '2026-09-02T01:00:00Z' },
            { n: 1, source: 'ai', instruction: null, createdAt: '2026-09-02T00:00:00Z' },
          ],
        }),
      })
    );

    await page.goto('/studio/site/?id=e2esite');

    const frame = page.frameLocator('iframe');
    await expect(frame.locator('[data-edit="brand.name"]').first()).toHaveText('Ye Joo Park', {
      timeout: 15_000,
    });

    const editor = page.getByRole('complementary', { name: 'Edit this site' });
    await expect(editor).toBeVisible();

    // The brand-name field is prefilled from the document, and a keystroke
    // lands on every element sharing the id before anything is saved.
    const field = editor.getByLabel(/^Name/).first();
    await expect(field).toHaveValue('Ye Joo Park');
    await field.fill('Park & Co.');

    const names = frame.locator('[data-edit="brand.name"]');
    await expect(names).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      await expect(names.nth(i)).toHaveText('Park & Co.');
    }

    await expect(editor.getByRole('button', { name: 'Save as a new revision' })).toBeEnabled();

    // The chat panel and the history beside it, current head marked.
    const chat = page.getByRole('region', { name: 'Ask for changes' });
    await expect(chat.getByText('Warmer headline')).toBeVisible();
    await expect(chat.getByText('First draft')).toBeVisible();
    await expect(chat.getByRole('button', { name: 'Restore' })).toHaveCount(1);
  });

  test('a visitor by link gets the page and no editor', async ({ page }) => {
    await page.route('**/api/studio/sites/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(siteDocument()) })
    );

    await page.goto('/studio/site/?id=e2esite');

    await expect(page.frameLocator('iframe').locator('[data-edit="brand.name"]').first()).toHaveText(
      'Ye Joo Park',
      { timeout: 15_000 }
    );
    await expect(page.getByRole('complementary', { name: 'Edit this site' })).toHaveCount(0);
  });

  test('404 reads as a missing site, with a way back', async ({ page }) => {
    await page.route('**/api/studio/sites/**', (route) =>
      route.fulfill({ status: 404, contentType: 'application/json', body: '{"error":"Not found"}' })
    );

    await page.goto('/studio/site/?id=nope');

    await expect(page.getByText('does not exist or was removed')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Your sites', exact: true })).toBeVisible();
  });
});
