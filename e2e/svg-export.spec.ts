// Native SVG export: parity, validity, determinism and UI gating.
//
// Parity is verified by rasterizing doodleToSvg()'s output and diffing it
// against a screenshot of the live element - the ground truth for what the
// user sees. A representative pattern set runs by default; set
// SVG_FULL_SWEEP=1 to run every supported pattern (slow, pre-release).
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const PACKAGE_DIR = path.join(__dirname, '..', 'packages', 'tabbied');

// The compiled converter has no runtime imports, so it can be injected as a
// classic script - the tests exercise the exact build that ships.
const injectedConverter =
  fs
    .readFileSync(path.join(PACKAGE_DIR, 'dist', 'core', 'svgExport.js'), 'utf8')
    .replace(/\bexport\s+(function|class|const)/g, '$1') +
  '\nwindow.__svgx = { doodleToSvg: doodleToSvg };';

const allPatterns = fs
  .readdirSync(path.join(PACKAGE_DIR, 'patterns'))
  .filter((file) => file.endsWith('.json'))
  .map((file) => {
    const definition = JSON.parse(
      fs.readFileSync(path.join(PACKAGE_DIR, 'patterns', file), 'utf8')
    );
    return { slug: file.replace(/\.json$/, ''), svgExport: definition.svgExport };
  });

const supportedSlugs = allPatterns
  .filter((pattern) => pattern.svgExport !== false)
  .map((pattern) => pattern.slug);
const unsupportedSlugs = allPatterns
  .filter((pattern) => pattern.svgExport === false)
  .map((pattern) => pattern.slug);

// One pattern per feature family: solid cells + pseudo-elements, radii,
// clip-paths, masks, every gradient kind, hard-stop conic sectors, nested
// @doodle masks, @svg payloads, borders, filters, blend modes, z-index.
//
// Four come from batch 11: a tiled dot pattern, a smooth gradient used as a
// mask, two stripe fields composited with mask-composite: intersect, and a
// many-vertex clip path.
//
// The last three come from batch 12, which is built on smooth ramps and adds
// gradient shapes nothing else in the list exercises: a fade posterized into
// flat alpha levels (`stepramp`), a radial ramp thrown from a corner and used
// as a mask (`radiance`), and a dot field intersected with a radial ramp
// (`dotwash`).
//
// Batch 13 (orders 2000-2041) adds three, one per family it's built from: a
// linear+radial gradient mask (`bight`), a pure clip-path composition
// (`bench`), and the batch's only stepped-conic mask (`mirrorblack`).
const REPRESENTATIVE = [
  'damier',
  'radius',
  'bauhaus',
  'chip',
  'battlement',
  'annulus',
  'mixtape',
  'disque',
  'fluting',
  'gasket',
  'bokeh',
  'neon',
  'lantern',
  'terrain',
  'misprint',
  'glyph',
  'spray',
  'sunray',
  'fractal',
  'matryoshka',
  'subdivide',
  'charcoal',
  'circuit',
  'ring',
  'bloks',
  'dotfield',
  'shading',
  'bothways',
  'dieblock',
  'stepramp',
  'radiance',
  'dotwash',
  'bight',
  'bench',
  'mirrorblack',
];

// Differing pixels tolerated (after anti-aliasing forgiveness). A few
// patterns run looser, for documented sub-CSS-pixel deviations:
// - fractal/matryoshka/subdivide: css-doodle's live rendering shows hairline
//   seams from rasterizing the nested foreignObject @doodle mask, which the
//   clean vector export intentionally does not reproduce.
// - drypoint: the browser rasterizes the @svg mask image with slightly
//   different sub-pixel rounding than the inlined symbol (≤1 CSS px).
// - windowpane: CSS blends mixed-width borders progressively around rounded
//   corners; the per-side arc strokes junction within ≤1 CSS px of it.
// - glyph: every quadrant boundary is a maximum-contrast edge, so ordinary
//   anti-aliasing variance between Chromium builds lands right at the
//   default threshold (measured 0.50% locally, 1.004% on CI).
// - terrain/neon/lantern: box-shadow glows approximate as feDropShadow;
//   the falloff differs slightly per Chromium build (terrain hit 1.37% on
//   CI vs 0.99% locally).
// - stepramp: the same phenomenon as glyph, from edge *density* rather than
//   contrast. It draws four full-width hard edges in every cell (one per alpha
//   level), and the editor's default grid puts the cell boundaries on
//   fractional pixels - 60.66px at 6x9 - so every one of those edges lands
//   mid-device-pixel, where CSS snaps and SVG anti-aliases. This is a property
//   of the geometry, not of the design: swept at a fractional cell size the
//   shipped batch-11 catalogue lands in the same 0.5-1.8% band (toning 1.84%,
//   dimmer 1.71%, tinting 1.36%). See docs/svg-export.md.
const MAX_BAD_FRACTION = 0.01;
const PER_PATTERN_MAX: Record<string, number> = {
  fractal: 0.03,
  matryoshka: 0.03,
  subdivide: 0.035,
  drypoint: 0.02,
  windowpane: 0.02,
  glyph: 0.015,
  terrain: 0.02,
  neon: 0.015,
  lantern: 0.015,
  stepramp: 0.02,
};

