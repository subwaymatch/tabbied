import { Hono } from 'hono';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod';
import {
  directionToEdits,
  hasErrors,
  isImageSlot,
  planEdits,
  type EditsDocument,
} from 'tabbied-templates';
import type {
  SiteDocument,
  SiteSummary,
  StoredResult,
  StoredRevision,
} from '../../lib/studioDocument';
import * as schema from '../db/schema';
import { generation, revision, site, upload } from '../db/schema';
import type { Env } from '../env';
import {
  generateImage,
  respondJson,
  hasUpstream,
  UpstreamError,
  type ReferenceImage,
} from '../ai/client';
import {
  reviseSystemPrompt,
  reviseUserPrompt,
  siteImagePrompt,
  siteSystemPrompt,
  siteUserPrompt,
} from '../ai/prompt';
import {
  buildReviseValidator,
  buildSiteValidator,
  reviseJsonSchema,
  siteJsonSchema,
  siteSlots,
} from '../ai/siteSchema';
import { ensurePalette } from '../lib/palette';
import { checkQuota, recordUsage } from '../lib/quota';
import { consume } from '../lib/ratelimit';
import { requireUser } from '../lib/session';
import { hashText, loadPackagedHtml, loadTemplateSpec } from '../lib/templateAssets';

// A site is a direction someone chose to make: the full document - every text
// slot on the template rewritten for the business - pinned to the template it
// was written against, with a revision history from the first draft on.
//
// The directions call picks three from a scored dozen and writes three
// strings each; this is the second, dearer stage, and it is behind a click for
// that reason. Nothing here reaches the 52 unannotated pages any differently
// from the five annotated ones: the document is keyed by slot id, and every
// template has those.

const BURST = {
  make: { max: 3, windowSeconds: 60 },
  image: { max: 4, windowSeconds: 60 },
  revise: { max: 6, windowSeconds: 60 },
};

/** How many reference pictures one image call may take. */
const MAX_REFERENCES = 4;

/** Over-estimate for an upstream that omitted `usage`, as in studio.ts. */
const ESTIMATED_TOKENS = { prompt: 8_000, completion: 4_000 };

const requestSchema = z.object({
  generationId: z.string().min(8).max(64),
  index: z.number().int().min(0).max(2),
});

type Db = ReturnType<typeof drizzle<typeof schema>>;

/** The site row, its generation's description and result, or null. */
async function loadSite(db: Db, id: string) {
  const [row] = await db
    .select({ site, description: generation.description, result: generation.result })
    .from(site)
    .innerJoin(generation, eq(generation.id, site.generationId))
    .where(eq(site.id, id))
    .limit(1);

  return row ?? null;
}

/** The newest revision, which every write builds on. */
async function latestRevision(db: Db, siteId: string) {
  const [row] = await db
    .select()
    .from(revision)
    .where(eq(revision.siteId, siteId))
    .orderBy(desc(revision.n))
    .limit(1);

  return row ?? null;
}

/**
 * Append revision n+1 and touch the site, in that order - the site's
 * updatedAt is what the listing sorts on, so a write that changed the
 * document has to move it.
 */
async function appendRevision(
  db: Db,
  options: {
    siteId: string;
    n: number;
    edits: EditsDocument;
    instruction: string | null;
    source: 'ai' | 'manual' | 'fallback';
    model: string;
    responseId: string | null;
  }
) {
  const now = new Date();

  await db.insert(revision).values({
    id: newId(),
    siteId: options.siteId,
    n: options.n,
    edits: JSON.stringify(options.edits),
    instruction: options.instruction,
    source: options.source,
    model: options.model,
    responseId: options.responseId,
    createdAt: now,
  });
  await db.update(site).set({ updatedAt: now }).where(eq(site.id, options.siteId));

  return { n: options.n, createdAt: now };
}

