// The documents Studio stores and serves - one definition, three readers.
//
// The Worker writes these (worker/routes/studio.ts, worker/routes/sites.ts),
// the results page and the workspace read them, and worker/ai/schema.ts
// validates the model's half of them. Three copies of the same shape is how a
// field gets added to one and missed by the others, so the shape lives here.
// worker -> lib is the import direction the Worker already uses
// (lib/studioMatch.ts); lib never imports from worker/.
import type { CopyRole, EditsDocument } from 'tabbied-templates';

export type DirectionCopy = {
  brandName: string;
  headline: string;
  tagline: string;
};

/** One of the three directions a generation holds. */
export type StoredDirection = {
  slug: string;
  name: string;
  topic: string;
  patternSlug: string;
  patternName: string;
  paletteName: string;
  palette: string[];
  descriptors: string[];
  stance: string;
  why: string;
  copy: DirectionCopy | null;
  /** R2 key, once someone has asked for imagery. */
  image: string | null;
  /**
   * Which pieces of brand copy this direction's template can take, recorded
   * at write time so the stored document does not depend on today's catalog
   * to know whether its own preview can promise a rebrand. Absent on rows
   * written before this field existed, which read as "none".
   */
  copyRoles?: CopyRole[];
};

export type StoredResult = {
  specVersion: 1;
  source: 'ai' | 'matched-fallback';
  recommended: number;
  directions: StoredDirection[];
};

/** What GET /api/studio/generations/:id returns. */
export type StoredGeneration = {
  id: string;
  description: string;
  result: StoredResult;
  createdAt: string | Date;
};

/** A row in the account's history - what GET /api/studio/generations lists. */
export type GenerationSummary = {
  id: string;
  description: string;
  source: 'ai' | 'matched-fallback';
  createdAt: string | Date;
  /** How many sites were made from it. */
  sites: number;
  directions: Pick<StoredDirection, 'name' | 'stance' | 'palette'>[];
};

// ---- sites ----------------------------------------------------------------

/** 'fallback' is the three-string rebrand, written when the model could not hold the full contract. */
export type RevisionSource = 'ai' | 'manual' | 'fallback';

/** One version of a site's document. */
export type StoredRevision = {
  n: number;
  edits: EditsDocument;
  instruction: string | null;
  source: RevisionSource;
  model: string;
  createdAt: string | Date;
};

/** A row in "Your sites". */
export type SiteSummary = {
  id: string;
  slug: string;
  templateName: string;
  title: string;
  stance: string;
  palette: string[];
  revisions: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};

/** What GET /api/studio/sites/:id returns - a site with its latest revision. */
export type SiteDocument = SiteSummary & {
  /** The viewer is the person who made it - the editor shows only then. */
  mine: boolean;
  generationId: string;
  directionIndex: number;
  description: string;
  specVersion: number;
  /**
   * True when the packaged template no longer matches the one this site was
   * authored against. The document still applies - the engine reports any slot
   * it cannot find - but the person should hear it from the page, not from a
   * missing headline.
   */
  templateChanged: boolean;
  latest: StoredRevision;
};
