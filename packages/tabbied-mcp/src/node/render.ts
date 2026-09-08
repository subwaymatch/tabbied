// `render_design` - the one tool that only exists over stdio.
//
// It shells out to the `tabbied` CLI rather than reimplementing rendering,
// which is not laziness but the same rule the rest of this repo follows: the
// only faithful renderer for a css-doodle pattern is css-doodle in a real
// browser (see docs/svg-export.md). The CLI already owns the headless-browser
// dance, the SVG converter, and the option parsing, so this is a wrapper over
// argv - and a Worker, having no browser, simply doesn't offer the tool.
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import type { Catalog, Tool, ToolResult } from '../types.js';
import { tabbiedRoot } from './resources.js';

const run = promisify(execFile);

// Rendering launches a browser and waits for the first arrangement to settle.
const RENDER_TIMEOUT_MS = 180_000;

// A PNG returned inline is spent context. Past this the file stays on disk and
// the agent gets the path - better a usable pointer than a truncated image.
const INLINE_BYTE_BUDGET = 1_500_000;

const text = (value: string) => ({ type: 'text' as const, text: value });

const toolError = (message: string): ToolResult => ({
  content: [text(message)],
  isError: true,
});

export function renderTool(catalog: Catalog): Tool {
  return {
    definition: {
      name: 'render_design',
      title: 'Render a design to a file',
      description:
        'Render a design to SVG or PNG with a real browser, at any size, seed, ' +
        'palette, and option set. Use this to produce an actual asset - or to ' +
        'preview a *customized* configuration, which preview_design cannot show ' +
        'you (it only has the stock palette and defaults). Needs Playwright ' +
        'installed alongside this server. Without "out" the image comes back ' +
        'inline; with it, the file is written where you ask.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'The design to render.' },
          format: {
            type: 'string',
            enum: ['svg', 'png'],
            description:
              'Vector or raster. A few designs cannot be vectorized - check ' +
              'svgExport on the design first.',
          },
          out: {
            type: 'string',
            description:
              'Absolute path to write to. Omit to get the image back inline ' +
              'instead of on disk.',
          },
          seed: {
            type: 'string',
            description:
              'Fixed seed - the same seed always gives the same image. Random ' +
              'when omitted.',
          },
          palette: {
            type: 'array',
            items: { type: 'string' },
            description:
              "CSS colors, background first. Omit for the design's authored palette.",
          },
          options: {
            type: 'object',
            description:
              'Option values keyed by option id, e.g. {"scale": 3}. Read the ' +
              'ids and ranges off get_design.',
          },
          width: { type: 'integer', description: 'Pixels wide (default 960).' },
          height: { type: 'integer', description: 'Pixels tall (default 960).' },
          fit: {
            type: 'string',
            enum: ['grid', 'cover', 'fixed'],
            description: 'Sizing mode (default grid).',
          },
          scale: {
            type: 'integer',
            description:
              'PNG device-scale factor. Defaults to 2 when writing a file and ' +
              '1 when returning inline, to keep the response small.',
          },
        },
        required: ['slug', 'format'],
        additionalProperties: false,
      },
    },

    async run(args): Promise<ToolResult> {
      const slug = typeof args.slug === 'string' ? args.slug : '';
      const design = catalog.designs.find((entry) => entry.slug === slug);
      if (!design) {
        return toolError(
          `No design with slug "${slug}". Use search_designs to find one.`
        );
      }

      const format = args.format === 'png' ? 'png' : 'svg';
      if (format === 'svg' && !design.svgExport.supported) {
        return toolError(
          `"${slug}" paints effects SVG cannot represent, so it has no vector ` +
            'export. Render it as PNG instead.'
        );
      }

      const root = tabbiedRoot();
      if (!root) {
        return toolError(
          'The `tabbied` package is not installed next to this server, so the ' +
            'renderer is unavailable. Run `npm install tabbied`.'
        );
      }

      const inline = typeof args.out !== 'string' || args.out.length === 0;
      const outPath = inline
        ? path.join(
            await mkdtemp(path.join(tmpdir(), 'tabbied-')),
            `${slug}.${format}`
          )
        : (args.out as string);

      const scale =
        typeof args.scale === 'number' && Number.isFinite(args.scale)
          ? Math.trunc(args.scale)
          : inline
            ? 1
            : 2;

      const argv = [
        path.join(root, 'dist', 'cli.js'),
        'render',
        slug,
        '--out',
        outPath,
        '--format',
        format,
        '--scale',
        String(scale),
      ];

      const push = (flag: string, value: string) => argv.push(flag, value);

      if (typeof args.seed === 'string' && args.seed) push('--seed', args.seed);
      if (typeof args.fit === 'string') push('--fit', args.fit);

      const width =
        typeof args.width === 'number' ? Math.trunc(args.width) : 960;
      const height =
        typeof args.height === 'number' ? Math.trunc(args.height) : 960;
      push('--size', `${width}x${height}`);

      if (Array.isArray(args.palette) && args.palette.length) {
        push('--palette', args.palette.filter(Boolean).join(','));
      }

      if (args.options && typeof args.options === 'object') {
        const pairs = Object.entries(args.options as Record<string, unknown>)
          .map(([id, value]) => `${id}: ${String(value)}`)
          .join('; ');
        if (pairs) push('--options', pairs);
      }

      let stderr = '';
      try {
        // No shell: argv goes straight to node, so a palette or option value
        // can't be read as shell syntax.
        ({ stderr } = await run(process.execPath, argv, {
          timeout: RENDER_TIMEOUT_MS,
          maxBuffer: 8 * 1024 * 1024,
        }));
      } catch (error) {
        const detail =
          error && typeof error === 'object' && 'stderr' in error
            ? String((error as { stderr: unknown }).stderr).trim()
            : error instanceof Error
              ? error.message
              : String(error);
        return toolError(
          `Rendering failed: ${detail || 'the CLI exited non-zero.'}\n\n` +
            'If this says a browser is missing, install one alongside the ' +
            'server (`npm i -D playwright`) or point TABBIED_CHROMIUM at a ' +
            'Chromium binary.'
        );
      }

      // The CLI reports SVG-fidelity caveats on stderr; they matter enough to
      // pass through rather than swallow.
      const notes = stderr
        .split('\n')
        .filter((line) => line.trim().startsWith('note:'))
        .join('\n');

      if (!inline) {
        const { size } = await stat(outPath);
        return {
          content: [
            text(
              `Rendered ${slug} to ${outPath} (${width}x${height}` +
                (format === 'png' ? ` @${scale}x` : '') +
                `, ${Math.round(size / 1024)} KB).` +
                (notes ? `\n${notes}` : '')
            ),
          ],
        };
      }

      if (format === 'svg') {
        const svg = await readFile(outPath, 'utf-8');
        return {
          content: [
            text(
              `Rendered ${slug} as SVG (${width}x${height}).` +
                (notes ? `\n${notes}` : '')
            ),
            text(svg),
          ],
        };
      }

      const png = await readFile(outPath);
      const data = png.toString('base64');
      if (data.length > INLINE_BYTE_BUDGET) {
        return {
          content: [
            text(
              `Rendered ${slug} to ${outPath} - ${Math.round(
                png.byteLength / 1024
              )} KB, too large to return inline. Read it from that path, or ` +
                're-render smaller (lower "scale", or a smaller width/height).'
            ),
          ],
        };
      }

      return {
        content: [
          text(
            `Rendered ${slug} (${width}x${height} @${scale}x).` +
              (notes ? `\n${notes}` : '')
          ),
          { type: 'image', data, mimeType: 'image/png' },
        ],
      };
    },
  };
}
