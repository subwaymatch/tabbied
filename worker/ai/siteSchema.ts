import { z } from 'zod';
import { isTextSlot, type TemplateSpec, type TextSlot } from 'tabbied-templates';

// The response schema for a full document, built from the template's spec.
//
// Same move as the slug enum in schema.ts, one level up: the *keys* the model
// may write are exactly the text slots this template has, every one of them
// required, nothing else admitted. An invented slot cannot survive validation,
// and a slot the model forgot is a schema failure rather than a headline that
// silently stays the plant shop's. `maxLength` mirrors each slot's soft budget
// so the model is told the size of the hole it is filling.

/** How much of the current value the model sees, per slot. Enough to know what kind of thing it is. */
const CURRENT_VALUE_PREVIEW = 160;

export type SiteSlot = Pick<TextSlot, 'id' | 'value' | 'format' | 'label' | 'maxChars' | 'multiline'>;

export const siteSlots = (spec: TemplateSpec): SiteSlot[] =>
  spec.slots.filter(isTextSlot).map(({ id, value, format, label, maxChars, multiline }) => ({
    id,
    value,
    format,
    label,
    maxChars,
    multiline,
  }));

const describe = (slot: SiteSlot): string => {
  const parts = [slot.label ?? slot.id];

  if (slot.maxChars) parts.push(`up to ${slot.maxChars} characters`);
  if (slot.format === 'emphasis') parts.push('may wrap one phrase in {em}...{/em}');

  return parts.join('; ');
};

/** Strict JSON Schema for the upstream: every slot required, no extras. */
export const siteJsonSchema = (slots: SiteSlot[]) => ({
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    text: {
      type: 'object',
      additionalProperties: false,
      required: slots.map((slot) => slot.id),
      properties: Object.fromEntries(
        slots.map((slot) => [
          slot.id,
          {
            type: 'string',
            ...(slot.maxChars ? { maxLength: slot.maxChars } : {}),
            description: describe(slot),
          },
        ])
      ),
    },
  },
});

/** The same contract, for validating what came back. */
export const buildSiteValidator = (slots: SiteSlot[]) =>
  z.object({
    text: z
      .object(Object.fromEntries(slots.map((slot) => [slot.id, z.string().min(1)])))
      .strict(),
  });

export type SitePayload = z.infer<ReturnType<typeof buildSiteValidator>>;

/** One line per slot for the prompt: id, what it is, how big, what it says now. */
export const slotLine = (slot: SiteSlot): string => {
  const current = slot.value.replace(/\s+/g, ' ').trim();
  const preview =
    current.length > CURRENT_VALUE_PREVIEW ? `${current.slice(0, CURRENT_VALUE_PREVIEW)}...` : current;

  return `- ${slot.id} · ${describe(slot)} · now: "${preview}"`;
};

// A revision is a *diff*. Asking for the whole document again to change one
// sentence would spend the whole document's tokens and, worse, invite the
// model to quietly rewrite what the person had kept. So the answer is a list
// of (slot, new value) pairs against the same closed set of ids, plus an
// optional palette and a one-line note saying what was done.

export const reviseJsonSchema = (slots: SiteSlot[]) => ({
  type: 'object',
  additionalProperties: false,
  required: ['changes', 'palette', 'note'],
  properties: {
    changes: {
      type: 'array',
      maxItems: Math.max(1, slots.length),
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'value'],
        properties: {
          id: { type: 'string', enum: slots.map((slot) => slot.id) },
          value: { type: 'string' },
        },
      },
    },
    palette: {
      // Null when the colours are not what was asked about.
      anyOf: [
        { type: 'null' },
        {
          type: 'array',
          minItems: 2,
          maxItems: 6,
          items: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
        },
      ],
      description: 'Background first, then inks; null unless the request was about colours.',
    },
    note: {
      type: 'string',
      maxLength: 200,
      description: 'One sentence to the person: what you changed.',
    },
  },
});

export const buildReviseValidator = (slots: SiteSlot[]) => {
  const ids = slots.map((slot) => slot.id) as [string, ...string[]];

  return z.object({
    changes: z.array(z.object({ id: z.enum(ids), value: z.string() })),
    palette: z.array(z.string()).min(2).max(6).nullable(),
    note: z.string().max(200),
  });
};

export type RevisePayload = z.infer<ReturnType<typeof buildReviseValidator>>;