/**
 * Reference pictures, by upload id, owned by this person. Someone else's
 * upload id is treated as unknown rather than as forbidden - an id is not a
 * thing to confirm the existence of.
 */
async function loadReferences(
  env: Env,
  db: Db,
  userId: string,
  ids: string[]
): Promise<ReferenceImage[] | null> {
  if (ids.length === 0) return [];

  const rows = await db
    .select({ id: upload.id, key: upload.key, contentType: upload.contentType })
    .from(upload)
    .where(and(eq(upload.userId, userId), inArray(upload.id, ids)));

  if (rows.length !== ids.length) return null;

  const objects = await Promise.all(rows.map((row) => env.MEDIA.get(row.key)));

  if (objects.some((object) => object === null)) return null;

  return Promise.all(
    objects.map(async (object, index) => ({
      bytes: await object!.arrayBuffer(),
      contentType: rows[index].contentType,
    }))
  );
}

const sites = new Hono<{ Bindings: Env }>();

const newId = () => crypto.randomUUID().replace(/-/g, '');

/**
 * The output budget scales with the page. Reasoning is spent from the same
 * cap before any text is emitted, and a 300-slot bespoke page is a long
 * answer - a cap sized for three strings comes back `incomplete` with nothing.
 */
const outputBudget = (slotCount: number) => Math.min(24_000, 3_000 + slotCount * 60);