const paritySlugs = process.env.SVG_FULL_SWEEP ? supportedSlugs : REPRESENTATIVE;

async function openPattern(page: Page, slug: string): Promise<void> {
  await page.goto(`/patterns/${slug}/?seed=e2e01`);
  await page.waitForFunction(
    (s) => {
      const el = document.querySelector(`div[data-pattern="${s}"] css-doodle`);
      return Boolean(el && el.shadowRoot && el.shadowRoot.querySelector('cssd-grid'));
    },
    slug,
    { timeout: 30000 }
  );
  // Let the first-draw transitions settle before snapshotting.
  await page.waitForTimeout(900);
}

test.describe('native SVG export', () => {
  test.describe.configure({ timeout: 60000 });

  test.use({ deviceScaleFactor: 2 });

  for (const slug of paritySlugs) {
    test(`parity: ${slug}`, async ({ page }) => {
      await openPattern(page, slug);

      // Ground truth: the browser's own painting of the element, cropped to
      // the grid's exact (fractional) rect for registration.
      const screenshot = await page.screenshot();
      const shotUrl = `data:image/png;base64,${screenshot.toString('base64')}`;
      const gridRect = await page.evaluate((s) => {
        const el = document.querySelector(`div[data-pattern="${s}"] css-doodle`)!;
        const rect = el.shadowRoot!.querySelector('cssd-grid')!.getBoundingClientRect();
        return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
      }, slug);

      await page.addScriptTag({ content: injectedConverter });

      const result = await page.evaluate(
        async ({ slug, shotUrl, gridRect }) => {
          const TOLERANCE = 12;
          const el = document.querySelector(
            `div[data-pattern="${slug}"] css-doodle`
          ) as HTMLElement;
          const res = (window as never as {
            __svgx: {
              doodleToSvg: (el: HTMLElement) => {
                svg: string;
                width: number;
                height: number;
                warnings: string[];
              };
            };
          }).__svgx.doodleToSvg(el);

          const scale = 2;
          const W = Math.round(res.width * scale);
          const H = Math.round(res.height * scale);

          const draw = async (
            src: string,
            srcRect?: { x: number; y: number; w: number; h: number }
          ) => {
            const img = new Image();
            img.src = src;
            await img.decode();
            const canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            const g = canvas.getContext('2d')!;
            g.fillStyle = '#ffffff';
            g.fillRect(0, 0, W, H);
            if (srcRect) {
              g.drawImage(img, srcRect.x, srcRect.y, srcRect.w, srcRect.h, 0, 0, W, H);
            } else {
              g.drawImage(img, 0, 0, W, H);
            }
            return g.getImageData(0, 0, W, H).data;
          };

          const blob = new Blob([res.svg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const a = await draw(url);
          URL.revokeObjectURL(url);
          const b = await draw(shotUrl, {
            x: gridRect.x * scale,
            y: gridRect.y * scale,
            w: gridRect.w * scale,
            h: gridRect.h * scale,
          });

          // A differing pixel is an anti-aliasing artifact (CSS snaps edges
          // to device pixels; SVG anti-aliases fractional geometry) when its
          // color lies channel-wise between the other image's neighborhood
          // extremes, checked in both directions.
          const within = (
            data: Uint8ClampedArray,
            i: number,
            other: Uint8ClampedArray,
            x: number,
            y: number
          ) => {
            let lo0 = 255, lo1 = 255, lo2 = 255;
            let hi0 = 0, hi1 = 0, hi2 = 0;
            for (let dy = -2; dy <= 2; dy++) {
              for (let dx = -2; dx <= 2; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
                const j = (ny * W + nx) * 4;
                if (other[j] < lo0) lo0 = other[j];
                if (other[j] > hi0) hi0 = other[j];
                if (other[j + 1] < lo1) lo1 = other[j + 1];
                if (other[j + 1] > hi1) hi1 = other[j + 1];
                if (other[j + 2] < lo2) lo2 = other[j + 2];
                if (other[j + 2] > hi2) hi2 = other[j + 2];
              }
            }
            return (
              data[i] >= lo0 - TOLERANCE && data[i] <= hi0 + TOLERANCE &&
              data[i + 1] >= lo1 - TOLERANCE && data[i + 1] <= hi1 + TOLERANCE &&
              data[i + 2] >= lo2 - TOLERANCE && data[i + 2] <= hi2 + TOLERANCE
            );
          };

          let bad = 0;
          for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
              const i = (y * W + x) * 4;
              const delta = Math.max(
                Math.abs(a[i] - b[i]),
                Math.abs(a[i + 1] - b[i + 1]),
                Math.abs(a[i + 2] - b[i + 2])
              );
              if (delta <= TOLERANCE) continue;
              if (within(a, i, b, x, y) && within(b, i, a, x, y)) continue;
              bad++;
            }
          }

          return {
            badFraction: bad / (W * H),
            svg: res.svg,
            warnings: res.warnings,
          };
        },
        { slug, shotUrl, gridRect }
      );

      expect(
        result.badFraction,
        `pixel diff vs live render (allowed ${PER_PATTERN_MAX[slug] ?? MAX_BAD_FRACTION})`
      ).toBeLessThanOrEqual(PER_PATTERN_MAX[slug] ?? MAX_BAD_FRACTION);

      // Validity: parseable XML, native content only, scalable viewBox.
      expect(result.svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(result.svg).toContain('viewBox=');
      expect(result.svg).not.toContain('foreignObject');
      const parseError = await page.evaluate(
        (svg) =>
          new DOMParser()
            .parseFromString(svg, 'image/svg+xml')
            .querySelector('parsererror')?.textContent ?? null,
        result.svg
      );
      expect(parseError).toBeNull();
    });
  }

  test('same DOM exports byte-identical SVG (determinism)', async ({ page }) => {
    await openPattern(page, 'damier');
    await page.addScriptTag({ content: injectedConverter });
    const [first, second] = await page.evaluate(() => {
      const el = document.querySelector('div[data-pattern] css-doodle') as HTMLElement;
      const svgx = (window as never as {
        __svgx: { doodleToSvg: (el: HTMLElement) => { svg: string } };
      }).__svgx;
      return [svgx.doodleToSvg(el).svg, svgx.doodleToSvg(el).svg];
    });
    expect(first).toBe(second);
  });

  test('editor downloads a native .svg file', async ({ page }) => {
    // radius (shadow toggle off) has no limitations - no warning icon, no
    // confirmation dialog, straight to the download.
    await openPattern(page, 'radius');
    await page.getByRole('button', { name: 'Export' }).click();
    const item = page.getByRole('menuitem', { name: 'Download SVG' });
    await expect(item.locator('svg')).toHaveCount(1); // file icon only
    const downloadPromise = page.waitForEvent('download');
    await item.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('radius.svg');
    const content = fs.readFileSync(await download.path(), 'utf8');
    expect(content).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(content).not.toContain('foreignObject');
  });

  test('limited exports warn and confirm before downloading', async ({ page }) => {
    // neon's glow exports as SVG filters: warning icon on the menu item and
    // a confirmation dialog that can cancel or proceed.
    await openPattern(page, 'neon');
    await page.getByRole('button', { name: 'Export' }).click();
    const item = page.getByRole('menuitem', { name: 'Download SVG' });
    await expect(item.locator('svg')).toHaveCount(2); // file icon + warning
    await item.click();

    const dialog = page.getByRole('dialog', { name: 'About this SVG export' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('SVG drop-shadow filters');

    // Cancel closes without downloading.
    let downloaded = false;
    page.on('download', () => {
      downloaded = true;
    });
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).not.toBeVisible();
    expect(downloaded).toBe(false);

    // Clicking outside the dialog dismisses it too.
    await page.getByRole('button', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Download SVG' }).click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(8, 8);
    await expect(dialog).not.toBeVisible();
    expect(downloaded).toBe(false);

    // Confirming downloads the file.
    await page.getByRole('button', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Download SVG' }).click();
    const downloadPromise = page.waitForEvent('download');
    await dialog.getByRole('button', { name: 'Download SVG' }).click();
    expect((await downloadPromise).suggestedFilename()).toBe('neon.svg');
  });

  // There is deliberately no toggle-dependent case here. The Shadow toggle on
  // bloks/cupola/foliage/mixtape/odessa/quarterfall/radius was the only
  // option-level svgExportNote and the option has been removed, so no pattern
  // can exercise that path. The mechanism still works; it has no fixture.
  for (const slug of unsupportedSlugs) {
    test(`menu item is disabled for ${slug}`, async ({ page }) => {
      await openPattern(page, slug);
      await page.getByRole('button', { name: 'Export' }).click();
      const item = page.getByRole('menuitem', { name: 'Download SVG' });
      await expect(item).toBeVisible();
      await expect(item).toHaveAttribute('data-disabled', '');
      // The PNG item stays enabled.
      await expect(
        page.getByRole('menuitem', { name: 'Download PNG' })
      ).not.toHaveAttribute('data-disabled', '');
    });
  }
});
