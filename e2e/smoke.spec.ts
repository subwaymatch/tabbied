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

    // Regression guard for the Bootstrap 4 -> 5 `media-breakpoint-down()`
    // semantics change: the xs/mobile overrides must not leak onto desktop
    // widths (which had collapsed the hero padding from ~160px to 64px).
    const heroPadTop = await page.evaluate(() => {
      const p = [...document.querySelectorAll('p')].find((e) =>
        /^Doodle with/.test((e.textContent || '').trim())
      );
      return p ? parseInt(getComputedStyle(p.parentElement).paddingTop, 10) : 0;
    });
    expect(heroPadTop).toBeGreaterThan(100);

    // "Make your art" appears in the hero and the closing CTA.
    await page.getByRole('link', { name: 'Make your art' }).first().click();

    await expect(page).toHaveURL(/\/artworks/);
    await expect(
      page.getByText('First, pick a pre-made design from our gallery.')
    ).toBeVisible();
  });

  test('artworks gallery links into an artwork editor', async ({
    page,
  }) => {
    await page.goto('/artworks');

    await page.getByRole('heading', { name: 'Radius' }).click();

    await page.waitForURL(/\/artworks\/radius/, { timeout: 15000 });
    await expect(
      page.getByRole('link', { name: '← Back to gallery' })
    ).toBeVisible({ timeout: 15000 });
  });

  test('artworks gallery renders live css-doodle thumbnails', async ({
    page,
  }) => {
    await page.goto('/artworks');

    // The raster <img> thumbnails were replaced by per-design css-doodle
    // rendered through the tabbied package's <TabbiedArtwork fit="cover">, so
    // a thumbnail element must mount and actually paint cells (guards against
    // the client mount boundary / source-building / the package's css-doodle
    // registration side effect regressing to an empty grid).
    await page.waitForFunction(() => !!window.customElements.get('css-doodle'));
    await expect(
      page.locator('[data-artwork="radius"] css-doodle')
    ).toBeAttached({
      timeout: 15000,
    });

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const el = document.querySelector(
              '[data-artwork="radius"] css-doodle'
            );
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

  test('artwork editor renders the css-doodle and controls', async ({
    page,
  }) => {
    await page.goto('/artworks/radius');

    // The css-doodle web component must register and mount on the client.
    await page.waitForFunction(() => !!window.customElements.get('css-doodle'));
    await expect(
      page.locator('[data-artwork="radius"] css-doodle')
    ).toBeAttached();

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
            const el = document.querySelector(
              '[data-artwork="radius"] css-doodle'
            );
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
    await page.goto('/artworks/radius?seed=0000');

    // Wait until state has been written back into the URL.
    await expect(page).toHaveURL(/grid=6x9/);

    await page.getByText('4x6', { exact: true }).click();

    await expect(page).toHaveURL(/grid=4x6/);
  });

  test('changing the aspect ratio remaps the grid to keep square cells', async ({
    page,
  }) => {
    await page.goto('/artworks/radius?seed=0000');

    // Default portrait ratio reproduces the original 2:3 grid options.
    await expect(page).toHaveURL(/aspectRatio=2%3A3/);
    await expect(page).toHaveURL(/grid=6x9/);

    // Switch to a square canvas: the 6x9 (level 2) grid re-derives to 9x9.
    await page.getByText('1:1', { exact: true }).click();

    await expect(page).toHaveURL(/aspectRatio=1%3A1/);
    await expect(page).toHaveURL(/grid=9x9/);
    await expect(page.getByText('9x9', { exact: true })).toBeVisible();
  });

  test('symmetry offers aspect ratios and follows the selection', async ({
    page,
  }) => {
    await page.goto('/artworks/symmetry?seed=0000');

    await expect(
      page.locator('[data-artwork="symmetry"] css-doodle')
    ).toBeAttached();
    // Symmetry is no longer ratio-locked: it letterboxes its composition into
    // a centered 2:3 box, so the selector is offered like everywhere else.
    await expect(page.getByText('Aspect ratio')).toBeVisible();
    await page.getByText('2:1', { exact: true }).click();

    await expect(page).toHaveURL(/aspectRatio=2%3A1/);

    // The canvas follows the landscape ratio.
    const box = await page
      .locator('[data-artwork="symmetry"] css-doodle')
      .boundingBox();
    expect(box!.width).toBeGreaterThan(box!.height);
  });

  test('palette colors can be removed and re-added within the artwork bounds', async ({
    page,
  }) => {
    await page.goto('/artworks/radius?seed=0000');

    // Radius opens at its default of 6 colors, which is also its maximum, so
    // only the remove button starts enabled. (Pickr replaces each swatch
    // element with a .pcr-button, so count those.)
    await expect(page.locator('.pcr-button')).toHaveCount(6, {
      timeout: 15000,
    });
    const addButton = page.getByRole('button', { name: 'Add color' });
    const removeButton = page.getByRole('button', { name: 'Remove color' });
    await expect(addButton).toBeDisabled();

    // Removing a color drops a swatch and the URL carries one fewer palette
    // param (the param count doubles as the color count on shared links).
    await removeButton.click();
    await expect(page.locator('.pcr-button')).toHaveCount(5);
    await expect
      .poll(() => new URL(page.url()).searchParams.getAll('palette').length)
      .toBe(5);
    await expect(addButton).toBeEnabled();

    // Re-adding restores the slot.
    await addButton.click();
    await expect(page.locator('.pcr-button')).toHaveCount(6);
    await expect(addButton).toBeDisabled();
  });

  test('slider controls display their current value', async ({ page }) => {
    await page.goto('/artworks/radius?seed=0000');

    // Radius opens at frequency 1, shown as "1.0" beside the slider.
    await expect(page.getByText('Frequency')).toBeVisible();
    await expect(page.getByText('1.0', { exact: true })).toBeVisible();
  });

  test('homepage gallery cards link with a seed so edits sync to the URL', async ({
    page,
  }) => {
    await page.goto('/');

    // Without a query param on the link, the editor never mirrors state into
    // the URL, so customizations made after entering from the homepage would
    // not survive a refresh or be shareable.
    await page
      .locator('#section-browse-artwork a[href*="/artworks/radius"]')
      .click();

    // The static export uses trailing slashes, so match /artworks/radius/?seed=…
    await page.waitForURL(/\/artworks\/radius\/?\?/, { timeout: 15000 });
    await expect(page).toHaveURL(/seed=0000/);

    await page.getByText('6x9', { exact: true }).click();
    await expect(page).toHaveURL(/grid=6x9/);
  });

  test('editor opens directly in the state described by a shared URL', async ({
    page,
  }) => {
    await page.goto('/artworks/radius?seed=ZZZZ&grid=9x9&aspectRatio=1%3A1');

    // Initial state comes from the URL (not corrected after mount), so the
    // matching grid option must already be selected.
    await expect(page.getByText('9x9', { exact: true })).toBeVisible();
    const pressed = page.locator('[data-pressed]', { hasText: '9x9' });
    await expect(pressed).toHaveCount(1);
  });
});

