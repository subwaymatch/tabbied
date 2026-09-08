// The template-site tools: what an agent needs to start somebody's site from
// one of the 57 finished designs rather than from an empty page.
//
// The design tools answer "which pattern?". These answer "which *site*, and
// what am I allowed to change about it?" - which is a different question with a
// different answer shape. A template is a whole page somebody designed; the
// useful move is not to regenerate it but to swap the brand out of it, and the
// editable-section spec (docs/editable-templates.md) is exactly the list of
// what may be swapped.
//
// Both tools are thin readers over artefacts the site already generates, so an
// agent and the web builder are looking at the same bytes. Neither needs a
// browser, which is why - unlike `render_design` - they work over the remote
// transport as well as stdio.
import type {
  TemplateCatalog,
  TemplateCatalogEntry,
  TemplateSpec,
  Tool,
  ToolContent,
  ToolContext,
  ToolResult,
} from './types.js';

const text = (value: string): ToolContent => ({ type: 'text', text: value });

const json = (value: unknown): ToolContent =>
  text(JSON.stringify(value, null, 2));

const toolError = (message: string): ToolResult => ({
  content: [text(message)],
  isError: true,
});

/**
 * How to actually use what `get_template` returns.
 *
 * Spelled out per call rather than left to the reference, because this is the
 * step an agent most reliably gets wrong: the two download formats are edited
 * in opposite ways, and nothing about the spec implies which.
 */
const USAGE = {
  html:
    'Download <downloads.html>. It is a standalone page - no build step. Edit ' +
    'by slot id: every editable element carries data-edit="<id>" (text), ' +
    'data-edit-image="<id>", or data-edit-pattern="<id>". The patterns come up ' +
    'via one hydratePatterns() call already wired into index.html.',
  react:
    'Download <downloads.react>. It is a Vite app; `npm install && npm run ' +
    'dev`. The page ships as authored source with the same data-edit ids in ' +
    'it, so grep an id to find the element that renders it.',
  colors:
    'Colour lives in one place: the element carrying data-edit-root holds ' +
    '--brand-0 (the ground) upward as inline custom properties, and the ' +
    'stylesheet only reads var(--...). Re-colour by rewriting those. A pattern ' +
    'field with data-edit-roles follows the brand palette through that map; a ' +
    'literal "transparent" in the map must stay literal, because it is what ' +
    'lets the field read over a photograph.',
  text:
    'A text slot whose format is "emphasis" carries {em}...{/em} markers around ' +
    'the accented span. Keep them (or move them) - dropping them flattens an ' +
    'accent the design was built around. maxChars is the length the design was ' +
    'set for, not a hard limit.',
  programmatic:
    'To apply changes programmatically, write an edits document ' +
    '({specVersion, slug, edits}) and run it through applyEdits() from the ' +
    '`tabbied-templates` npm package, which validates it against this spec ' +
    'first. Full reference: https://tabbied.com/docs/editable-templates.',
};

function summarize(entry: TemplateCatalogEntry) {
  return {
    slug: entry.slug,
    name: entry.name,
    palette: entry.palette,
    patterns: entry.patterns,
    editable: entry.slots,
    url: `https://tabbied.com${entry.href}`,
  };
}

/**
 * Suggest near-misses for a slug that isn't in the catalog, so a wrong guess
 * comes back as a correction rather than a dead end.
 */
function suggestSlugs(catalog: TemplateCatalog, slug: string): string[] {
  const needle = slug.toLowerCase();
  const prefix = needle.slice(0, 3);

  return catalog.templates
    .filter(
      (entry) =>
        entry.slug.startsWith(prefix) ||
        entry.name.toLowerCase().includes(needle) ||
        entry.slug.includes(needle)
    )
    .map((entry) => entry.slug)
    .slice(0, 8);
}