sites.post('/', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to make a site.' }, 401);
  }

  const parsed = requestSchema.safeParse(await c.req.json().catch(() => null));

  if (!parsed.success) {
    return c.json({ error: 'Choose a direction to make.' }, 400);
  }

  const { generationId, index } = parsed.data;
  const db = drizzle(c.env.DB, { schema });

  const [row] = await db
    .select()
    .from(generation)
    .where(eq(generation.id, generationId))
    .limit(1);

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  const result = JSON.parse(row.result) as StoredResult;
  const direction = result.directions[index];

  if (!direction) {
    return c.json({ error: 'That direction is not in this set.' }, 404);
  }

  // Idempotent per (person, generation, direction): a double-click or a retry
  // lands on the site that already exists rather than spending again.
  const [existing] = await db
    .select({ id: site.id })
    .from(site)
    .where(
      and(
        eq(site.userId, userId),
        eq(site.generationId, generationId),
        eq(site.directionIndex, index)
      )
    )
    .limit(1);

  if (existing) {
    return c.json({ id: existing.id, source: 'existing' });
  }

  const burst = await consume(db, { key: `site:${userId}`, ...BURST.make });

  if (!burst.ok) {
    return c.json({ error: 'Too fast. Try again in a minute.' }, 429, {
      'retry-after': String(burst.retryAfter),
    });
  }

  const quota = await checkQuota(db, userId, 'site');

  if (!quota.ok) {
    return c.json({ error: quota.message }, 429);
  }

  const [spec, html] = await Promise.all([
    loadTemplateSpec(c.env, c.req.raw, direction.slug),
    loadPackagedHtml(c.env, c.req.raw, direction.slug),
  ]);
  const templateHash = await hashText(html);
  const slots = siteSlots(spec);

  // The three-string rebrand is both the fallback and the floor: whatever the
  // model manages, the page is at least branded.
  const floor = directionToEdits(spec, { copy: direction.copy, palette: direction.palette });

  let edits: EditsDocument = floor;
  let source: 'ai' | 'fallback' = 'fallback';
  let model = 'none';
  let responseId: string | undefined;

  if (hasUpstream(c.env) && slots.length > 0) {
    const validator = buildSiteValidator(slots);
    const instructions = siteSystemPrompt(direction, spec.site.name);
    const user = siteUserPrompt(row.description, slots);

    let usage = { promptTokens: 0, completionTokens: 0 };
    let repairNote = '';
    let previousResponseId: string | undefined;
    let done = false;

    for (let attempt = 0; attempt < 2 && !done; attempt++) {
      const chained = attempt > 0 && previousResponseId !== undefined;

      try {
        const completion = await respondJson(c.env, {
          instructions,
          input: attempt === 0 ? user : chained ? repairNote : `${user}\n\n${repairNote}`,
          schemaName: 'studio_site',
          schema: siteJsonSchema(slots),
          maxOutputTokens: outputBudget(slots.length),
          previousResponseId: chained ? previousResponseId : undefined,
        });

        model = completion.model;
        responseId = completion.responseId ?? responseId;
        previousResponseId = completion.responseId;
        usage = {
          promptTokens:
            usage.promptTokens + (completion.usage.promptTokens || ESTIMATED_TOKENS.prompt),
          completionTokens:
            usage.completionTokens +
            (completion.usage.completionTokens || ESTIMATED_TOKENS.completion),
        };

        const checked = validator.safeParse(JSON.parse(completion.content) as unknown);

        if (!checked.success) {
          repairNote =
            'Your previous answer was rejected. Fix exactly these problems:\n' +
            checked.error.issues
              .slice(0, 40)
              .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
              .join('\n');
          continue;
        }

        // The engine's own planner is the second gate - pure, so it runs here
        // with no DOM - and what it rejects is what the page would reject.
        const candidate: EditsDocument = {
          specVersion: spec.specVersion,
          slug: spec.site.slug,
          edits: { text: checked.data.text, ...(floor.edits.palette ? { palette: floor.edits.palette } : {}) },
        };
        const plan = planEdits(spec, candidate);

        if (hasErrors(plan.problems)) {
          repairNote =
            'Your previous answer was rejected. Fix exactly these problems:\n' +
            plan.problems
              .filter((problem) => problem.level === 'error')
              .slice(0, 40)
              .map((problem) => `- ${problem.path}: ${problem.message}`)
              .join('\n');
          continue;
        }

        edits = candidate;
        source = 'ai';
        done = true;
      } catch (error) {
        if (error instanceof UpstreamError || error instanceof SyntaxError) {
          console.error(`studio/sites: ${String(error)}`);
          break;
        }
        throw error;
      }
    }

    // Recorded whether or not it produced a document: a failed call still
    // spent tokens.
    await recordUsage(db, {
      userId,
      endpoint: 'site',
      model,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
    });
  }

  const id = newId();
  const now = new Date();

  await db.insert(site).values({
    id,
    userId,
    generationId,
    directionIndex: index,
    slug: direction.slug,
    title: direction.copy?.brandName ?? direction.name,
    specVersion: spec.specVersion,
    templateHash,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(revision).values({
    id: newId(),
    siteId: id,
    n: 1,
    edits: JSON.stringify(edits),
    instruction: null,
    source,
    model,
    responseId: source === 'ai' ? (responseId ?? null) : null,
    createdAt: now,
  });

  return c.json({ id, source });
});

/** The signed-in person's own sites, newest first. Session-scoped, never by id. */
sites.get('/', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to see your sites.' }, 401);
  }

  const db = drizzle(c.env.DB, { schema });

  const rows = await db
    .select({
      id: site.id,
      slug: site.slug,
      title: site.title,
      generationId: site.generationId,
      directionIndex: site.directionIndex,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
      result: generation.result,
      revisions: sql<number>`(select count(*) from ${revision} where ${revision.siteId} = ${site.id})`,
    })
    .from(site)
    .innerJoin(generation, eq(generation.id, site.generationId))
    .where(eq(site.userId, userId))
    .orderBy(desc(site.updatedAt))
    .limit(100);

  const summaries: SiteSummary[] = rows.map((row) => {
    const direction = (JSON.parse(row.result) as StoredResult).directions[row.directionIndex];

    return {
      id: row.id,
      slug: row.slug,
      templateName: direction?.name ?? row.slug,
      title: row.title,
      stance: direction?.stance ?? '',
      palette: direction?.palette ?? [],
      revisions: Number(row.revisions),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });

  return c.json({ sites: summaries });
});

