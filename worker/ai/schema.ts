import { z } from 'zod';

// One schema, used three ways: it is sent upstream as JSON Schema
// (`text.format`), it validates what comes back, and its inferred type is
// what the rest of the Worker holds. An upstream that ignores `json_schema` -
// some "compatible" servers do - therefore fails at the validate step with an
// attributable error rather than leaking a half-shape into the UI.

/**
 * Copy budgets mirror the editable spec's maxChars, so a direction can later
 * become an edits document without truncation surgery.
 */
export const COPY_LIMITS = { brandName: 30, headline: 70, tagline: 90 } as const;

export const directionCopySchema = z.object({
  brandName: z.string().min(1).max(COPY_LIMITS.brandName),
  headline: z.string().min(1).max(COPY_LIMITS.headline),
  tagline: z.string().min(1).max(COPY_LIMITS.tagline),
});

export type DirectionCopy = z.infer<typeof directionCopySchema>;

/** `slug` is narrowed to the assembled candidates at request time. */
export const buildDirectionsSchema = (slugs: [string, ...string[]]) =>
  z.object({
    recommended: z.number().int().min(0).max(2),
    directions: z
      .array(
        z.object({
          slug: z.enum(slugs),
          stance: z.string().min(1).max(40),
          why: z.string().min(1).max(220),
          palette: z.array(z.string()).min(2).max(6),
          copy: directionCopySchema,
        })
      )
      .length(3),
  });

export type DirectionsPayload = z.infer<ReturnType<typeof buildDirectionsSchema>>;

/**
 * The same shape as JSON Schema for the upstream. Written by hand rather than
 * derived, because strict `text.format` wants a closed schema (every
 * property required, `additionalProperties: false`) and a generic converter
 * emits optionals that models then omit.
 */
export const directionsJsonSchema = (slugs: string[]) => ({
  type: 'object',
  additionalProperties: false,
  required: ['recommended', 'directions'],
  properties: {
    recommended: {
      type: 'integer',
      minimum: 0,
      maximum: 2,
      description: 'Index of the direction you would lead with.',
    },
    directions: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['slug', 'stance', 'why', 'palette', 'copy'],
        properties: {
          slug: {
            type: 'string',
            enum: slugs,
            description: 'Which candidate template this direction is built on.',
          },
          stance: {
            type: 'string',
            description:
              'Two or three words naming this direction, e.g. "Warm Editorial".',
          },
          why: {
            type: 'string',
            description: 'One sentence on why it suits the described business.',
          },
          palette: {
            type: 'array',
            minItems: 2,
            maxItems: 6,
            items: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
            description:
              'Background colour first, then inks. At least one ink must be clearly legible on the background.',
          },
          copy: {
            type: 'object',
            additionalProperties: false,
            required: ['brandName', 'headline', 'tagline'],
            properties: {
              brandName: { type: 'string', maxLength: COPY_LIMITS.brandName },
              headline: { type: 'string', maxLength: COPY_LIMITS.headline },
              tagline: { type: 'string', maxLength: COPY_LIMITS.tagline },
            },
          },
        },
      },
    },
  },
});

// The stored document's shape lives in lib/studioDocument.ts, shared with the
// pages that read it; re-exported here so the Worker's callers keep one import.
export type {
  DirectionCopy as StoredCopy,
  StoredDirection,
  StoredResult,
} from '../../lib/studioDocument';