function listTool(context: ToolContext): Tool | null {
  const { fetchTemplateCatalog } = context;

  if (!fetchTemplateCatalog) return null;

  return {
    definition: {
      name: 'list_templates',
      title: 'List the editable template sites',
      description:
        'The Tabbied template sites that can be customized: finished, ' +
        'single-page brand sites built around a pattern, each downloadable as ' +
        'plain HTML or as a React (Vite) project. Returns each one with its ' +
        'palette, the patterns it uses, and how many text/image/pattern slots ' +
        'are editable. Start here when the task is "build me a site" rather ' +
        'than "pick me a pattern" - then get_template for the one you want. ' +
        'Only sites that have been annotated appear; the rest are not yet ' +
        'customizable.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'Optional substring matched against the slug and the name.',
          },
        },
        additionalProperties: false,
      },
    },
    async run(args) {
      const catalog = await fetchTemplateCatalog();
      const query =
        typeof args.query === 'string' ? args.query.trim().toLowerCase() : '';
      const matched = query
        ? catalog.templates.filter(
            (entry) =>
              entry.slug.toLowerCase().includes(query) ||
              entry.name.toLowerCase().includes(query)
          )
        : catalog.templates;

      if (matched.length === 0) {
        return {
          content: [
            json({
              matched: 0,
              total: catalog.templates.length,
              slugs: catalog.templates.map((entry) => entry.slug),
              hint: 'No name or slug contains that. Every available slug is listed above.',
            }),
          ],
        };
      }

      return {
        content: [
          json({
            matched: matched.length,
            total: catalog.templates.length,
            templates: matched.map(summarize),
          }),
        ],
      };
    },
  };
}

function getTool(context: ToolContext): Tool | null {
  const { fetchTemplateCatalog, fetchTemplate } = context;

  if (!fetchTemplateCatalog || !fetchTemplate) return null;

  return {
    definition: {
      name: 'get_template',
      title: 'Get one template site and everything editable in it',
      description:
        "A template's full editable-section spec: every text, image, and " +
        'pattern slot with its id and its current value, the brand palette, ' +
        'the fonts, and the two download URLs. The slot ids are the contract - ' +
        'they exist in the downloaded markup as data-edit* attributes, so an ' +
        'id from this response is directly greppable in the files you ' +
        'download. Includes usage notes for editing each format.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            description: 'Template slug, from list_templates.',
          },
        },
        required: ['slug'],
        additionalProperties: false,
      },
    },
    async run(args) {
      const slug = typeof args.slug === 'string' ? args.slug.trim() : '';

      if (!slug) return toolError('get_template needs a `slug`.');

      const catalog = await fetchTemplateCatalog();
      const entry = catalog.templates.find(
        (candidate) => candidate.slug === slug
      );

      if (!entry) {
        const suggestions = suggestSlugs(catalog, slug);

        return toolError(
          `No editable template "${slug}". ` +
            (suggestions.length > 0
              ? `Did you mean: ${suggestions.join(', ')}?`
              : 'Call list_templates for the available slugs.')
        );
      }

      let spec: TemplateSpec;

      try {
        spec = await fetchTemplate(slug);
      } catch (error) {
        return toolError(
          `Could not load the spec for "${slug}" (${
            error instanceof Error ? error.message : String(error)
          }).`
        );
      }

      const downloads = {
        html: `https://tabbied.com${entry.downloads.html}`,
        react: `https://tabbied.com${entry.downloads.react}`,
      };

      return {
        content: [
          json({
            ...spec,
            url: `https://tabbied.com${entry.href}`,
            downloads,
            usage: {
              html: USAGE.html.replace('<downloads.html>', downloads.html),
              react: USAGE.react.replace('<downloads.react>', downloads.react),
              colors: USAGE.colors,
              text: USAGE.text,
              programmatic: USAGE.programmatic,
            },
          }),
        ],
      };
    },
  };
}

/** The template tools, dropped when the host cannot resolve their data. */
export function templateTools(context: ToolContext): Tool[] {
  return [listTool(context), getTool(context)].filter(
    (tool): tool is Tool => tool !== null
  );
}
