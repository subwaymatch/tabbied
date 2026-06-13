import { test, expect, type Page } from '@playwright/test';

// Coverage for the `tabbied` package itself (via the built dist the site
// consumes), driven through app/package-test/page.tsx. The gallery and editor
// already dogfood the cover and fixed fits; this spec covers the adaptive
// grid fit — the package default — plus stretch and contain.

const paintedCells = (page: Page, hostSelector: string) =>
  page.evaluate((selector) => {
    const el = document.querySelector(`${selector} css-doodle`);
    if (!el || !el.shadowRoot) return 0;
    return [...el.shadowRoot.querySelectorAll('cssd-cell')].filter((cell) => {
      const bg = getComputedStyle(cell).backgroundColor;
      return bg && bg !== 'rgba(0, 0, 0, 0)';
    }).length;
  }, hostSelector);

const cellCount = (page: Page, hostSelector: string) =>
  page.evaluate((selector) => {
    const el = document.querySelector(`${selector} css-doodle`);
    return el?.shadowRoot?.querySelectorAll('cssd-cell').length ?? 0;
  }, hostSelector);

test.describe('tabbied package (component test page)', () => {
  test('fit="grid" adapts the cell grid to the container size', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/package-test');

    await page.waitForFunction(() => !!window.customElements.get('css-doodle'));
    const doodle = page.locator('#fit-grid [data-artwork="radius"] css-doodle');
    await expect(doodle).toBeAttached({ timeout: 15000 });

    // The canvas fills its host box (`@size: 100% 100%`).
    const host = page.locator('#fit-grid [data-artwork="radius"]');
    const hostBox = (await host.boundingBox())!;
    const doodleBox = (await doodle.boundingBox())!;
    expect(Math.abs(doodleBox.width - hostBox.width)).toBeLessThan(2);
    expect(Math.abs(doodleBox.height - hostBox.height)).toBeLessThan(2);

    // ~36px target cells: a ~1152×320 box must get a clearly 2-D grid, and
    // the pattern must actually paint.
    const wideCount = await cellCount(page, '#fit-grid [data-artwork="radius"]');
    expect(wideCount).toBeGreaterThan(100);
    await expect
      .poll(() => paintedCells(page, '#fit-grid [data-artwork="radius"]'), {
        timeout: 10000,
      })
      .toBeGreaterThan(1);

    // Shrinking the container re-derives a coarser grid (debounced ~180ms).
    await page.setViewportSize({ width: 480, height: 800 });
    await expect
      .poll(() => cellCount(page, '#fit-grid [data-artwork="radius"]'), {
        timeout: 10000,
      })
      .toBeLessThan(wideCount);
  });

  test('fit="stretch" keeps the authored grid and fills the box', async ({
    page,
  }) => {
    await page.goto('/package-test');

    const selector = '#fit-stretch [data-artwork="radius"]';
    await expect(page.locator(`${selector} css-doodle`)).toBeAttached({
      timeout: 15000,
    });

    await expect
      .poll(() => paintedCells(page, selector), { timeout: 10000 })
      .toBeGreaterThan(1);

    const host = page.locator(selector);
    const hostBox = (await host.boundingBox())!;
    const doodleBox = (await page
      .locator(`${selector} css-doodle`)
      .boundingBox())!;
    expect(Math.abs(doodleBox.width - hostBox.width)).toBeLessThan(2);
  });

  test('fit="contain" letterboxes symmetry at its authored ratio', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/package-test');

    const doodle = page.locator(
      '#fit-contain [data-artwork="symmetry"] css-doodle'
    );
    await expect(doodle).toBeAttached({ timeout: 15000 });

    // Letterboxed inside a wide box: the visible artwork keeps its authored
    // 2:3 (800×1200 render) proportions instead of stretching.
    const host = page.locator('#fit-contain [data-artwork="symmetry"]');
    const hostBox = (await host.boundingBox())!;
    const doodleBox = (await doodle.boundingBox())!;
    const ratio = doodleBox.width / doodleBox.height;
    expect(Math.abs(ratio - 2 / 3)).toBeLessThan(0.02);
    expect(doodleBox.height).toBeLessThanOrEqual(hostBox.height + 1);

    // Non-decorative mode exposes an accessible image role.
    await expect(host).toHaveRole('img');
    await expect(host).toHaveAccessibleName('Symmetry');
  });
});
