// The Tabbied toolset: four thin wrappers over catalog.json, plus whatever the
// host adds (the stdio server adds `render_design`).
//
// Nothing here touches node or the Worker runtime - the host injects the two
// things that differ (preview bytes, docs text) via ToolContext. That is what
// lets the same definitions serve both transports, so a design an agent finds
// over HTTP is described identically to one it finds over stdio.
//
// The point of the whole toolset is design *selection*. Slugs are opaque
// ("cleat", "karst"), so an agent that cannot query the metadata either guesses
// a slug that does not exist or gives up; and metadata alone is not enough
// either, because these are pictures. So: search narrows on closed-vocabulary
// enums, then preview_design puts the shortlist in front of the model's eyes
// before it commits.
import { templateTools } from './templates.js';
import type {
  Catalog,
  CatalogDesign,
  Tool,
  ToolContent,
  ToolContext,
  ToolDefinition,
  ToolResult,
} from './types.js';

const SEARCH_LIMIT_DEFAULT = 20;
const SEARCH_LIMIT_MAX = 50;
const PREVIEW_MAX_SLUGS = 6;

// Previews run from 5 KB to 444 KB (median 35 KB), and base64 adds a third. Six
// of the largest would be ~3.5 MB of context spent on images the agent did not
// ask to be that big, so the batch stops early and says so rather than
// silently truncating the list.
const PREVIEW_BYTE_BUDGET = 1_500_000;

// ---- helpers ---------------------------------------------------------------

const text = (value: string): ToolContent => ({ type: 'text', text: value });

const json = (value: unknown): ToolContent =>
  text(JSON.stringify(value, null, 2));

const toolError = (message: string): ToolResult => ({
  content: [text(message)],
  isError: true,
});

/** Distinct values of a repeated field, sorted - the vocabulary actually in use. */
function vocabulary(
  designs: CatalogDesign[],
  field: 'tags' | 'mood' | 'goodFor'
): string[] {
  return [...new Set(designs.flatMap((design) => design[field]))].sort();
}

function densities(designs: CatalogDesign[]): string[] {
  return [...new Set(designs.map((design) => design.density))].sort();
}

function asStringArray(value: unknown): string[] | null {
  if (value == null) return null;
  const list = Array.isArray(value) ? value : [value];
  const strings = list.filter((entry): entry is string => typeof entry === 'string');
  return strings.length ? strings : null;
}

/** The compact form used in search hits - enough to shortlist, not the full record. */
function summarize(design: CatalogDesign) {
  return {
    slug: design.slug,
    name: design.name,
    ...(design.description ? { description: design.description } : {}),
    tags: design.tags,
    mood: design.mood,
    density: design.density,
    goodFor: design.goodFor,
    svgExport: design.svgExport.supported,
    preview: design.preview,
  };
}

function findDesign(catalog: Catalog, slug: unknown): CatalogDesign | null {
  if (typeof slug !== 'string') return null;
  return catalog.designs.find((design) => design.slug === slug) ?? null;
}

/** The same "did you mean" list the CLI would give: slugs sharing a prefix. */
function suggestSlugs(catalog: Catalog, slug: string): string[] {
  const needle = slug.toLowerCase();
  return catalog.designs
    .filter(
      (design) =>
        design.slug.startsWith(needle.slice(0, 3)) ||
        design.name.toLowerCase().includes(needle)
    )
    .slice(0, 8)
    .map((design) => design.slug);
}

// ---- search_designs --------------------------------------------------------

