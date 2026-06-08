import { test, expect } from '@playwright/test';

test.describe('Tabbied site', () => {
  test('home page renders hero and navigation works', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Tabbied/);
    // The hero is loaded client-side via dynamic(ssr:false) and pulls in the
    // css-doodle library, so give it a little longer to appear. Match the full
    // hero copy so it is not confused with the footer's marketing blurb.
    await expect(page.getByText(/Doodle with\s+generated patterns/)).toBeVisible(
      { timeout: 15000 }
    );

    // "Make your art" appears in the hero and the closing CTA.
    await page.getByRole('link', { name: 'Make your art' }).first().click();

    await expect(page).toHaveURL(/\/select-artwork/);
    await expect(
      page.getByText('First, pick a pre-made design from our gallery.')
    ).toBeVisible();
  });

  test('select-artwork gallery links into an artwork editor', async ({
    page,
  }) => {
    await page.goto('/select-artwork');

    await page.getByRole('heading', { name: 'Radius' }).click();

    await page.waitForURL(/\/artwork\/radius/, { timeout: 15000 });
    await expect(
      page.getByRole('link', { name: '← Back to gallery' })
    ).toBeVisible({ timeout: 15000 });
  });

  test('artwork editor renders the css-doodle and controls', async ({
    page,
  }) => {
    await page.goto('/artwork/radius');

    // The css-doodle web component must register and mount on the client.
    await page.waitForFunction(() => !!window.customElements.get('css-doodle'));
    await expect(page.locator('css-doodle#radius')).toBeAttached();

    await expect(
      page.getByRole('button', { name: 'Redraw' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Export' })
    ).toBeVisible();

    // Option controls coming from the artwork definition.
    await expect(page.getByText('Columns and rows')).toBeVisible();
    await expect(page.getByText('4x6', { exact: true })).toBeVisible();

    // Regression guard: the generative grid must actually paint its cells.
    // css-doodle >= 0.5 reinterpreted `@random(1)`, which collapsed the
    // default (max-frequency) artwork to a single shape until shimmed.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const el = document.querySelector('css-doodle#radius');
            if (!el || !el.shadowRoot) return 0;
            return [...el.shadowRoot.querySelectorAll('cssd-cell')].filter(
              (cell) => {
                const bg = getComputedStyle(cell).backgroundColor;
                return bg && bg !== 'rgba(0, 0, 0, 0)';
              }
            ).length;
          }),
        { timeout: 10000 }
      )
      .toBeGreaterThan(1);
  });

  test('changing an option syncs to the URL query (next/navigation)', async ({
    page,
  }) => {
    // Seed query param triggers the URL <-> state synchronization.
    await page.goto('/artwork/radius?seed=0000');

    // Wait until state has been written back into the URL.
    await expect(page).toHaveURL(/grid=4x6/);

    await page.getByText('6x9', { exact: true }).click();

    await expect(page).toHaveURL(/grid=6x9/);
  });

  test('export-test page renders', async ({ page }) => {
    await page.goto('/export-test');

    await expect(
      page.getByRole('heading', { name: 'iOS Export Test' })
    ).toBeVisible();
  });
});
