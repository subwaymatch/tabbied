// The editable-section contract for a Tabbied template site.
//
// A template site is a finished, hand-designed page. This spec describes the
// part of it that is *brand* rather than *layout* - the headline, the
// photographs, the colours, the pattern fields - so that a person in the
// editor, a coding agent holding the downloaded zip, and the branding service
// can all change those things without understanding the page, and without
// being able to break it.
//
// Two halves, deliberately separate:
//
//   TemplateSpec   what may change, and what it currently is. Generated from
//                  the exported HTML, never hand-written (see
//                  scripts/generate-editable.mjs).
//   EditsDocument  what somebody wants changed. Portable, tiny, and the unit
//                  that gets saved, sent to an agent, or produced by an LLM.
//
// The spec's slot ids are the stable names in that exchange, and they exist in
// the page itself as `data-edit*` attributes - which is what lets the same ids
// survive a static export, the HTML download package, and the React download
// package (where they are anchors in the source a person or an agent greps
// for). That is the same trick `patternConfigToAttributes` already plays for
// pattern configuration: put the machine-readable form in the markup, and
// every downstream derivation carries it for free.

/**
 * Bumped when a change would make an older edits document apply wrongly rather
 * than merely incompletely. Slot ids are append-only within a version.
 */
export const SPEC_VERSION = 1;

// ---- the attribute contract ----------------------------------------------

/** Text slot: this element's text content is editable. */
export const EDIT_TEXT_ATTRIBUTE = 'data-edit';

/** Image slot: this element is, or contains, the editable `<img>`. */
export const EDIT_IMAGE_ATTRIBUTE = 'data-edit-image';

/** Pattern slot: this element is, or contains, a `[data-pattern]` host. */
export const EDIT_PATTERN_ATTRIBUTE = 'data-edit-pattern';

/**
 * The element carrying the site's brand custom properties. Its value names the
 * palette derivation (see PaletteDerivation), so a page is self-describing:
 * applying a palette needs the page and the new colours, nothing else.
 */
export const EDIT_ROOT_ATTRIBUTE = 'data-edit-root';

export const EDIT_ATTRIBUTES = [
  EDIT_TEXT_ATTRIBUTE,
  EDIT_IMAGE_ATTRIBUTE,
  EDIT_PATTERN_ATTRIBUTE,
] as const;

// ---- slots ----------------------------------------------------------------

export type SlotKind = 'text' | 'image' | 'pattern';

/**
 * How a text slot's value maps onto markup.
 *
 * `plain` is text content. `emphasis` carries the `{em}...{/em}` convention the
 * template sites already use for an accented span in a headline: the *value*
 * keeps the markers, so editing a headline can keep (or move, or drop) the
 * accent instead of flattening it the first time anybody touches it.
 */
export type TextFormat = 'plain' | 'emphasis';

/**
 * The piece of standard brand copy a text slot holds.
 *
 * Slot ids are local to the page that declares them, so they are no use to a
 * caller holding three strings and no knowledge of which template it is
 * addressing. A role is the stable name across all of them. See brand.ts.
 */
export type CopyRole = 'brandName' | 'headline' | 'tagline';

export type TextSlot = {
  id: string;
  kind: 'text';
  /** Current value, read out of the export. */
  value: string;
  format: TextFormat;
  /** Human label for an editing UI. Defaults to a prettified id. */
  label?: string;
  /**
   * Soft length budget. The design was set for roughly this much text; an
   * editor warns past it, and an LLM is told to stay inside it. Not enforced
   * as an error - a user is allowed to overrun their own page.
   */
  maxChars?: number;
  /** Renders as a textarea rather than an input. */
  multiline?: boolean;
  /**
   * Which piece of standard brand copy this slot holds, when it holds one.
   * Set from `data-edit-copy` in the markup; absent on the great majority of
   * slots, which are page-specific prose rather than brand copy.
   */
  role?: CopyRole;
  /**
   * The class the `<em>` accent carries on this page, captured at generate
   * time. Class names are hashed in the export and rewritten in the download
   * package, so an `emphasis` slot cannot hardcode one.
   */
  emphasisClass?: string;
};

export type ImageSlot = {
  id: string;
  kind: 'image';
  /** Current `src`, as it appears in this package. */
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** The generation prompt, where the image pipeline knows one. */
  prompt?: string;
  label?: string;
};

/**
 * One position in a pattern's palette.
 *
 * A number is an index into the brand palette, so re-colouring the site
 * re-colours the pattern field with it. A string is a literal that never
 * moves - overwhelmingly `"transparent"`, which is how a pattern is drawn over
 * a photograph or a section background rather than over its own ground.
 */
export type PaletteRole = number | string;

/** Serialized pattern configuration - the `data-*` vocabulary, as values. */
export type PatternSlotConfig = {
  slug: string;
  palette?: string[];
  options?: Record<string, string | number | boolean>;
  seed?: string;
  fit?: string;
  cellSize?: number;
  density?: number;
  redrawInterval?: number;
};

