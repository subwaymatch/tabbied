// The D1 schema, and the source of truth for it: migrations under
// worker/migrations/ are emitted from this file by `npm run db:generate`, never
// hand-written.
//
// Two halves. The first four tables are better-auth's own - their *property*
// names are the contract (the Drizzle adapter looks up `schema.user.email` by
// better-auth's field name, so those may not be renamed), while the SQL column
// names underneath are ordinary snake_case. Run
// `node -e "import('@better-auth/core/db').then(m => console.log(m.getAuthTables({})))"`
// after a better-auth upgrade: a field added upstream is a migration here.
//
// The rest are Studio's. Dates are stored as unix seconds (SQLite has no date
// type); Drizzle's `timestamp` mode hands JS Dates to both sides of that.
import { sql } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const createdAt = () =>
  integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`);

// ── better-auth ─────────────────────────────────────────────────────────────

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  // The admin plugin's four, transcribed from getAuthTables({ plugins:
  // [admin()] }). `role` is what the /api/admin gate reads; the ban fields are
  // what better-auth's own ban-user endpoint writes and its sign-in reads.
  role: text('role'),
  banned: integer('banned', { mode: 'boolean' }),
  banReason: text('ban_reason'),
  banExpires: integer('ban_expires', { mode: 'timestamp' }),
});

export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: createdAt(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    /** Admin plugin: set while an admin is signed in as someone else. */
    impersonatedBy: text('impersonated_by'),
  },
  (table) => [index('session_user_id_idx').on(table.userId)]
);

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    // Required since better-auth 1.7; a social account's token issuer.
    issuer: text('issuer').notNull(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [index('account_user_id_idx').on(table.userId)]
);

/**
 * better-auth's own rate limiting, over its credential endpoints. Storage is
 * set to 'database' rather than the default in-memory map, which is per-isolate
 * and so counts a distributed brute force as a handful of separate attempts.
 */
export const rateLimit = sqliteTable('rateLimit', {
  id: text('id').primaryKey(),
  key: text('key').notNull(),
  count: integer('count').notNull(),
  lastRequest: integer('last_request').notNull(),
});

export const verification = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: createdAt(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);

// ── Studio ──────────────────────────────────────────────────────────────────

/**
 * One answered description. Immutable once written, with a single declared
 * exception: `result` is patched to attach a generated image to a direction
 * that had none (see routes/studio.ts). The id is the capability - 128 bits of
 * randomness, and holding it is what grants read access to a shared link - so
 * it is never derived from the user or the text.
 */
export const generation = sqliteTable(
  'generation',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    /** The validated directions document, as JSON. */
    result: text('result').notNull(),
    /** 'ai' | 'matched-fallback' - how the three were actually chosen. */
    source: text('source').notNull(),
    model: text('model').notNull(),
    /**
     * The Responses API turn this document came from, to be quoted as
     * `previous_response_id` when a revision continues it. Nullable and must
     * stay so: a matched answer has no turn, and an upstream that does not
     * store responses returns no id - a revision then restates the document
     * instead of chaining, which is a cost difference and not a failure.
     * Upstream retention is finite, so treat a stale id as a cache miss.
     */
    responseId: text('response_id'),
    createdAt: createdAt(),
  },
  (table) => [index('generation_user_created_idx').on(table.userId, table.createdAt)]
);

/**
 * A site: one direction a person chose to make, and the thing "Your sites"
 * lists. Distinct from a generation because a generation holds three
 * directions and a person may make more than one of them.
 *
 * The template is *pinned* here, not looked up. `specVersion` and
 * `templateHash` record the editable spec and the packaged HTML the site was
 * authored against, so that when a template is later re-packaged with different
 * slots the difference is detected and said, rather than an old document being
 * silently misapplied to a page it no longer describes.
 */
export const site = sqliteTable(
  'site',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    generationId: text('generation_id')
      .notNull()
      .references(() => generation.id, { onDelete: 'cascade' }),
    /** Which of the generation's three directions this is. */
    directionIndex: integer('direction_index').notNull(),
    /** The template slug, denormalised so a listing needs no join. */
    slug: text('slug').notNull(),
    /** The brand name at creation - the listing's title. */
    title: text('title').notNull(),
    specVersion: integer('spec_version').notNull(),
    /** SHA-256 of the packaged index.html the first revision was authored for. */
    templateHash: text('template_hash').notNull(),
    createdAt: createdAt(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index('site_user_updated_idx').on(table.userId, table.updatedAt),
    index('site_generation_idx').on(table.generationId),
  ]
);

/**
 * One version of a site's edits document. Append-only: a conversational edit
 * or a manual one writes revision n+1 rather than overwriting, which is what
 * makes "go back" possible and what lets a revision quote the turn it came from.
 */
export const revision = sqliteTable(
  'revision',
  {
    id: text('id').primaryKey(),
    siteId: text('site_id')
      .notNull()
      .references(() => site.id, { onDelete: 'cascade' }),
    /** 1-based, unique per site. */
    n: integer('n').notNull(),
    /** The edits document (tabbied-templates `EditsDocument`), as JSON. */
    edits: text('edits').notNull(),
    /** What the person asked for, when this revision came from a request. */
    instruction: text('instruction'),
    /**
     * 'ai' | 'manual' | 'fallback' - how the document changed. A fallback is
     * the three-string rebrand, written when the model could not hold the
     * full-document contract; the page says so.
     */
    source: text('source').notNull(),
    model: text('model').notNull(),
    /** Same contract as generation.responseId: nullable, and stale is a miss. */
    responseId: text('response_id'),
    createdAt: createdAt(),
  },
  (table) => [index('revision_site_n_idx').on(table.siteId, table.n)]
);

/**
 * The spend ledger. Read before every upstream call (today's totals against
 * the cap) and written after, from the response's own usage numbers - so the
 * index that matters is (user, createdAt), which is exactly the daily query.
 */
export const aiUsage = sqliteTable(
  'ai_usage',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    /** 'directions' | 'direction-image' - capped separately. */
    endpoint: text('endpoint').notNull(),
    model: text('model').notNull(),
    promptTokens: integer('prompt_tokens').notNull().default(0),
    completionTokens: integer('completion_tokens').notNull().default(0),
    imageCount: integer('image_count').notNull().default(0),
    costEstimate: real('cost_estimate').notNull().default(0),
    createdAt: createdAt(),
  },
  (table) => [index('ai_usage_user_created_idx').on(table.userId, table.createdAt)]
);

/**
 * Studio's own burst counters, one row per (user, endpoint).
 *
 * These were on KV, which was wrong in a way worth recording: KV allows one
 * write per second to a key and *throws* on the second, so a client sending
 * two requests in a second - precisely the burst this exists to catch - turned
 * the intended 429 into a 500. It also has no compare-and-set, so the count
 * could only ever be approximate.
 *
 * In D1 the increment is a single atomic statement (see lib/ratelimit.ts) and
 * the count is exact. The row set does not grow without bound either: a window
 * rollover resets the existing row rather than inserting a new one, so this
 * table holds at most one row per user per endpoint.
 */
export const rateWindow = sqliteTable('rate_window', {
  /** "<endpoint>:<userId>" - the caller composes it. */
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  /** When the current window ends, as unix seconds. */
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

/**
 * Verification and reset mail in development, where no provider is configured.
 * Was KV; moved here so the Worker needs one datastore rather than two. Rows
 * are overwritten per address and are never written in production - the mailer
 * throws there instead, because a silently swallowed verification strands the
 * account.
 */
export const devMail = sqliteTable('dev_mail', {
  email: text('email').primaryKey(),
  subject: text('subject').notNull(),
  url: text('url').notNull(),
  body: text('body').notNull(),
  createdAt: createdAt(),
});

/** A file in R2 under up/<userId>/<uuid>. The bytes never touch D1. */
export const upload = sqliteTable(
  'upload',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    key: text('key').notNull().unique(),
    contentType: text('content_type').notNull(),
    bytes: integer('bytes').notNull(),
    /** What the person said the picture shows, for a later editing session. */
    note: text('note'),
    createdAt: createdAt(),
  },
  (table) => [index('upload_user_idx').on(table.userId)]
);