/**
 * One site with its latest revision. Unauthenticated by design, like a
 * generation: the 128-bit id is the capability. The template's current hash
 * is compared to the pinned one so drift is reported, not discovered.
 */
sites.get('/:id', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const row = await loadSite(db, c.req.param('id'));

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  const latest = await latestRevision(db, row.site.id);

  if (!latest) {
    return c.json({ error: 'Not found' }, 404);
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(revision)
    .where(eq(revision.siteId, row.site.id));

  const direction = (JSON.parse(row.result) as StoredResult).directions[row.site.directionIndex];

  // A missing package is drift too - the template was retired.
  const currentHash = await loadPackagedHtml(c.env, c.req.raw, row.site.slug)
    .then(hashText)
    .catch(() => null);

  const stored: StoredRevision = {
    n: latest.n,
    edits: JSON.parse(latest.edits) as EditsDocument,
    instruction: latest.instruction,
    source: latest.source as StoredRevision['source'],
    model: latest.model,
    createdAt: latest.createdAt,
  };

  // Reads are by capability; whether the reader may *write* is a session
  // question, answered here so the workspace knows to show its editor.
  const viewer = await requireUser(c.env, c.req.raw.headers);

  const body: SiteDocument = {
    mine: viewer !== null && viewer === row.site.userId,
    id: row.site.id,
    slug: row.site.slug,
    templateName: direction?.name ?? row.site.slug,
    title: row.site.title,
    stance: direction?.stance ?? '',
    palette: direction?.palette ?? [],
    revisions: Number(count),
    createdAt: row.site.createdAt,
    updatedAt: row.site.updatedAt,
    generationId: row.site.generationId,
    directionIndex: row.site.directionIndex,
    description: row.description,
    specVersion: row.site.specVersion,
    templateChanged: currentHash !== row.site.templateHash,
    latest: stored,
  };

  return c.json(body);
});

const imageRequestSchema = z.object({
  slot: z.string().min(1).max(120),
  referenceIds: z.array(z.string().min(8).max(64)).max(MAX_REFERENCES).optional(),
});

/**
 * A picture for one of the site's image slots, on request, written as the
 * next revision. Transparent, so it sits on the template's own ground the way
 * the template's own cut-outs do. Not idempotent: asking again is asking for
 * a different picture, and the old one stays in the previous revision.
 */