/**
 * Option metadata copied from the catalog at generate time.
 *
 * It is here so this package stays dependency-free and still validates an
 * option against the range it actually has, and so an editing UI can build a
 * control without loading 295 pattern definitions.
 */
export type PatternOptionSpec = {
  id: string;
  label: string;
  type: 'ButtonSelectGroup' | 'Slider' | 'ToggleSwitch';
  default: string | number | boolean;
  values?: string[];
  min?: number;
  max?: number;
  step?: number;
};

export type PatternSlot = {
  id: string;
  kind: 'pattern';
  config: PatternSlotConfig;
  /**
   * How this field's palette is built from the brand palette. Absent means the
   * palette is literal and a brand re-colour leaves it alone.
   */
  paletteRoles?: PaletteRole[];
  /** The design's options, for validation and for building controls. */
  options?: PatternOptionSpec[];
  label?: string;
};

export type Slot = TextSlot | ImageSlot | PatternSlot;

// ---- palette --------------------------------------------------------------

/**
 * How brand colours become CSS custom properties on the page root.
 *
 * `direct` writes `--brand-0...n` and nothing else: the stylesheet consumes the
 * roles as authored. `templateSite` additionally recomputes the derived
 * variables the shared TemplateSite component works in (`--ink`, `--card`,
 * `--soft`, ...), which are functions of the palette rather than members of it -
 * so a re-colour has to recompute them or the page keeps its old contrast.
 */
export type PaletteDerivation = 'direct' | 'templateSite' | 'vars';

export type PaletteSpec = {
  /** Colours, background (role 0) first - the shape used everywhere else. */
  colors: string[];
  derivation: PaletteDerivation;
  /** Optional authored names, for an editor's swatch labels. */
  names?: string[];
  /**
   * `templateSite` only: the site drops the alternating band tone, so `--band`
   * resolves to the page colour.
   */
  flatSections?: boolean;
  /**
   * `vars` only: the page's own custom-property names, in role order - so role
   * 0 writes `--<varNames[0]>`.
   *
   * The 52 bespoke template pages already had their colour in one place before
   * any of this existed: each declares `--paper`, `--ink`, `--ochre`... on its
   * root rule and the stylesheet only ever reads `var(--...)`. Renaming those to
   * `--brand-N` would have meant a codemod over 52 stylesheets to gain nothing,
   * so instead the page declares which name each role owns and a re-colour
   * writes those. An inline property beats the class rule that holds the
   * authored default, so the page keeps working with no edits applied.
   */
  varNames?: string[];
};

// ---- the spec -------------------------------------------------------------

export type TemplateSpec = {
  specVersion: number;
  site: {
    slug: string;
    name: string;
    topic?: string;
  };
  palette: PaletteSpec;
  fonts?: {
    display?: string;
    body?: string;
    href?: string;
  };
  slots: Slot[];
};

// ---- edits ----------------------------------------------------------------

export type ImageEdit = {
  src: string;
  alt?: string;
};

export type PatternEdit = {
  /** Swap the design itself. The new slug's options replace the old ones. */
  slug?: string;
  /**
   * Literal palette override. Normally left unset: a pattern slot with
   * `paletteRoles` re-colours from the brand palette automatically.
   */
  palette?: string[];
  options?: Record<string, string | number | boolean>;
  seed?: string;
};

export type Edits = {
  text?: Record<string, string>;
  images?: Record<string, ImageEdit>;
  patterns?: Record<string, PatternEdit>;
  /** Brand palette, background first. Replaces the spec's palette wholesale. */
  palette?: string[];
};

export type EditsDocument = {
  specVersion: number;
  slug: string;
  edits: Edits;
};

// ---- problems -------------------------------------------------------------

export type ProblemLevel = 'error' | 'warning';

export type Problem = {
  level: ProblemLevel;
  /** Slot id, or a dotted path for document-level problems. */
  path: string;
  message: string;
};

// ---- helpers --------------------------------------------------------------

export const isTextSlot = (slot: Slot): slot is TextSlot => slot.kind === 'text';
export const isImageSlot = (slot: Slot): slot is ImageSlot =>
  slot.kind === 'image';
export const isPatternSlot = (slot: Slot): slot is PatternSlot =>
  slot.kind === 'pattern';

/** The attribute a slot of this kind is annotated with. */
export function attributeForKind(kind: SlotKind): string {
  switch (kind) {
    case 'text':
      return EDIT_TEXT_ATTRIBUTE;
    case 'image':
      return EDIT_IMAGE_ATTRIBUTE;
    case 'pattern':
      return EDIT_PATTERN_ATTRIBUTE;
  }
}

/** CSS selector matching one slot's annotated element. */
export function selectorForSlot(slot: Pick<Slot, 'id' | 'kind'>): string {
  return `[${attributeForKind(slot.kind)}="${slot.id}"]`;
}

/** An empty edits document for a spec - the starting state of an editor. */
export function emptyEdits(spec: TemplateSpec): EditsDocument {
  return { specVersion: spec.specVersion, slug: spec.site.slug, edits: {} };
}