function searchTool(catalog: Catalog): Tool {
  const tags = vocabulary(catalog.designs, 'tags');
  const moods = vocabulary(catalog.designs, 'mood');
  const goodFor = vocabulary(catalog.designs, 'goodFor');
  const densityValues = densities(catalog.designs);

  const definition: ToolDefinition = {
    name: 'search_designs',
    title: 'Search designs',
    description:
      `Find Tabbied designs by visible motif, feel, busyness, or intended use. ` +
      `Filters combine with AND - listing two tags returns only designs carrying ` +
      `both - so start broad and narrow. Returns compact entries including a ` +
      `preview image URL; follow up with preview_design to actually look at the ` +
      `shortlist before choosing, because these are pictures and the metadata ` +
      `only narrows the field. ${catalog.count} designs in total.`,
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Free text matched against slug, name, and description. Every ' +
            'whitespace-separated word must appear somewhere in the entry.',
        },
        tags: {
          type: 'array',
          items: { type: 'string', enum: tags },
          description: 'Visible motifs. A design must carry every tag listed.',
        },
        mood: {
          type: 'array',
          items: { type: 'string', enum: moods },
          description: 'The feel of the design at a glance.',
        },
        density: {
          type: 'string',
          enum: densityValues,
          description:
            'How busy the surface is. sparse takes overlaid text well; dense is ' +
            'ink-dominated.',
        },
        goodFor: {
          type: 'array',
          items: { type: 'string', enum: goodFor },
          description: 'Uses the design suits with no customization.',
        },
        svgExport: {
          type: 'boolean',
          description:
            'Restrict to designs that can (true) or cannot (false) be exported ' +
            'as true vector SVG. A handful paint smooth conic sweeps that SVG ' +
            'cannot represent.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: SEARCH_LIMIT_MAX,
          description: `Maximum hits to return (default ${SEARCH_LIMIT_DEFAULT}).`,
        },
      },
      additionalProperties: false,
    },
  };

  return {
    definition,
    run(args) {
      const wantTags = asStringArray(args.tags);
      const wantMood = asStringArray(args.mood);
      const wantGoodFor = asStringArray(args.goodFor);
      const density = typeof args.density === 'string' ? args.density : null;
      const svgExport =
        typeof args.svgExport === 'boolean' ? args.svgExport : null;
      const terms =
        typeof args.query === 'string'
          ? args.query.toLowerCase().split(/\s+/).filter(Boolean)
          : [];

      const limit = Math.min(
        Math.max(
          typeof args.limit === 'number' && Number.isFinite(args.limit)
            ? Math.trunc(args.limit)
            : SEARCH_LIMIT_DEFAULT,
          1
        ),
        SEARCH_LIMIT_MAX
      );

      const matches = (design: CatalogDesign) => {
        const haystack =
          `${design.slug} ${design.name} ${design.description ?? ''}`.toLowerCase();
        return (
          terms.every((term) => haystack.includes(term)) &&
          (!wantTags || wantTags.every((tag) => design.tags.includes(tag))) &&
          (!wantMood || wantMood.every((mood) => design.mood.includes(mood))) &&
          (!wantGoodFor ||
            wantGoodFor.every((use) => design.goodFor.includes(use))) &&
          (!density || design.density === density) &&
          (svgExport === null || design.svgExport.supported === svgExport)
        );
      };

      const hits = catalog.designs.filter(matches);

      // An empty result is the failure mode worth designing for: the agent has
      // no way to tell an over-narrow AND from a vocabulary it guessed wrong.
      // Report how each filter would do on its own so the next call is informed.
      if (hits.length === 0) {
        const alone = (label: string, predicate: (d: CatalogDesign) => boolean) => ({
          filter: label,
          matches: catalog.designs.filter(predicate).length,
        });
        const breakdown = [
          ...(terms.length
            ? [
                alone(`query "${args.query}"`, (design) =>
                  terms.every((term) =>
                    `${design.slug} ${design.name} ${design.description ?? ''}`
                      .toLowerCase()
                      .includes(term)
                  )
                ),
              ]
            : []),
          ...(wantTags ?? []).map((tag) =>
            alone(`tag "${tag}"`, (design) => design.tags.includes(tag))
          ),
          ...(wantMood ?? []).map((mood) =>
            alone(`mood "${mood}"`, (design) => design.mood.includes(mood))
          ),
          ...(wantGoodFor ?? []).map((use) =>
            alone(`goodFor "${use}"`, (design) => design.goodFor.includes(use))
          ),
          ...(density
            ? [alone(`density "${density}"`, (design) => design.density === density)]
            : []),
        ];

        return {
          content: [
            json({
              matched: 0,
              total: catalog.count,
              note:
                'No design satisfies every filter at once. Each filter on its ' +
                'own matches the counts below - drop the ones scoring 0 (likely ' +
                'out of vocabulary) and relax the rest.',
              filtersIndependently: breakdown,
              vocabulary: {
                tags,
                mood: moods,
                density: densityValues,
                goodFor,
              },
            }),
          ],
        };
      }

      return {
        content: [
          json({
            matched: hits.length,
            total: catalog.count,
            returned: Math.min(hits.length, limit),
            designs: hits.slice(0, limit).map(summarize),
          }),
        ],
      };
    },
  };
}