sites.post('/:id/images', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to add imagery.' }, 401);
  }

  const parsed = imageRequestSchema.safeParse(await c.req.json().catch(() => null));

  if (!parsed.success) {
    return c.json({ error: 'Choose an image slot.' }, 400);
  }

  const db = drizzle(c.env.DB, { schema });
  const row = await loadSite(db, c.req.param('id'));

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  if (row.site.userId !== userId) {
    return c.json({ error: 'Not yours to change.' }, 403);
  }

  const latest = await latestRevision(db, row.site.id);

  if (!latest) {
    return c.json({ error: 'Not found' }, 404);
  }

  const spec = await loadTemplateSpec(c.env, c.req.raw, row.site.slug);
  const slot = spec.slots.find((candidate) => isImageSlot(candidate) && candidate.id === parsed.data.slot);

  if (!slot || !isImageSlot(slot)) {
    return c.json({ error: 'That template has no such image slot.' }, 404);
  }

  if (!hasUpstream(c.env)) {
    return c.json({ error: 'Image generation is not configured.' }, 503);
  }

  const references = await loadReferences(c.env, db, userId, parsed.data.referenceIds ?? []);

  if (!references) {
    return c.json({ error: 'One of those reference pictures is not available.' }, 404);
  }

  const burst = await consume(db, { key: `simg:${userId}`, ...BURST.image });

  if (!burst.ok) {
    return c.json({ error: 'Too fast. Try again in a minute.' }, 429, {
      'retry-after': String(burst.retryAfter),
    });
  }

  const quota = await checkQuota(db, userId, 'site-image');

  if (!quota.ok) {
    return c.json({ error: quota.message }, 429);
  }

  const direction = (JSON.parse(row.result) as StoredResult).directions[row.site.directionIndex];
  const current = JSON.parse(latest.edits) as EditsDocument;
  const palette = current.edits.palette ?? direction?.palette ?? spec.palette.colors;

  let image;

  try {
    image = await generateImage(c.env, {
      prompt: siteImagePrompt({
        description: row.description,
        stance: direction?.stance ?? '',
        why: direction?.why ?? '',
        palette,
        slotAlt: slot.alt,
        references: references.length,
      }),
      transparent: true,
      references,
    });
  } catch (error) {
    if (error instanceof UpstreamError) {
      // Still charged: the call was made.
      await recordUsage(db, {
        userId,
        endpoint: 'site-image',
        model: c.env.AI_IMAGE_MODEL,
        imageCount: 1,
      });
      console.error(`studio/sites/images: ${String(error)}`);

      return c.json({ error: 'Image generation failed. Try again.' }, 502);
    }
    throw error;
  }

  // Keyed by revision as well as slot, so a re-generation never overwrites the
  // bytes an earlier revision still points at.
  const key = `gen/site/${row.site.id}/${latest.n + 1}/${slot.id}.webp`;

  await c.env.MEDIA.put(key, image.bytes, { httpMetadata: { contentType: image.contentType } });

  const next: EditsDocument = {
    ...current,
    edits: {
      ...current.edits,
      images: { ...current.edits.images, [slot.id]: { src: `/api/media/${key}`, alt: slot.alt } },
    },
  };

  const written = await appendRevision(db, {
    siteId: row.site.id,
    n: latest.n + 1,
    edits: next,
    instruction: null,
    source: 'ai',
    model: image.model,
    responseId: null,
  });

  await recordUsage(db, { userId, endpoint: 'site-image', model: image.model, imageCount: 1 });

  return c.json({ key, slot: slot.id, revision: written.n });
});

const revisionRequestSchema = z.object({
  edits: z.object({
    specVersion: z.number().int(),
    slug: z.string().min(1),
    edits: z.object({
      text: z.record(z.string(), z.string()).optional(),
      images: z.record(z.string(), z.object({ src: z.string().min(1), alt: z.string().optional() })).optional(),
      patterns: z
        .record(
          z.string(),
          z.object({
            slug: z.string().optional(),
            palette: z.array(z.string()).optional(),
            options: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
            seed: z.string().optional(),
          })
        )
        .optional(),
      palette: z.array(z.string()).optional(),
    }),
  }),
});

/**
 * A manual revision: the editor's document, whole. Validated by the same
 * planner the page applies it with, so what is stored is what will render -
 * a document the engine would reject is refused here with its reasons rather
 * than saved and discovered as a blank slot.
 */
sites.post('/:id/revisions', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to save.' }, 401);
  }

  const parsed = revisionRequestSchema.safeParse(await c.req.json().catch(() => null));

  if (!parsed.success) {
    return c.json({ error: 'That is not an edits document.' }, 400);
  }

  const db = drizzle(c.env.DB, { schema });
  const row = await loadSite(db, c.req.param('id'));

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  if (row.site.userId !== userId) {
    return c.json({ error: 'Not yours to change.' }, 403);
  }

  const latest = await latestRevision(db, row.site.id);

  if (!latest) {
    return c.json({ error: 'Not found' }, 404);
  }

  const spec = await loadTemplateSpec(c.env, c.req.raw, row.site.slug);
  const edits = parsed.data.edits as EditsDocument;

  if (edits.slug !== row.site.slug) {
    return c.json({ error: 'That document is for a different template.' }, 400);
  }

  // An image src may only point at this site's own media or the template's
  // own files: the document is applied into a page, and a src is a fetch.
  const foreign = Object.values(edits.edits.images ?? {}).find(
    (image) => !(image.src.startsWith('/api/media/gen/site/') || image.src.startsWith('./'))
  );

  if (foreign) {
    return c.json({ error: 'Images must come from this site or its template.' }, 400);
  }

  const plan = planEdits(spec, edits);

  if (hasErrors(plan.problems)) {
    return c.json(
      {
        error: 'Some of that could not be placed on the template.',
        problems: plan.problems.filter((problem) => problem.level === 'error'),
      },
      422
    );
  }

  const written = await appendRevision(db, {
    siteId: row.site.id,
    n: latest.n + 1,
    edits,
    instruction: null,
    source: 'manual',
    model: 'none',
    responseId: null,
  });

  return c.json({ revision: written.n });
});

