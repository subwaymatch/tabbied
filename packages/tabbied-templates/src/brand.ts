// Brand copy: the three strings every small-business site needs, and the
// mapping from them onto a particular template's slots.
//
// A template spec describes slots by *id*, and those ids are local to the page
// that declares them - `brand.name` on the five shared TemplateSite pages,
// `bar.mark` or `colophon.colophonMark` on the bespoke ones, because 52 of
// them were annotated by codemod from whatever the component happened to be
// called. So an id is not something a caller can address a template by.
//
// A *role* is. `data-edit-copy="brandName"` marks the slot that holds the
// business's name whatever the surrounding component is named, the generator
// carries it into the spec, and a caller that has three strings and no idea
// which template it is talking to can place them. That is the whole of what
// this module does; everything downstream is `planEdits`.
//
// Why only three: they are the three a generated direction actually authors
// (worker/ai/schema.ts), and they are the three that are unambiguous on every
// template. A body-copy or section-heading role would have to pick between a
// dozen candidates per page and would be guessing.
import { isHexColor } from './color.js';
import { MIN_PALETTE_COLORS } from './plan.js';
import { isTextSlot } from './spec.js';
import type { CopyRole, EditsDocument, TemplateSpec, TextSlot } from './spec.js';

/** The roles a template may declare, in the order an editor should show them. */
export const COPY_ROLES: readonly CopyRole[] = [
  'brandName',
  'headline',
  'tagline',
];

const isCopyRole = (value: string): value is CopyRole =>
  (COPY_ROLES as readonly string[]).includes(value);

/** Narrow an attribute value to a role, or `undefined` if it names none. */
export const parseCopyRole = (value: string | undefined): CopyRole | undefined =>
  value != null && isCopyRole(value) ? value : undefined;

/**
 * Every text slot carrying each role.
 *
 * A list rather than one slot per role, for the same reason `applyPlan`
 * queries all elements for an id: a template may legitimately name two
 * separate slots as the headline (a hero and a repeated banner), and both
 * should move together. Roles a template does not declare are simply absent.
 */
export function copySlots(spec: TemplateSpec): Partial<Record<CopyRole, TextSlot[]>> {
  const found: Partial<Record<CopyRole, TextSlot[]>> = {};

  for (const slot of spec.slots) {
    if (!isTextSlot(slot) || !slot.role) continue;

    (found[slot.role] ??= []).push(slot);
  }

  return found;
}

/** Which roles this template can actually take copy for. */
export const declaredCopyRoles = (spec: TemplateSpec): CopyRole[] =>
  COPY_ROLES.filter((role) => (copySlots(spec)[role]?.length ?? 0) > 0);

/**
 * True when a template can be rebranded at all - it names the business
 * somewhere. A page with no `brandName` slot would render a generated
 * direction under the template's own name, which is the failure this exists to
 * let a caller avoid rather than discover in a screenshot.
 */
export const supportsBrandCopy = (spec: TemplateSpec): boolean =>
  (copySlots(spec).brandName?.length ?? 0) > 0;

/** The strings a caller has. Every field optional - a partial edit is valid. */
export type BrandCopy = Partial<Record<CopyRole, string>>;

export type BrandDirection = {
  copy?: BrandCopy | null;
  /** Brand palette, background first. Ignored unless it is usable. */
  palette?: string[] | null;
};

const usablePalette = (palette: string[] | null | undefined): boolean =>
  Array.isArray(palette) &&
  palette.length >= MIN_PALETTE_COLORS &&
  palette.every((color) => isHexColor(color));

/**
 * Turn a brand direction into an edits document for one template.
 *
 * Total and lossy by design: a role the template does not declare is dropped
 * rather than reported, because the caller asking for a rebrand did not choose
 * the template's annotations and cannot act on the complaint. What it *can*
 * act on is `declaredCopyRoles`, ahead of time. A palette that would fail
 * `planEdits` is dropped for the same reason - the template keeps its own,
 * which is a working page rather than an error.
 */
export function directionToEdits(
  spec: TemplateSpec,
  direction: BrandDirection
): EditsDocument {
  const slots = copySlots(spec);
  const text: Record<string, string> = {};

  for (const role of COPY_ROLES) {
    const value = direction.copy?.[role];

    if (typeof value !== 'string' || value.trim().length === 0) continue;

    for (const slot of slots[role] ?? []) {
      text[slot.id] = value;
    }
  }

  const document: EditsDocument = {
    specVersion: spec.specVersion,
    slug: spec.site.slug,
    edits: {},
  };

  if (Object.keys(text).length > 0) document.edits.text = text;
  if (usablePalette(direction.palette)) {
    document.edits.palette = direction.palette as string[];
  }

  return document;
}
