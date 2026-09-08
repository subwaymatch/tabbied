// Server identity and the instructions clients hand to the model.
//
// VERSION is a literal rather than a package.json read because this module is
// bundled into a Cloudflare Worker, which has no filesystem. test/info.test.mjs
// pins it to package.json so the two can't drift.
export const SERVER_NAME = 'tabbied';
export const VERSION = '0.2.0';

/**
 * Shown to the model as a preamble. It buys three things no tool description
 * can, because they are properties of the *set* rather than of one call: that
 * slugs cannot be guessed, that the previews are the ground truth a choice
 * should rest on, and the sizing rule that is the single most common way a
 * correct-looking integration renders as nothing.
 */
export const INSTRUCTIONS = `Tabbied is a catalog of generative patterns (css-doodle) usable as backgrounds, textures, posters, and exported SVG/PNG assets.

Designs are addressed by slug, and slugs are opaque - "cleat", "karst", "radius" say nothing about what they look like. Never guess one: call search_designs, which filters on a closed vocabulary of motifs, moods, density, and intended use.

Metadata narrows the field; it does not settle it. These are pictures, so call preview_design on your shortlist and look before you commit. Choosing off tags alone is the main way this goes wrong.

When you write integration code, remember a pattern has no intrinsic size: it fills its parent and collapses to nothing in a parent that sizes to content. Pass height or aspectRatio unless the parent is definitely sized. get_docs has the full API contract and recipes.`;
