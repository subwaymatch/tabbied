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
      page.getByRole('heading', { name: 'Pick a design' })
    ).toBeVisible();
  });

  test('artworks gallery links into an artwork editor', async ({
    page,
  }) => {
    await page.goto('/artworks');

    await page.getByRole('heading', { name: 'Radius' }).click();

    await page.waitForURL(/\/artworks\/radius/, { timeout: 15000 });
    await expect(
      page.getByRole('link', { name: 'Gallery' })
    ).toBeVisible({ timeout: 15000 });
  });

  test('gallery pagination is reflected in the URL and survives reload', async ({
    page,
  }) => {
    await page.goto('/artworks');

    // Jump to page 2 — the URL gains ?page=2 and the grid shows a new design.
    const firstCard = page.locator('main a[href^="/artworks/"] h3').first();
    const beforeName = await firstCard.textContent();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await expect(page).toHaveURL(/[?&]page=2/);
    await expect(firstCard).not.toHaveText(beforeName ?? '');
    const page2Name = await firstCard.textContent();

    // A reload lands directly on page 2 (the URL is the source of truth).
    await page.reload();
    await expect(page).toHaveURL(/[?&]page=2/);
    await expect(firstCard).toHaveText(page2Name ?? '');

    // Back returns to page 1 (the page param is dropped).
    await page.goBack();
    await expect(page).toHaveURL(/\/artworks\/?$/);
    await expect(firstCard).toHaveText(beforeName ?? '');
  });

  test('"Back to gallery" returns to the previous scroll position', async ({
    page,
  }) => {
    await page.goto('/artworks');
    // Wait for hydration (a live thumbnail mounts) so the gallery's scroll
    // listener is attached before we scroll.
    await page
      .locator('main css-doodle')
      .first()
      .waitFor({ state: 'attached', timeout: 15000 });

    // The gallery is paginated, so scroll as far as this page allows.
    const maxScroll = await page.evaluate(() => {
      const el = document.scrollingElement!;
      const max = el.scrollHeight - window.innerHeight;
      window.scrollTo(0, max);
      return max;
    });
    test.skip(maxScroll < 40, 'gallery too short to scroll on this viewport');

    // The gallery persists its scroll position so it can be restored on return.
    await expect
      .poll(() =>
        page.evaluate(() =>
          Number(sessionStorage.getItem('tabbied:gallery-scroll-y'))
        )
      )
      .toBeGreaterThan(20);
    const before = await page.evaluate(() => window.scrollY);

    // Open a card fully in view, so Playwright does not auto-scroll to click it.
    const href = await page.evaluate(() => {
      const inView = [
        ...document.querySelectorAll('main a[href^="/artworks/"]'),
      ].find((el) => {
        const r = el.getBoundingClientRect();
        return r.top > 60 && r.bottom < window.innerHeight - 60;
      });
      return inView?.getAttribute('href') ?? null;
    });
    expect(href, 'expected a gallery card link within the viewport').not.toBeNull();
    await page.locator(`main a[href="${href}"]`).click();

    await page.getByRole('link', { name: 'Gallery' }).click();
    await expect(page).toHaveURL(/\/artworks\/?$/);

    // The gallery is restored to (approximately) where it was left.
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(before - 80);
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
      page.getByRole('button', { name: 'Shuffle', exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Export' })
    ).toBeVisible();

    // Option controls coming from the artwork definition (the grid select is
    // presented as "Grid density" in the redesigned inspector).
    await expect(page.getByText('Grid density')).toBeVisible();
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
    // Aspect ratios are icon tiles named by their id.
    await page.getByRole('button', { name: '1:1' }).click();

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
    await page.getByRole('button', { name: '2:1' }).click();

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
    // only the remove button starts enabled. (Each color slot is a native
    // <input type="color"> swatch — background plus inks — so count those.)
    await expect(page.locator('input[type="color"]')).toHaveCount(6, {
      timeout: 15000,
    });
    const addButton = page.getByRole('button', { name: 'Add color' });
    const removeButton = page.getByRole('button', { name: 'Remove color' });
    await expect(addButton).toBeDisabled();

    // Removing a color drops a swatch and the URL carries one fewer palette
    // param (the param count doubles as the color count on shared links).
    await removeButton.click();
    await expect(page.locator('input[type="color"]')).toHaveCount(5);
    await expect
      .poll(() => new URL(page.url()).searchParams.getAll('palette').length)
      .toBe(5);
    await expect(addButton).toBeEnabled();

    // Re-adding restores the slot.
    await addButton.click();
    await expect(page.locator('input[type="color"]')).toHaveCount(6);
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
    // matching grid density option must already be selected (aria-pressed).
    await expect(page.getByText('9x9', { exact: true })).toBeVisible();
    const pressed = page.getByRole('button', {
      name: '9x9',
      exact: true,
      pressed: true,
    });
    await expect(pressed).toHaveCount(1);
  });
});