// ---- get_design ------------------------------------------------------------

function getDesignTool(catalog: Catalog): Tool {
  const definition: ToolDefinition = {
    name: 'get_design',
    title: 'Get design details',
    description:
      'The full catalog record for one design - palette, every option with its ' +
      'range and default, SVG-export support, preview URL - plus ready-to-paste ' +
      'React and vanilla snippets. Call this once a slug is chosen; ' +
      'search_designs already returns enough to shortlist.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The design slug, e.g. "radius". Slugs are not guessable.',
        },
      },
      required: ['slug'],
      additionalProperties: false,
    },
  };

  return {
    definition,
    run(args) {
      const design = findDesign(catalog, args.slug);
      if (!design) {
        const near = suggestSlugs(catalog, String(args.slug ?? ''));
        return toolError(
          `No design with slug "${args.slug}". ` +
            (near.length
              ? `Closest slugs: ${near.join(', ')}. `
              : '') +
            'Use search_designs to find one - slugs are opaque and cannot be guessed.'
        );
      }

      const snippet = (template: string) =>
        template.replaceAll('<slug>', design.slug);

      return {
        content: [
          json({
            ...design,
            usage: {
              install: catalog.usage.install,
              import: snippet(catalog.usage.import),
              react: snippet(catalog.usage.react),
              core: snippet(catalog.usage.core),
              fit: catalog.usage.fit,
              cli: `npx tabbied render ${design.slug} --out ${design.slug}.svg`,
            },
            // The number-one integration mistake, repeated here because an
            // agent that called get_design may never read llms-full.txt.
            sizing:
              'A pattern has no intrinsic size - it fills its parent, and ' +
              'collapses to nothing in a parent that sizes to content. Pass ' +
              'height or aspectRatio when in doubt.',
            ...(design.svgExport.supported
              ? {}
              : {
                  svgExportWarning:
                    'This design cannot be exported as vector SVG. Render it as PNG instead.',
                }),
          }),
        ],
      };
    },
  };
}

// ---- preview_design --------------------------------------------------------

