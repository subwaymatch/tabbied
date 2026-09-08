import { test, expect } from '@playwright/test';

test.describe('Tabbied site', () => {
  test('home page renders the hero and links into the gallery', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Tabbied/);
    await expect(
      page.getByRole('heading', { level: 1, name: /Free patterns and websites/ })
    ).toBeVisible();

    // Every figure on the page is derived from the catalog at build time
    // (lib/siteCounts), so this asserts the shape rather than the value - a
    // literal typed into the copy is exactly what it is there to prevent.
    const patternsStat = page.getByRole('link', { name: /^\d+ Patterns$/ });
    await expect(patternsStat).toBeVisible();
    const patternCount = Number(
      (await patternsStat.textContent())?.match(/\d+/)?.[0]
    );
    expect(patternCount).toBeGreaterThan(1);

    // The same number has to appear in the hero sentence and on the library
    // section's "View all" link, because all three read the one source.
    await expect(
      page.getByText(
        new RegExp(`growing library of ${patternCount} customizable patterns`)
      )
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: `View all ${patternCount}` })
    ).toBeVisible();

    await page.getByRole('link', { name: 'Make your pattern' }).click();

    await expect(page).toHaveURL(/\/patterns/);
    await expect(
      page.getByRole('heading', { name: 'Pick a design' })
    ).toBeVisible();
  });

  test('the homepage animates only when motion is welcome', async ({
    page,
  }) => {
    // The hero grid, the marquees and the orbiting squares all run on their own
    // clocks; under `prefers-reduced-motion` every one of them has to stop, not
    // merely slow down.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const rail = page.locator('[class*="HomeTemplates-module"][class*="track"]');
    await expect(rail.first()).toHaveCSS('animation-name', 'none');

    const before = await page
      .locator('[class*="HomeHero-module"][class*="skylineCell"]')
      .first()
      .getAttribute('style');
    await page.waitForTimeout(3000);
    const after = await page
      .locator('[class*="HomeHero-module"][class*="skylineCell"]')
      .first()
      .getAttribute('style');

    expect(after).toBe(before);
  });

  test('patterns gallery links into a pattern editor', async ({
    page,
  }) => {
    await page.goto('/patterns');

    await page.getByRole('heading', { name: 'Radius' }).click();

    await page.waitForURL(/\/patterns\/radius/, { timeout: 15000 });
    await expect(
      page.getByRole('link', { name: 'Gallery' })
    ).toBeVisible({ timeout: 15000 });
  });

  test('gallery pagination is reflected in the URL and survives reload', async ({
    page,
  }) => {
    await page.goto('/patterns');

    // Jump to page 2 - the URL gains ?page=2 and the grid shows a new design.
    const firstCard = page.locator('main a[href^="/patterns/"] h3').first();
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
    await expect(page).toHaveURL(/\/patterns\/?$/);
    await expect(firstCard).toHaveText(beforeName ?? '');
  });

  test('the gallery grid reflows when the window narrows', async ({ page }) => {
    // Regression guard: the grid's tracks were a bare `1fr`
    // (= minmax(auto, 1fr)), so `min-width: auto` floored each track at the
    // item's min-content width. Because the cards carry
    // `content-visibility: auto`, a card that had been scrolled past reported
    // the size it last rendered at as that floor - narrowing the window could
    // then no longer shrink the tracks and the grid overflowed its column
    // until a reload. Tracks are minmax(0, 1fr) now; this asserts the grid
    // still fits after a resize, without one.
    await page.setViewportSize({ width: 1640, height: 1000 });
    await page.goto('/patterns');
    await page
      .locator('main css-doodle')
      .first()
      .waitFor({ state: 'attached', timeout: 15000 });

    // Scroll far enough that lower cards render and are then skipped again,
    // which is what seeded the stale minimum.
    await page.mouse.wheel(0, 1600);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -1600);
    await page.waitForTimeout(500);

    // The grid is the div whose direct children are the card links.
    const grid = page
      .locator('main div')
      .filter({ has: page.locator('> a h3') })
      .first();
    await expect(grid).toBeVisible();

    for (const width of [1400, 1200, 1000]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForTimeout(200);
    }

    // No horizontal overflow in the grid, and none on the document either.
    await expect
      .poll(
        () => grid.evaluate((el) => el.scrollWidth - el.clientWidth),
        { timeout: 5000 }
      )
      .toBe(0);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      )
    ).toBe(0);
  });

  test('the gallery sidebar stays fixed while the grid scrolls', async ({
    page,
  }) => {
    await page.goto('/patterns');
    await page
      .locator('main css-doodle')
      .first()
      .waitFor({ state: 'attached', timeout: 15000 });

    // The rail is fixed to the window, so scrolling the grid leaves its pinned
    // "+ New Palette" footer button in place.
    const newPalette = page
      .locator('aside')
      .getByRole('button', { name: /New Palette/ });
    const before = await newPalette.boundingBox();
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForTimeout(300);
    const after = await newPalette.boundingBox();

    expect(Math.abs((after?.y ?? 0) - (before?.y ?? 0))).toBeLessThan(4);
  });

  test('the palette rail shows a scrollable, infinite palette list', async ({
    page,
  }) => {
    await page.goto('/patterns');
    await page
      .locator('main css-doodle')
      .first()
      .waitFor({ state: 'attached', timeout: 15000 });

    // The rail lists every palette from the start (no "Browse all" step): a
    // bounded scroll container that overflows its box (it auto-fills the
    // available height) and loads more rows as it scrolls.
    const findScroller = () =>
      page.evaluate(() => {
        const el = [...document.querySelectorAll('aside *')].find(
          (e) =>
            getComputedStyle(e).overflowY === 'auto' &&
            e.scrollHeight > e.clientHeight + 8
        );
        return el ? (el as HTMLElement).querySelectorAll('button').length : 0;
      });

    const rows0 = await findScroller();
    expect(rows0).toBeGreaterThan(0);

    // Scrolling to the bottom loads more rows (infinite scroll).
    await page.evaluate(() => {
      const el = [...document.querySelectorAll('aside *')].find(
        (e) =>
          getComputedStyle(e).overflowY === 'auto' &&
          e.scrollHeight > e.clientHeight + 8
      );
      if (el) (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight;
    });

    await expect.poll(findScroller).toBeGreaterThan(rows0);
  });

  test('"Back to gallery" returns to the previous scroll position', async ({
    page,
  }) => {
    await page.goto('/patterns');
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
        ...document.querySelectorAll('main a[href^="/patterns/"]'),
      ].find((el) => {
        const r = el.getBoundingClientRect();
        return r.top > 60 && r.bottom < window.innerHeight - 60;
      });
      return inView?.getAttribute('href') ?? null;
    });
    expect(href, 'expected a gallery card link within the viewport').not.toBeNull();
    await page.locator(`main a[href="${href}"]`).click();

    await page.getByRole('link', { name: 'Gallery' }).click();
    await expect(page).toHaveURL(/\/patterns\/?$/);

    // The gallery is restored to (approximately) where it was left.
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(before - 80);
  });

  test('patterns gallery renders live css-doodle thumbnails', async ({
    page,
  }) => {
    await page.goto('/patterns');

    // The raster <img> thumbnails were replaced by per-design css-doodle
    // rendered through the tabbied package's <TabbiedPattern fit="cover">, so
    // a thumbnail element must mount and actually paint cells (guards against
    // the client mount boundary / source-building / the package's css-doodle
    // registration side effect regressing to an empty grid).
    await page.waitForFunction(() => !!window.customElements.get('css-doodle'));
    await expect(
      page.locator('[data-pattern="radius"] css-doodle')
    ).toBeAttached({
      timeout: 15000,
    });

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const el = document.querySelector(
              '[data-pattern="radius"] css-doodle'
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

  test('pattern editor renders the css-doodle and controls', async ({
    page,
  }) => {
    await page.goto('/patterns/radius');

    // The css-doodle web component must register and mount on the client.
    await page.waitForFunction(() => !!window.customElements.get('css-doodle'));
    await expect(
      page.locator('[data-pattern="radius"] css-doodle')
    ).toBeAttached();

    await expect(
      page.getByRole('button', { name: 'Shuffle', exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Export' })
    ).toBeVisible();

    // Option controls coming from the pattern definition (the grid select is
    // presented as "Grid density" in the redesigned inspector).
    await expect(page.getByText('Grid density')).toBeVisible();
    await expect(page.getByText('4x6', { exact: true })).toBeVisible();

    // Regression guard: the generative grid must actually paint its cells.
    // css-doodle >= 0.5 reinterpreted `@random(1)`, which collapsed the
    // default (max-frequency) pattern to a single shape until shimmed.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const el = document.querySelector(
              '[data-pattern="radius"] css-doodle'
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
    await page.goto('/patterns/radius?seed=0000');

    // Wait until state has been written back into the URL.
    await expect(page).toHaveURL(/grid=6x9/);

    await page.getByText('4x6', { exact: true }).click();

    await expect(page).toHaveURL(/grid=4x6/);
  });

  test('changing the aspect ratio remaps the grid to keep square cells', async ({
    page,
  }) => {
    await page.goto('/patterns/radius?seed=0000');

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

  test('palette colors can be removed and re-added within the pattern bounds', async ({
    page,
  }) => {
    await page.goto('/patterns/radius?seed=0000');

    // Radius opens at its default of 6 colors, which is also its maximum, so
    // only the remove button starts enabled. (Each color slot is a native
    // <input type="color"> swatch - background plus inks - so count those.)
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
    await page.goto('/patterns/radius?seed=0000');

    // Radius opens at frequency 1, shown as "1.0" beside the slider.
    await expect(page.getByText('Frequency')).toBeVisible();
    await expect(page.getByText('1.0', { exact: true })).toBeVisible();
  });

  test('gallery cards link with a seed so edits sync to the URL', async ({
    page,
  }) => {
    // This used to enter from the homepage, which carried its own strip of
    // gallery cards; the redesigned homepage sends people to /patterns instead,
    // so the guard belongs on the cards that are actually clicked now.
    await page.goto('/patterns');

    // Without a query param on the link, the editor never mirrors state into
    // the URL, so customizations made after entering from the gallery would
    // not survive a refresh or be shareable.
    await page.locator('a[href*="/patterns/radius"]').first().click();

    // The static export uses trailing slashes, so match /patterns/radius/?seed=...
    await page.waitForURL(/\/patterns\/radius\/?\?/, { timeout: 15000 });
    await expect(page).toHaveURL(/seed=0000/);

    await page.getByText('6x9', { exact: true }).click();
    await expect(page).toHaveURL(/grid=6x9/);
  });

  test('editor opens directly in the state described by a shared URL', async ({
    page,
  }) => {
    await page.goto('/patterns/radius?seed=ZZZZ&grid=9x9&aspectRatio=1%3A1');

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

  test('the editor header opens inline shuffle / export panels (7d)', async ({
    page,
  }) => {
    await page.goto('/patterns/radius?seed=0000');

    // The compact 7d header replaces the split buttons with icon buttons that
    // open inline panels in the editing region (not run the action directly).
    const shuffleBtn = page.getByRole('button', { name: 'Shuffle options' });
    const exportBtn = page.getByRole('button', { name: 'Export options' });
    await expect(shuffleBtn).toBeVisible({ timeout: 15000 });
    await expect(exportBtn).toBeVisible();

    // Opening the shuffle panel reveals the scope radios and a run button; the
    // run button (labelled with the current scope) reseeds the pattern.
    await shuffleBtn.click();
    await expect(
      page.getByRole('radio', { name: 'Shuffle layout' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Shuffle', exact: true }).click();
    await expect(page).not.toHaveURL(/seed=0000/);

    // The back arrow closes the open panel before it would leave the editor.
    await page.getByRole('link', { name: 'Back to editor' }).click();
    await expect(page.getByRole('heading', { name: 'Colors' })).toBeVisible();

    // The export panel lists the three export actions.
    await exportBtn.click();
    await expect(
      page.getByRole('button', { name: 'Copy React component' })
    ).toBeVisible();
  });

  test('the gallery shows palettes as a horizontal chip shelf (7a)', async ({
    page,
  }) => {
    await page.goto('/patterns');

    // The fixed rail is hidden below the two-column breakpoint; the palettes
    // become a horizontal chip shelf with a trailing "All ›" browser pill.
    await expect(page.locator('aside')).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'New Palette' })
    ).toBeVisible({ timeout: 15000 });

    const allPill = page.getByRole('button', { name: /^All/ });
    await expect(allPill).toBeVisible();

    // Tapping "All ›" swaps the shelf for the embedded palette browser.
    await allPill.click();
    await expect(
      page.getByRole('button', { name: 'Close palette browser' })
    ).toBeVisible();
  });

  test('the homepage menu exposes the nav and GitHub on mobile', async ({
    page,
  }) => {
    await page.goto('/');

    // The homepage has its own dark masthead rather than the shared header, and
    // below 768px its inline nav is display:none - the panel is the only way to
    // reach the rest of the site from here.
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await expect(trigger).toBeVisible();

    await trigger.click();

    const menu = page.locator('#home-nav-menu');
    await expect(menu.getByRole('link', { name: 'Templates' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'GitHub' })).toBeVisible();

    // Studio replaced the "Soon" generator item and is now a real destination.
    // The export uses trailing slashes, so the rendered href is "/studio/".
    await expect(menu.getByRole('link', { name: 'Studio' })).toHaveAttribute(
      'href',
      /^\/studio\/?$/
    );

    await menu.getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/\/docs\/react/);
  });

  test('hamburger drawer exposes the nav and GitHub on mobile', async ({
    page,
  }) => {
    // The shared header is no longer on the homepage, so the drawer is
    // exercised on a page that still uses it.
    await page.goto('/privacy-policy');

    // The inline nav is display:none below 992px, so the hamburger drawer is the
    // only way to reach the site navigation (and GitHub) here.
    const trigger = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(trigger).toBeVisible();

    await trigger.click();

    const drawer = page.getByRole('dialog');
    await expect(
      drawer.getByRole('link', { name: 'Browse Patterns' })
    ).toBeVisible();
    // GitHub moves from the header into the drawer on mobile.
    await expect(drawer.getByRole('link', { name: 'GitHub' })).toBeVisible();

    // Choosing a destination navigates and closes the drawer.
    await drawer.getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/\/docs\/react/);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

test.describe('Studio', () => {
  const BICYCLES = 'Handbuilt bicycle frames for road cyclists, bold and industrial.';

  test('matches a description to three real template sites', async ({
    page,
  }) => {
    await page.goto('/studio');

    // Signed out, the library match is the path - it needs no account and no
    // Worker, which is what this spec runs against (`serve out`).
    const match = page.getByRole('button', { name: 'Match from the library' });
    await expect(match).toBeDisabled();

    await page.getByLabel('Your business').fill(BICYCLES);
    await expect(match).toBeEnabled();

    // Generating is the other button, and it is a session away - signed out it
    // sends you to sign in rather than spending anything.
    await expect(
      page.getByRole('button', { name: 'Generate websites' })
    ).toBeEnabled();

    await match.click();

    await page.waitForURL(/\/studio\/results/, { timeout: 15000 });

    const cards = page.locator('article');
    await expect(cards).toHaveCount(3);

    // The whole point of matching against the library rather than generating:
    // every card has to lead somewhere that already exists.
    const previews = await page
      .getByRole('link', { name: 'Preview' })
      .evaluateAll((links) => links.map((l) => l.getAttribute('href')));

    expect(previews).toHaveLength(3);

    for (const href of previews) {
      expect(href).toMatch(/^\/template\/[a-z0-9-]+\/$/);
      const response = await page.request.get(href);
      expect(response.status(), `${href} should be a real page`).toBe(200);
    }

    // Download points at the zip the packaging step writes for that same site.
    const downloads = await page
      .getByRole('link', { name: 'Download' })
      .evaluateAll((links) => links.map((l) => l.getAttribute('href')));

    expect(downloads).toEqual(
      previews.map((href) => `/downloads/${href.split('/')[2]}-html.zip`)
    );
  });

  test('the same description always gives the same three', async ({ page }) => {
    // The match is a pure function of the query string, which is what makes a
    // results link worth sharing.
    const names = async (description: string) => {
      await page.goto(`/studio/results/?q=${encodeURIComponent(description)}`);
      return page.locator('article h2').allTextContents();
    };

    const first = await names(BICYCLES);
    const again = await names(BICYCLES);
    expect(again).toEqual(first);

    const other = await names(
      'A quiet, elegant perfume house. Monochrome and restrained.'
    );
    expect(other).not.toEqual(first);
  });
});

test.describe('Shared site header', () => {
  test('is reused on content pages and marks the active nav item', async ({
    page,
  }) => {
    // The gallery (/patterns) now owns its own rail chrome, so the shared
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

    // "Docs" is the current section, "Browse Patterns" is not. The active item
    // is both flagged for assistive tech and given a style hook.
    const docs = page.getByRole('link', { name: 'Docs' });
    await expect(docs).toHaveAttribute('aria-current', 'page');
    await expect(docs).toHaveClass(/active/);
    await expect(
      page.getByRole('link', { name: 'Browse Patterns' })
    ).not.toHaveAttribute('aria-current', 'page');

    // A page with no matching nav item highlights nothing.
    await page.goto('/privacy-policy');
    await expect(
      page.getByRole('link', { name: 'Browse Patterns' })
    ).toBeVisible();
    await expect(page.locator('header a[aria-current="page"]')).toHaveCount(0);
  });

  test('the gallery rail owns its chrome instead of the shared header', async ({
    page,
  }) => {
    await page.goto('/patterns');

    // The page carries its own slim bar with the way home, and the rail beside
    // it carries the palette chrome - but neither is the shared site nav.
    await expect(
      page.getByRole('link', { name: 'Tabbied', exact: true })
    ).toBeVisible();
    await expect(page.getByText('Pattern library')).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Open navigation menu' })
    ).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Browse Patterns' })
    ).toHaveCount(0);
  });

  test('is not used on the individual pattern editor', async ({ page }) => {
    await page.goto('/patterns/radius');

    // The editor keeps its own header...
    await expect(
      page.getByRole('link', { name: 'Gallery' })
    ).toBeVisible({ timeout: 15000 });

    // ...and never renders the shared site nav.
    await expect(
      page.getByRole('link', { name: 'Browse Patterns' })
    ).toHaveCount(0);
  });
});

test.describe('React component docs page', () => {
  test('documents the component with live examples', async ({ page }) => {
    await page.goto('/docs/react');

    await expect(page.getByText('npm install tabbied')).toBeVisible();

    // The examples render real patterns through the package component, so the
    // custom element must register and a doodle mount.
    await page.waitForFunction(() => !!window.customElements.get('css-doodle'));
    await expect(
      page.locator('[data-pattern="radius"] css-doodle').first()
    ).toBeAttached({ timeout: 15000 });
  });
});
