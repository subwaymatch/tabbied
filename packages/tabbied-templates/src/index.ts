// tabbied-templates - the editable-section contract for Tabbied template
// sites, and the engine that applies an edit.
//
// Framework-free and dependency-free by contract, because it runs in three
// places: the browser (the site builder's live preview and its client-side
// export), Node (the build-time generator and its gate), and a test.
//
// See docs/editable-templates.md for the whole picture.

export {
  SPEC_VERSION,
  EDIT_TEXT_ATTRIBUTE,
  EDIT_IMAGE_ATTRIBUTE,
  EDIT_PATTERN_ATTRIBUTE,
  EDIT_ROOT_ATTRIBUTE,
  EDIT_ATTRIBUTES,
  attributeForKind,
  selectorForSlot,
  emptyEdits,
  isTextSlot,
  isImageSlot,
  isPatternSlot,
} from './spec.js';

export type {
  SlotKind,
  TextFormat,
  TextSlot,
  CopyRole,
  ImageSlot,
  PatternSlot,
  PatternSlotConfig,
  PatternOptionSpec,
  PaletteRole,
  PaletteDerivation,
  PaletteSpec,
  Slot,
  TemplateSpec,
  Edits,
  EditsDocument,
  ImageEdit,
  PatternEdit,
  Problem,
  ProblemLevel,
} from './spec.js';

export {
  planEdits,
  validateEdits,
  validateSpec,
  hasErrors,
  formatProblems,
  recolourablePatternSlots,
  MIN_PALETTE_COLORS,
} from './plan.js';

export type { EditOperation, EditPlan } from './plan.js';

export {
  COPY_ROLES,
  copySlots,
  declaredCopyRoles,
  directionToEdits,
  parseCopyRole,
  supportsBrandCopy,
} from './brand.js';

export type { BrandCopy, BrandDirection } from './brand.js';

export { applyEdits, applyPlan } from './apply.js';
export type { ApplyResult } from './apply.js';

export {
  BRAND_PROPERTY_PREFIX,
  brandProperty,
  derivePaletteProperties,
  propertiesForPalette,
  resolvePaletteRoles,
} from './palette.js';

export type { PaletteProperties } from './palette.js';

export {
  toRgb,
  luminance,
  contrastRatio,
  mix,
  onColor,
  isHexColor,
} from './color.js';

export type { Rgb } from './color.js';

export {
  parseEmphasis,
  stripEmphasis,
  hasEmphasis,
  decodeEntities,
  htmlToTextValue,
} from './text.js';

export type { TextSegment } from './text.js';

export { scanElements, parseAttributes, stripCacheBuster } from './html.js';
export type { ScannedElement } from './html.js';

export {
  extractFromHtml,
  labelFromId,
  parsePaletteRoles,
  parseBrandColors,
  parseNamedColors,
  FORMAT_ATTRIBUTE,
  MAX_ATTRIBUTE,
  MULTILINE_ATTRIBUTE,
  LABEL_ATTRIBUTE,
  COPY_ATTRIBUTE,
  ROLES_ATTRIBUTE,
  FLAT_ATTRIBUTE,
  VARS_ATTRIBUTE,
} from './extract.js';

export type {
  ExtractOptions,
  ExtractResult,
  ExtractedRoot,
} from './extract.js';