test.describe('Tabbied site (mobile viewport)', () => {
  test.use({ viewport: { width: 390, height: 664 } });

  test('icon-only header buttons keep accessible names', async ({ page }) => {
    await page.goto('/artworks/radius?seed=0000');

    // Below the md breakpoint the text labels are display:none, leaving
    // icon-only buttons — they must still expose an accessible name. The
    // Shuffle split button defaults to "Shuffle" (reseeds + recolors).
    await expect(
      page.getByRole('button', { name: 'Shuffle', exact: true })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();

    await page.getByRole('button', { name: 'Shuffle', exact: true }).click();
    await expect(page).not.toHaveURL(/seed=0000/);
  });

  test('hamburger drawer exposes the nav and GitHub on mobile', async ({
    page,
  }) => {
    await page.goto('/');

    // The inline nav is display:none below 992px, so the hamburger drawer is the
    // only way to reach the site navigation (and GitHub) here.
    const trigger = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(trigger).toBeVisible();

    await trigger.click();

    const drawer = page.getByRole('dialog');
    await expect(
      drawer.getByRole('link', { name: 'Browse Artworks' })
    ).toBeVisible();
    // GitHub moves from the header into the drawer on mobile.
    await expect(drawer.getByRole('link', { name: 'GitHub' })).toBeVisible();

    // Choosing a destination navigates and closes the drawer.
    await drawer.getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/\/docs\/react/);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

test.describe('Shared site header', () => {
  test('is reused on content pages and marks the active nav item', async ({
    page,
  }) => {
    // The gallery (/artworks) now owns its own rail chrome, so the shared
    // header is exercised on the docs page instead.
    await page.goto('/docs/react');

    // The home-page header (logo nav + GitHub link) is reused here.
    await expect(
      page.getByRole('link', { name: 'Tabbied on GitHub' })
    ).toBeVisible();

    // At desktop widths the inline nav replaces the hamburger entirely.
    await expect(
      page.getByRole('button', { name: 'Open navigation menu' })
    ).toBeHidden();

    // "Docs" is the current section, "Browse Artworks" is not. The active item
    // is both flagged for assistive tech and given a style hook.
    const docs = page.getByRole('link', { name: 'Docs' });
    await expect(docs).toHaveAttribute('aria-current', 'page');
    await expect(docs).toHaveClass(/active/);
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

  test('the gallery rail owns its chrome instead of the shared header', async ({
    page,
  }) => {
    await page.goto('/artworks');

    // The rail carries the logo, a GitHub link and Docs — but not the shared
    // site nav or its hamburger.
    await expect(
      page.getByRole('link', { name: 'Tabbied on GitHub' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Open navigation menu' })
    ).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Browse Artworks' })
    ).toHaveCount(0);
  });

  test('is not used on the individual artwork editor', async ({ page }) => {
    await page.goto('/artworks/radius');

    // The editor keeps its own header...
    await expect(
      page.getByRole('link', { name: 'Gallery' })
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