/** Every revision, newest first - the history the workspace shows. */
sites.get('/:id/revisions', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const row = await loadSite(db, c.req.param('id'));

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  const rows = await db
    .select({
      n: revision.n,
      instruction: revision.instruction,
      source: revision.source,
      model: revision.model,
      createdAt: revision.createdAt,
    })
    .from(revision)
    .where(eq(revision.siteId, row.site.id))
    .orderBy(desc(revision.n))
    .limit(200);

  return c.json({ revisions: rows });
});

/** One revision's document - what "go back" reads. */
sites.get('/:id/revisions/:n', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const n = Number(c.req.param('n'));

  if (!Number.isInteger(n) || n < 1) {
    return c.json({ error: 'Not found' }, 404);
  }

  const [row] = await db
    .select()
    .from(revision)
    .where(and(eq(revision.siteId, c.req.param('id')), eq(revision.n, n)))
    .limit(1);

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  const stored: StoredRevision = {
    n: row.n,
    edits: JSON.parse(row.edits) as EditsDocument,
    instruction: row.instruction,
    source: row.source as StoredRevision['source'],
    model: row.model,
    createdAt: row.createdAt,
  };

  return c.json(stored);
});

const reviseRequestSchema = z.object({
  instruction: z.string().trim().min(3).max(600),
});

/**
 * "Make the headline warmer." A revision by request: the model sees the page
 * as it currently reads - the person's document, not the template's - and
 * answers with a diff, which is merged, planned and stored as the next
 * revision with the request beside it.
 *
 * Continuity is used when it is there: the latest AI revision's turn is
 * quoted as `previous_response_id`, so the call carries the request alone
 * against a context that still holds the page. An upstream that stored
 * nothing gets the whole page restated, which costs more and changes nothing.
 */