function previewTool(context: ToolContext): Tool | null {
  const { catalog, fetchPreview } = context;
  if (!fetchPreview) return null;

  const definition: ToolDefinition = {
    name: 'preview_design',
    title: 'Look at designs',
    description:
      `Return the rendered preview image for up to ${PREVIEW_MAX_SLUGS} designs, ` +
      'so you can see them rather than infer them from tags. Previews use each ' +
      "design's authored palette, default options, and a fixed seed. This is the " +
      'step that makes a choice reliable - do it before committing to a slug.',
    inputSchema: {
      type: 'object',
      properties: {
        slugs: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: PREVIEW_MAX_SLUGS,
          description: 'Design slugs to look at, e.g. ["radius", "cleat"].',
        },
      },
      required: ['slugs'],
      additionalProperties: false,
    },
  };

  return {
    definition,
    async run(args) {
      const slugs = asStringArray(args.slugs);
      if (!slugs) {
        return toolError('Pass "slugs" as a non-empty array of design slugs.');
      }

      const requested = slugs.slice(0, PREVIEW_MAX_SLUGS);
      const content: ToolContent[] = [];
      let spent = 0;

      for (const [index, slug] of requested.entries()) {
        const design = findDesign(catalog, slug);
        if (!design) {
          content.push(
            text(`${slug}: no such design. Use search_designs to find valid slugs.`)
          );
          continue;
        }

        if (spent > PREVIEW_BYTE_BUDGET) {
          content.push(
            text(
              `Stopped after ${index} image(s) to stay within a sane response ` +
                `size. Ask again for the rest: ${requested.slice(index).join(', ')}.`
            )
          );
          break;
        }

        try {
          const { data, mimeType } = await fetchPreview(design);
          spent += data.length;
          content.push(
            text(
              `${design.slug} - ${design.name}` +
                (design.description ? `: ${design.description}` : '')
            ),
            { type: 'image', data, mimeType }
          );
        } catch (error) {
          content.push(
            text(
              `${design.slug}: preview unavailable (${
                error instanceof Error ? error.message : String(error)
              }). The image is also at ${design.preview}.`
            )
          );
        }
      }

      return { content };
    },
  };
}

// ---- get_docs --------------------------------------------------------------

function docsTool(context: ToolContext): Tool | null {
  const { fetchDocs } = context;
  if (!fetchDocs) return null;

  return {
    definition: {
      name: 'get_docs',
      title: 'Get the Tabbied reference',
      description:
        'The complete agent-facing reference (llms-full.txt): entry points, the ' +
        'React and vanilla APIs, sizing rules that compile but render wrong, ' +
        'integration recipes, and the share-link URL scheme. Fetch this once ' +
        'before writing integration code; the per-design tools do not repeat it.',
      inputSchema: { type: 'object', additionalProperties: false },
    },
    async run() {
      try {
        return { content: [text(await fetchDocs())] };
      } catch (error) {
        return toolError(
          `Could not load the reference (${
            error instanceof Error ? error.message : String(error)
          }). It is also served at https://tabbied.com/llms-full.txt.`
        );
      }
    },
  };
}

// ---- assembly --------------------------------------------------------------

/**
 * The catalog-backed tools available in every runtime.
 *
 * The template tools join them here rather than in a separate assembly so a
 * host opts in by supplying their fetchers, exactly as it already does for
 * previews and docs - one context, and the tool list follows from what the
 * host can actually resolve.
 */
export function catalogTools(context: ToolContext): Tool[] {
  return [
    searchTool(context.catalog),
    getDesignTool(context.catalog),
    previewTool(context),
    docsTool(context),
    ...templateTools(context),
  ].filter((tool): tool is Tool => tool !== null);
}

export type Toolset = {
  list(): ToolDefinition[];
  call(name: string, args: Record<string, unknown>): Promise<ToolResult>;
  has(name: string): boolean;
};

/**
 * Bundle tools into the lookup the protocol layer talks to. Handler throws are
 * converted to `isError` results rather than JSON-RPC errors: the spec reserves
 * protocol errors for malformed requests, and asks that execution failures go
 * back to the model so it can retry with better arguments.
 */
export function createToolset(tools: Tool[]): Toolset {
  const byName = new Map(tools.map((tool) => [tool.definition.name, tool]));

  return {
    list: () => tools.map((tool) => tool.definition),
    has: (name) => byName.has(name),
    async call(name, args) {
      const tool = byName.get(name);
      if (!tool) {
        return toolError(
          `Unknown tool "${name}". Available: ${[...byName.keys()].join(', ')}.`
        );
      }
      try {
        return await tool.run(args ?? {});
      } catch (error) {
        return toolError(
          error instanceof Error ? error.message : String(error)
        );
      }
    },
  };
}
