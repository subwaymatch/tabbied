// "Shuffle patterns": a new design for every pattern field on the page.
//
// Pure, so the choice can be tested and so the same function draws for the
// customizer and for anything that later wants a page re-patterned without a
// person. The randomness is injected for the same reason.
import type { PatternEdit, PatternSlot } from 'tabbied-templates';
import type { DesignChoice } from './designCatalog';

/** The design a field draws now: the document's swap, or the authored one. */
export const designOn = (slot: PatternSlot, edit?: PatternEdit): string =>
  edit?.slug ?? slot.config.slug;

/** Four base-36 characters, the shape the pattern editor's seeds have. */
export const randomSeed = (random: () => number = Math.random): string =>
  Array.from({ length: 4 }, () => Math.floor(random() * 36).toString(36)).join('');

/**
 * Draw a new design for each field, keeping the page's character.
 *
 * A field is drawn from the designs of the same density as the one it has
 * now - a hero backdrop that was busy stays busy, a quiet band stays quiet -
 * and no design is used twice on one page while the library still has
 * another to offer. Every field also gets a fresh seed, so a design the page
 * already had somewhere is still a new arrangement. The result names every
 * field, which is what lets a save carry the whole set at once.
 */
export function shuffleDesigns(
  slots: readonly PatternSlot[],
  current: Record<string, PatternEdit> | undefined,
  designs: readonly DesignChoice[],
  random: () => number = Math.random
): Record<string, PatternEdit> {
  const bySlug = new Map(designs.map((design) => [design.slug, design]));
  const taken = new Set(slots.map((slot) => designOn(slot, current?.[slot.id])));
  const next: Record<string, PatternEdit> = {};

  for (const slot of slots) {
    const now = designOn(slot, current?.[slot.id]);
    const density = bySlug.get(now)?.density;

    const pool = (
      density ? designs.filter((design) => design.density === density) : designs
    ).filter((design) => design.slug !== now && !taken.has(design.slug));
    const fallback = designs.filter((design) => design.slug !== now);
    const choices = pool.length > 0 ? pool : fallback.length > 0 ? fallback : designs;

    const chosen = choices[Math.min(choices.length - 1, Math.floor(random() * choices.length))];

    if (!chosen) continue;

    taken.add(chosen.slug);
    next[slot.id] = { slug: chosen.slug, seed: randomSeed(random) };
  }

  return next;
}

/** True when any field draws something other than what the template authored. */
export const patternsChanged = (
  slots: readonly PatternSlot[],
  current: Record<string, PatternEdit> | undefined
): boolean =>
  slots.some((slot) => {
    const edit = current?.[slot.id];

    if (!edit) return false;

    const swapped = edit.slug != null && edit.slug !== slot.config.slug;
    const reseeded = edit.seed != null && edit.seed !== slot.config.seed;

    return swapped || reseeded;
  });