sites.post('/:id/revise', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to make changes.' }, 401);
  }

  const parsed = reviseRequestSchema.safeParse(await c.req.json().catch(() => null));

  if (!parsed.success) {
    return c.json({ error: 'Say what to change, in 3-600 characters.' }, 400);
  }

  const db = drizzle(c.env.DB, { schema });
  const row = await loadSite(db, c.req.param('id'));

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  if (row.site.userId !== userId) {
    return c.json({ error: 'Not yours to change.' }, 403);
  }

  const latest = await latestRevision(db, row.site.id);

  if (!latest) {
    return c.json({ error: 'Not found' }, 404);
  }

  if (!hasUpstream(c.env)) {
    return c.json({ error: 'Conversational editing is not configured.' }, 503);
  }

  const burst = await consume(db, { key: `rev:${userId}`, ...BURST.revise });

  if (!burst.ok) {
    return c.json({ error: 'Too fast. Try again in a minute.' }, 429, {
      'retry-after': String(burst.retryAfter),
    });
  }

  const quota = await checkQuota(db, userId, 'site');

  if (!quota.ok) {
    return c.json({ error: quota.message }, 429);
  }

  const spec = await loadTemplateSpec(c.env, c.req.raw, row.site.slug);
  const current = JSON.parse(latest.edits) as EditsDocument;
  const direction = (JSON.parse(row.result) as StoredResult).directions[row.site.directionIndex];

  // The page as it reads now: the document's value where there is one, the
  // template's where there is not.
  const slots = siteSlots(spec).map((slot) => ({
    ...slot,
    value: current.edits.text?.[slot.id] ?? slot.value,
  }));
  const validator = buildReviseValidator(slots);
  const instructions = reviseSystemPrompt(direction ?? ({ stance: '', why: '' } as never), spec.site.name);
  const user = reviseUserPrompt(row.description, slots, parsed.data.instruction);
  const chainFrom = latest.source === 'ai' ? (latest.responseId ?? undefined) : undefined;

  let usage = { promptTokens: 0, completionTokens: 0 };
  let model = c.env.AI_MODEL;
  let responseId: string | undefined;
  let previousResponseId = chainFrom;
  let repairNote = '';
  let next: EditsDocument | null = null;
  let note = '';

  for (let attempt = 0; attempt < 2 && !next; attempt++) {
    // First turn: the request alone when a context exists, the whole page
    // otherwise. Repair turn: the correction alone when the rejected answer
    // stored, the whole thing again when it did not.
    const chained = previousResponseId !== undefined;
    const input =
      attempt === 0
        ? chained
          ? `The request:\n"""\n${parsed.data.instruction}\n"""`
          : user
        : chained
          ? repairNote
          : `${user}\n\n${repairNote}`;

    try {
      const completion = await respondJson(c.env, {
        instructions,
        input,
        schemaName: 'studio_revise',
        schema: reviseJsonSchema(slots),
        maxOutputTokens: 6_000,
        previousResponseId,
      });

      model = completion.model;
      responseId = completion.responseId ?? responseId;
      previousResponseId = completion.responseId ?? previousResponseId;
      usage = {
        promptTokens: usage.promptTokens + (completion.usage.promptTokens || ESTIMATED_TOKENS.prompt),
        completionTokens:
          usage.completionTokens + (completion.usage.completionTokens || ESTIMATED_TOKENS.completion),
      };

      const checked = validator.safeParse(JSON.parse(completion.content) as unknown);

      if (!checked.success) {
        repairNote =
          'Your previous answer was rejected. Fix exactly these problems:\n' +
          checked.error.issues.slice(0, 40).map((issue) => `- ${issue.path.join('.')}: ${issue.message}`).join('\n');
        continue;
      }

      const text = { ...current.edits.text };
      for (const change of checked.data.changes) text[change.id] = change.value;

      const palette = checked.data.palette
        ? ensurePalette(checked.data.palette, current.edits.palette ?? spec.palette.colors).colors
        : current.edits.palette;

      const candidate: EditsDocument = {
        ...current,
        edits: { ...current.edits, text, ...(palette ? { palette } : {}) },
      };
      const plan = planEdits(spec, candidate);

      if (hasErrors(plan.problems)) {
        repairNote =
          'Your previous answer was rejected. Fix exactly these problems:\n' +
          plan.problems
            .filter((problem) => problem.level === 'error')
            .slice(0, 40)
            .map((problem) => `- ${problem.path}: ${problem.message}`)
            .join('\n');
        continue;
      }

      next = candidate;
      note = checked.data.note;
    } catch (error) {
      if (error instanceof UpstreamError || error instanceof SyntaxError) {
        console.error(`studio/sites/revise: ${String(error)}`);
        break;
      }
      throw error;
    }
  }

  await recordUsage(db, {
    userId,
    endpoint: 'site',
    model,
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
  });

  if (!next) {
    return c.json({ error: 'The model could not make that change. Try saying it differently.' }, 502);
  }

  const written = await appendRevision(db, {
    siteId: row.site.id,
    n: latest.n + 1,
    edits: next,
    instruction: parsed.data.instruction,
    source: 'ai',
    model,
    responseId: responseId ?? null,
  });

  return c.json({ revision: written.n, note });
});

export default sites;