test.describe('Tabbied site (mobile viewport)', () => {
  test.use({ viewport: { width: 390, height: 664 } });

  test('icon-only header buttons keep accessible names', async ({ page }) => {
    await page.goto('/artworks/radius?seed=0000');

    // Below the md breakpoint the text labels are display:none, leaving
    // icon-only buttons — they must still expose an accessible name.
    await expect(page.getByRole('button', { name: 'Redraw' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();

    await page.getByRole('button', { name: 'Redraw' }).click();
    await expect(page).not.toHaveURL(/seed=0000/);
  });
});

test.describe('Shared site header', () => {
  test('is reused on content pages and marks the active nav item', async ({
    page,
  }) => {
    await page.goto('/artworks');

    // The home-page header (logo nav + GitHub link) is reused here.
    await expect(
      page.getByRole('link', { name: 'Tabbied on GitHub' })
    ).toBeVisible();

    // "Browse Artworks" is the current section, "React Component" is not. The
    // active item is both flagged for assistive tech and given a style hook.
    const browse = page.getByRole('link', { name: 'Browse Artworks' });
    await expect(browse).toHaveAttribute('aria-current', 'page');
    await expect(browse).toHaveClass(/active/);
    await expect(
      page.getByRole('link', { name: 'React Component' })
    ).not.toHaveAttribute('aria-current', 'page');

    // Navigating moves the active state onto the matching item.
    await page.goto('/docs/react');
    await expect(
      page.getByRole('link', { name: 'React Component' })
    ).toHaveAttribute('aria-current', 'page');
    await expect(
      page.getByRole('link', { name: 'Browse Artworks' })
    ).not.toHaveAttribute('aria-current', 'page');

    // A page with no matching nav item highlights nothing.
    await page.goto('/privacy-policy');
    await expect(
      page.getByRole('link', { name: 'Browse Artworks' })
    ).toBeVisible();
    await expect(page.locator('header a[aria-current="page"]')).toHaveCount(0);
  });

  test('is not used on the individual artwork editor', async ({ page }) => {
    await page.goto('/artworks/radius');

    // The editor keeps its own header...
    await expect(
      page.getByRole('link', { name: '← Back to gallery' })
    ).toBeVisible({ timeout: 15000 });

    // ...and never renders the shared site nav.
    await expect(
      page.getByRole('link', { name: 'Browse Artworks' })
    ).toHaveCount(0);
  });
});

test.describe('React component docs page', () => {
  test('documents the component with live examples', async ({ page }) => {
    await page.goto('/docs/react');

    await expect(page.getByText('npm install tabbied')).toBeVisible();

    // The examples render real artworks through the package component, so the
    // custom element must register and a doodle mount.
    await page.waitForFunction(() => !!window.customElements.get('css-doodle'));
    await expect(
      page.locator('[data-artwork="radius"] css-doodle').first()
    ).toBeAttached({ timeout: 15000 });
  });
});
