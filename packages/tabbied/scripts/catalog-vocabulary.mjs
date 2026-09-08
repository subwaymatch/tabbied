// The controlled vocabulary for the catalog's design metadata.
//
// Agents filter reliably on enums and unreliably on prose - that is the whole
// reason these fields exist. So the vocabulary is closed: codegen fails on a
// value not listed here, and
// test/catalog.test.mjs pins every published entry against these sets. Add a
// term only when several designs genuinely need it, and never rename one
// casually - published catalogs are queried by these exact strings.
//
// Authoring guidance (used by the tagging pass, kept here so re-tagging stays
// consistent):
// - `tags` (2-6): what is literally visible in the preview - shapes and
//   arrangements, not interpretations.
// - `mood` (1-3): the feel of the design at a glance.
// - `density`: how busy the surface is. sparse = mostly background with
//   scattered marks; dense = ink-dominated, little breathing room.
// - `goodFor` (1-4): where the design works with no customization. Calm/sparse
//   surfaces take text well (hero-background); bold allover repeats suit
//   poster/og-image; fine dense textures suit card-texture/textile/wallpaper.

/** Visual motifs - what the design is drawn from. */
export const TAGS = [
  'arcs',
  'blocks',
  'braids',
  'checkerboard',
  'chevrons',
  'circles',
  'concentric',
  'crosses',
  'curves',
  'diagonals',
  'diamonds',
  'dots',
  'gradients',
  'grid',
  'halftone',
  'hexagons',
  'lattice',
  'leaves',
  'lines',
  'maze',
  'mosaic',
  'ovals',
  'petals',
  'quarter-circles',
  'radial',
  'rings',
  'scallops',
  'semicircles',
  'spirals',
  'squares',
  'stars',
  'steps',
  'stripes',
  'triangles',
  'waves',
  'zigzags',
];

/** The feel of the design at a glance. */
export const MOODS = [
  'bold',
  'calm',
  'elegant',
  'festive',
  'organic',
  'playful',
  'retro',
  'technical',
];

/** How busy the surface is. Exactly one per design. */
export const DENSITIES = ['sparse', 'medium', 'dense'];

/** Uses the design suits with no customization. */
export const GOOD_FOR = [
  'card-texture',
  'hero-background',
  'og-image',
  'packaging',
  'poster',
  'section-divider',
  'textile',
  'wallpaper',
];

/** Field-level shape rules, shared by codegen validation and the tests. */
export const METADATA_RULES = {
  tags: { values: TAGS, min: 2, max: 6 },
  mood: { values: MOODS, min: 1, max: 3 },
  goodFor: { values: GOOD_FOR, min: 1, max: 4 },
};

export function validateDesignMetadata(definition) {
  const errors = [];
  const { slug } = definition;

  for (const [field, rule] of Object.entries(METADATA_RULES)) {
    const value = definition[field];

    if (!Array.isArray(value)) {
      errors.push(`${slug}: "${field}" must be an array`);
      continue;
    }
    if (value.length < rule.min || value.length > rule.max) {
      errors.push(
        `${slug}: "${field}" needs ${rule.min}-${rule.max} entries, has ${value.length}`
      );
    }
    for (const entry of value) {
      if (!rule.values.includes(entry)) {
        errors.push(`${slug}: "${field}" value "${entry}" is not in the vocabulary`);
      }
    }
    if (new Set(value).size !== value.length) {
      errors.push(`${slug}: "${field}" has duplicate entries`);
    }
  }

  if (!DENSITIES.includes(definition.density)) {
    errors.push(
      `${slug}: "density" must be one of ${DENSITIES.join(' | ')}, got "${definition.density}"`
    );
  }

  return errors;
}
