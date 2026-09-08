// Native SVG export: walks a rendered <css-doodle>'s shadow DOM and maps the
// computed styles of every painted box to real SVG primitives - rects, paths,
// gradients, clips, masks and filters. No <foreignObject>: the output renders
// in design tools and non-browser rasterizers, not just HTML engines.
//
// Design notes (see docs/svg-export.md for the full rationale and the
// support-tier rules):
// - Geometry comes from layout offsets (offsetLeft/offsetTop/offsetWidth/
//   offsetHeight), which are untransformed; computed `transform` matrices are
//   emitted separately with their origins baked in, so nested transforms
//   compose exactly like CSS.
// - All coordinates stay in the root (untransformed) space; per-element
//   transforms are conjugated around the element's absolute origin.
// - Values are read from getComputedStyle, so the cascade, custom properties
//   and css-doodle's per-occurrence randomization are already resolved.
// - Unsupported CSS fails loudly (SvgExportUnsupportedError) rather than
//   producing silently wrong output. Approximations that are valid SVG but
//   may degrade outside browsers (blur, shadows, blend modes) are recorded in
//   `warnings`.
//
// This module intentionally has no runtime imports: the compiled dist file is
// dependency-free so tests can load it directly into a page.

export type SvgExportOptions = {
  /** Decimal places for coordinates (default 3). */
  precision?: number;
};

export type SvgExportResult = {
  svg: string;
  /** CSS-px size of the snapshot (the viewBox; the file itself scales freely). */
  width: number;
  height: number;
  /** Non-fatal degradations, e.g. effects that design tools may not import. */
  warnings: string[];
};

/** A CSS feature with no faithful native-SVG mapping was encountered. */
export class SvgExportUnsupportedError extends Error {
  constructor(feature: string, value?: string) {
    super(
      `[tabbied] SVG export does not support ${feature}` +
        (value ? `: ${value}` : '')
    );
    this.name = 'SvgExportUnsupportedError';
  }
}

// ---------------------------------------------------------------------------
// Small SVG node model + serializer
// ---------------------------------------------------------------------------

type Attrs = Record<string, string | number | undefined>;

type SvgNode = {
  tag: string;
  attrs: Attrs;
  children?: SvgNode[];
};

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

const escapeXml = (value: string): string =>
  value.replace(/[&<>"]/g, (ch) => XML_ESCAPES[ch]);

function serializeNode(node: SvgNode): string {
  let attrs = '';
  for (const [key, value] of Object.entries(node.attrs)) {
    if (value === undefined || value === '') continue;
    attrs += ` ${key}="${escapeXml(String(value))}"`;
  }
  const children = node.children ?? [];
  if (children.length === 0) {
    return `<${node.tag}${attrs}/>`;
  }
  return `<${node.tag}${attrs}>${children.map(serializeNode).join('')}</${node.tag}>`;
}

// ---------------------------------------------------------------------------
// Shared export context
// ---------------------------------------------------------------------------

type Ctx = {
  precision: number;
  defs: SvgNode[];
  /** serialized def content -> assigned id, for deduplication. */
  defsIndex: Map<string, string>;
  idCounter: number;
  warnings: Set<string>;
  usesBlend: boolean;
  /**
   * True while painting mask content: every fill is rewritten to white with
   * the source alpha as opacity, so CSS's alpha masking maps onto SVG's
   * (default) luminance masking.
   */
  maskMode: boolean;
};

/** Register a def node, deduplicating identical content. Returns its id. */
function addDef(ctx: Ctx, node: SvgNode): string {
  const key = serializeNode({ ...node, attrs: { ...node.attrs, id: '' } });
  const existing = ctx.defsIndex.get(key);
  if (existing) return existing;
  const id = `d${ctx.idCounter++}`;
  node.attrs.id = id;
  ctx.defs.push(node);
  ctx.defsIndex.set(key, id);
  return id;
}

function fmtNum(value: number, precision: number): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = Number(value.toFixed(precision));
  // Avoid "-0"
  return String(rounded === 0 ? 0 : rounded);
}

// ---------------------------------------------------------------------------
// Computed-value parsing helpers (pure; unit-tested via _internals)
// ---------------------------------------------------------------------------

/** Split a computed list value at top-level commas (depth-aware). */
export function splitTopLevel(value: string, separator = ','): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  let inString: string | null = null;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (inString) {
      if (ch === inString && value[i - 1] !== '\\') inString = null;
      current += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = ch;
      current += ch;
    } else if (ch === '(') {
      depth++;
      current += ch;
    } else if (ch === ')') {
      depth--;
      current += ch;
    } else if (ch === separator && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

export type Rgba = { r: number; g: number; b: number; a: number };

/**
 * Parse a computed color. Chromium serializes computed sRGB colors as
 * rgb()/rgba(); anything else (color(), oklch(), ...) is normalized by the
 * caller through a DOM probe before reaching here.
 */
export function parseRgbColor(value: string): Rgba | null {
  const v = value.trim();
  if (v === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  const m = v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.%]+))?\s*\)$/);
  if (!m) return null;
  let a = 1;
  if (m[4] !== undefined) {
    a = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
  }
  return { r: +m[1], g: +m[2], b: +m[3], a };
}

const rgbString = ({ r, g, b }: Rgba): string =>
  `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;

/** Parse a computed px length ("12.5px" -> 12.5). */
const px = (value: string): number => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

/** Resolve a length-or-percentage token against a reference size. */
export function resolveLength(token: string, reference: number): number {
  const t = token.trim();
  if (t.startsWith('calc(')) return resolveCalc(t, reference);
  if (t.endsWith('%')) return (parseFloat(t) / 100) * reference;
  return px(t);
}

/**
 * Resolve `calc()` mixes of percentages and px (the patterns' anti-aliasing
 * ramps: `calc(42% - 0.5px)`). Supports +/- chains of %/px terms.
 */
export function resolveCalc(token: string, reference: number): number {
  const inner = token.trim().replace(/^calc\(/, '').replace(/\)$/, '');
  const parts = inner.split(/\s+([+-])\s+/);
  let total = 0;
  let sign = 1;
  for (const part of parts) {
    if (part === '+') { sign = 1; continue; }
    if (part === '-') { sign = -1; continue; }
    const t = part.trim();
    if (t.includes('*') || t.includes('/') || t.startsWith('calc(') || t.includes('(')) {
      throw new SvgExportUnsupportedError('calc() expression', token);
    }
    const value = t.endsWith('%') ? (parseFloat(t) / 100) * reference : px(t);
    total += sign * value;
    sign = 1;
  }
  return total;
}

/** Convert a CSS angle token to degrees. */
export function angleToDeg(token: string): number {
  const t = token.trim();
  const n = parseFloat(t);
  if (t.endsWith('grad')) return (n * 360) / 400;
  if (t.endsWith('rad')) return (n * 180) / Math.PI;
  if (t.endsWith('turn')) return n * 360;
  return n; // deg (or unitless 0)
}

export type Matrix = [number, number, number, number, number, number];

/** Parse a computed transform ("none" | matrix(...) | matrix3d(...)). */
export function parseTransformMatrix(value: string): Matrix | null {
  if (!value || value === 'none') return null;
  let m = value.match(/^matrix\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(',').map((s) => parseFloat(s));
    if (p.length === 6) return p as Matrix;
  }
  m = value.match(/^matrix3d\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(',').map((s) => parseFloat(s));
    if (p.length === 16) {
      // Accept only matrices that are affine in the XY plane.
      const flat2d =
        p[2] === 0 && p[3] === 0 && p[6] === 0 && p[7] === 0 &&
        p[8] === 0 && p[9] === 0 && p[10] === 1 && p[11] === 0 &&
        p[14] === 0 && p[15] === 1;
      if (!flat2d) {
        throw new SvgExportUnsupportedError('3D transform', value);
      }
      return [p[0], p[1], p[4], p[5], p[12], p[13]];
    }
  }
  throw new SvgExportUnsupportedError('transform', value);
}

const isIdentity = (m: Matrix): boolean =>
  m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0;

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

type Box = { x: number; y: number; w: number; h: number };

type CornerRadii = {
  // Per corner: horizontal and vertical radius, in px, already clamped.
  tl: [number, number];
  tr: [number, number];
  br: [number, number];
  bl: [number, number];
};

/** Parse one computed border-*-radius value ("8px" | "8px 4px" | "50%"). */
function cornerRadius(value: string, w: number, h: number): [number, number] {
  const parts = value.trim().split(/\s+/);
  const rh = resolveLength(parts[0] ?? '0px', w);
  const rv = resolveLength(parts[1] ?? parts[0] ?? '0px', h);
  return [Math.max(0, rh), Math.max(0, rv)];
}

function readRadii(cs: CSSStyleDeclaration, box: Box): CornerRadii | null {
  const tl = cornerRadius(cs.borderTopLeftRadius, box.w, box.h);
  const tr = cornerRadius(cs.borderTopRightRadius, box.w, box.h);
  const br = cornerRadius(cs.borderBottomRightRadius, box.w, box.h);
  const bl = cornerRadius(cs.borderBottomLeftRadius, box.w, box.h);
  if (!tl[0] && !tl[1] && !tr[0] && !tr[1] && !br[0] && !br[1] && !bl[0] && !bl[1]) {
    return null;
  }
  // CSS overlap clamping: scale all radii by the largest overflow factor.
  const f = Math.min(
    1,
    box.w / (tl[0] + tr[0] || 1e-9),
    box.w / (bl[0] + br[0] || 1e-9),
    box.h / (tl[1] + bl[1] || 1e-9),
    box.h / (tr[1] + br[1] || 1e-9)
  );
  const scale = (r: [number, number]): [number, number] => [r[0] * f, r[1] * f];
  return { tl: scale(tl), tr: scale(tr), br: scale(br), bl: scale(bl) };
}

/** Path data for a (possibly rounded) rect in absolute coordinates. */
export function roundedRectPath(
  box: Box,
  radii: CornerRadii | null,
  precision: number
): string {
  const f = (n: number) => fmtNum(n, precision);
  const { x, y, w, h } = box;
  if (!radii) {
    return `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
  }
  const { tl, tr, br, bl } = radii;
  return (
    `M${f(x + tl[0])} ${f(y)}` +
    `H${f(x + w - tr[0])}` +
    (tr[0] || tr[1] ? `A${f(tr[0])} ${f(tr[1])} 0 0 1 ${f(x + w)} ${f(y + tr[1])}` : '') +
    `V${f(y + h - br[1])}` +
    (br[0] || br[1] ? `A${f(br[0])} ${f(br[1])} 0 0 1 ${f(x + w - br[0])} ${f(y + h)}` : '') +
    `H${f(x + bl[0])}` +
    (bl[0] || bl[1] ? `A${f(bl[0])} ${f(bl[1])} 0 0 1 ${f(x)} ${f(y + h - bl[1])}` : '') +
    `V${f(y + tl[1])}` +
    (tl[0] || tl[1] ? `A${f(tl[0])} ${f(tl[1])} 0 0 1 ${f(x + tl[0])} ${f(y)}` : '') +
    `Z`
  );
}

/** The border-box shape of an element: a rect, ellipse, or rounded-rect path. */
type Shape =
  | { kind: 'rect'; box: Box }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { kind: 'path'; d: string };

function shapeFor(box: Box, radii: CornerRadii | null, precision: number): Shape {
  if (!radii) return { kind: 'rect', box };
  const corners = [radii.tl, radii.tr, radii.br, radii.bl];
  const rh = corners[0][0];
  const rv = corners[0][1];
  const uniform = corners.every((c) => c[0] === rh && c[1] === rv);
  if (uniform && rh >= box.w / 2 - 0.01 && rv >= box.h / 2 - 0.01) {
    return {
      kind: 'ellipse',
      cx: box.x + box.w / 2,
      cy: box.y + box.h / 2,
      rx: box.w / 2,
      ry: box.h / 2,
    };
  }
  return { kind: 'path', d: roundedRectPath(box, radii, precision) };
}

function shapeNode(shape: Shape, attrs: Attrs, precision: number): SvgNode {
  const f = (n: number) => fmtNum(n, precision);
  if (shape.kind === 'rect') {
    const { x, y, w, h } = shape.box;
    return { tag: 'rect', attrs: { x: f(x), y: f(y), width: f(w), height: f(h), ...attrs } };
  }
  if (shape.kind === 'ellipse') {
    const circle = Math.abs(shape.rx - shape.ry) < 0.01;
    return circle
      ? { tag: 'circle', attrs: { cx: f(shape.cx), cy: f(shape.cy), r: f(shape.rx), ...attrs } }
      : {
          tag: 'ellipse',
          attrs: { cx: f(shape.cx), cy: f(shape.cy), rx: f(shape.rx), ry: f(shape.ry), ...attrs },
        };
  }
  return { tag: 'path', attrs: { d: shape.d, ...attrs } };
}

/** Grow a shape outward/inward (for strokes drawn inside the border box). */
function insetShape(shape: Shape, inset: number, precision: number): Shape {
  if (shape.kind === 'rect') {
    const { x, y, w, h } = shape.box;
    return { kind: 'rect', box: { x: x + inset, y: y + inset, w: w - 2 * inset, h: h - 2 * inset } };
  }
  if (shape.kind === 'ellipse') {
    return { ...shape, rx: shape.rx - inset, ry: shape.ry - inset };
  }
  // Rounded-rect paths: not needed by the current catalog (borders are on
  // rects/circles). Fail loudly if a bordered rounded-rect ever appears.
  throw new SvgExportUnsupportedError('border on a partially-rounded box');
}

// ---------------------------------------------------------------------------
// Gradients
// ---------------------------------------------------------------------------

type GradientStop = { color: Rgba; pos: number | null };

/**
 * Parse the stop list shared by all gradient functions. Positions are
 * resolved against `lineLength` px (percentages) and left null when the
 * author omitted them.
 */
/** Is this token a gradient stop position (rather than a color)? */
const isPositionToken = (token: string): boolean =>
  /^calc\(/.test(token) || /^-?[\d.]+(px|%|deg|grad|rad|turn)$/.test(token);

function parseStops(
  parts: string[],
  lineLength: number,
  normalizeColor: (raw: string) => Rgba
): GradientStop[] {
  const stops: GradientStop[] = [];
  for (const part of parts) {
    // A color token followed by up to two positions (which may be calc()
    // mixes - the patterns' anti-aliasing ramps). A bare position would be
    // a CSS interpolation hint, which SVG cannot express.
    const tokens = splitTopLevel(part, ' ').filter(Boolean);
    if (tokens.length === 0 || isPositionToken(tokens[0])) {
      throw new SvgExportUnsupportedError('gradient interpolation hint', part);
    }
    const color = normalizeColor(tokens[0]);
    const posTokens = tokens.slice(1);
    if (posTokens.some((token) => !isPositionToken(token))) {
      throw new SvgExportUnsupportedError('gradient stop', part);
    }
    const toPos = (token: string): number => {
      if (/^-?[\d.]+(deg|grad|rad|turn)$/.test(token)) return angleToDeg(token) / 360;
      return resolveLength(token, lineLength) / lineLength;
    };
    if (posTokens.length === 0) {
      stops.push({ color, pos: null });
    } else {
      for (const token of posTokens) stops.push({ color, pos: toPos(token) });
    }
  }
  // Resolve omitted positions per CSS: first 0, last 1, in-between evenly
  // distributed; positions may never decrease.
  if (stops.length < 2) throw new SvgExportUnsupportedError('gradient', 'fewer than 2 stops');
  if (stops[0].pos == null) stops[0].pos = 0;
  if (stops[stops.length - 1].pos == null) stops[stops.length - 1].pos = 1;
  let last = stops[0].pos!;
  for (let i = 1; i < stops.length; i++) {
    let pos = stops[i].pos;
    if (pos == null) {
      // Find the run of nulls and the next fixed value.
      let j = i;
      while (stops[j].pos == null) j++;
      const next = Math.max(stops[j].pos!, last);
      const runLength = j - i + 1;
      for (let k = i; k < j; k++) {
        stops[k].pos = last + ((next - last) * (k - i + 1)) / runLength;
      }
      pos = stops[i].pos;
    }
    stops[i].pos = Math.max(pos!, last);
    last = stops[i].pos!;
  }
  return stops;
}

/**
 * CSS interpolates gradients in premultiplied alpha; SVG does not. Between
 * two stops with different alphas AND different colors the two models
 * diverge visibly (e.g. a solid color fading to rgba(0,0,0,0.15) stays light
 * in CSS but drags through dark grays in SVG). Approximate the CSS ramp by
 * inserting premultiplied-interpolated intermediate stops.
 */
function emulatePremultipliedInterpolation(stops: GradientStop[]): GradientStop[] {
  const out: GradientStop[] = [];
  const SUBDIVISIONS = 8;
  for (let i = 0; i < stops.length; i++) {
    out.push(stops[i]);
    const next = stops[i + 1];
    if (!next) break;
    const c1 = stops[i].color;
    const c2 = next.color;
    const sameRgb = c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;
    if (c1.a === c2.a || sameRgb) continue;
    if (c1.a === 0 || c2.a === 0) {
      // Exact fix: a fully-transparent stop interpolates (premultiplied) as
      // the opaque neighbor's RGB at alpha 0.
      const solid = c1.a === 0 ? c2 : c1;
      const idx = c1.a === 0 ? out.length - 1 : null;
      if (idx !== null) {
        out[idx] = { ...stops[i], color: { ...solid, a: 0 } };
      } else {
        stops[i + 1] = { ...next, color: { ...solid, a: 0 } };
      }
      continue;
    }
    const p1 = stops[i].pos!;
    const p2 = next.pos!;
    if (p2 - p1 <= 0) continue;
    for (let k = 1; k < SUBDIVISIONS; k++) {
      const t = k / SUBDIVISIONS;
      const a = c1.a + (c2.a - c1.a) * t;
      const mix = (ch1: number, ch2: number) =>
        a === 0 ? ch2 : (ch1 * c1.a * (1 - t) + ch2 * c2.a * t) / a;
      out.push({
        pos: p1 + (p2 - p1) * t,
        color: { r: mix(c1.r, c2.r), g: mix(c1.g, c2.g), b: mix(c1.b, c2.b), a },
      });
    }
  }
  return out;
}

function stopNodes(stops: GradientStop[], ctx: Ctx, offsetMap?: (p: number) => number): SvgNode[] {
  return stops.map((stop) => {
    const pos = offsetMap ? offsetMap(stop.pos!) : stop.pos!;
    const color = ctx.maskMode
      ? { r: 255, g: 255, b: 255, a: stop.color.a }
      : stop.color;
    return {
      tag: 'stop',
      attrs: {
        offset: fmtNum(Math.min(Math.max(pos, 0), 1), 5),
        'stop-color': rgbString(color),
        'stop-opacity': color.a === 1 ? undefined : fmtNum(color.a, 4),
      },
    };
  });
}

/** Angle for `to <side-or-corner>` forms, in degrees (CSS bearing). */
function sideOrCornerAngle(token: string, w: number, h: number): number {
  const dirs = token.replace(/^to\s+/, '').trim().split(/\s+/).sort().join(' ');
  const corner = (Math.atan2(w, h) * 180) / Math.PI;
  switch (dirs) {
    case 'top': return 0;
    case 'right': return 90;
    case 'bottom': return 180;
    case 'left': return 270;
    case 'right top': return corner;
    case 'bottom right': return 180 - corner;
    case 'bottom left': return 180 + corner;
    case 'left top': return 360 - corner;
    default:
      throw new SvgExportUnsupportedError('gradient direction', token);
  }
}

/**
 * Convert a linear(-repeating) gradient layer to a def and return its fill
 * url. `area` is the box the gradient is drawn into.
 */
function linearGradientDef(
  args: string[],
  area: Box,
  repeating: boolean,
  ctx: Ctx,
  normalizeColor: (raw: string) => Rgba
): string {
  let angleDeg = 180; // default: to bottom
  let stopParts = args;
  const first = args[0]?.trim() ?? '';
  if (/^(-?[\d.]+)(deg|grad|rad|turn)$/.test(first)) {
    angleDeg = angleToDeg(first);
    stopParts = args.slice(1);
  } else if (first.startsWith('to ')) {
    angleDeg = sideOrCornerAngle(first, area.w, area.h);
    stopParts = args.slice(1);
  } else if (/^(top|right|bottom|left)/.test(first) && !first.includes('(')) {
    angleDeg = sideOrCornerAngle(`to ${first}`, area.w, area.h);
    stopParts = args.slice(1);
  }

  const rad = (angleDeg * Math.PI) / 180;
  const dirX = Math.sin(rad);
  const dirY = -Math.cos(rad);
  const lineLength = Math.abs(area.w * dirX) + Math.abs(area.h * dirY);
  const cx = area.x + area.w / 2;
  const cy = area.y + area.h / 2;

  const stops = parseStops(stopParts, lineLength, normalizeColor);
  const finalStops = emulatePremultipliedInterpolation(stops);

  let startPos = 0;
  let endPos = 1;
  if (repeating) {
    startPos = stops[0].pos!;
    endPos = stops[stops.length - 1].pos!;
    if (endPos - startPos <= 0) {
      throw new SvgExportUnsupportedError('repeating gradient', 'zero-length stop run');
    }
  }
  const p = ctx.precision;
  const point = (t: number): [number, number] => [
    cx + dirX * lineLength * (t - 0.5),
    cy + dirY * lineLength * (t - 0.5),
  ];
  const [x1, y1] = point(startPos);
  const [x2, y2] = point(endPos);
  const span = endPos - startPos;
  const node: SvgNode = {
    tag: 'linearGradient',
    attrs: {
      gradientUnits: 'userSpaceOnUse',
      x1: fmtNum(x1, p),
      y1: fmtNum(y1, p),
      x2: fmtNum(x2, p),
      y2: fmtNum(y2, p),
      spreadMethod: repeating ? 'repeat' : undefined,
    },
    children: stopNodes(finalStops, ctx, repeating ? (t) => (t - startPos) / span : undefined),
  };
  return addDef(ctx, node);
}

function radialGradientDef(
  args: string[],
  area: Box,
  repeating: boolean,
  ctx: Ctx,
  normalizeColor: (raw: string) => Rgba
): string {
  // Preamble: "[shape] [size] [at <pos>]" - present when the first argument
  // does not parse as a color stop.
  let stopParts = args;
  let shape: 'circle' | 'ellipse' | null = null;
  let sizeTokens: string[] = [];
  let posTokens = ['50%', '50%'];
  const first = args[0]?.trim() ?? '';
  const looksLikePreamble =
    /^(circle|ellipse|closest-side|closest-corner|farthest-side|farthest-corner|at\s)/.test(first) ||
    /^-?[\d.]+(px|%)(\s|$)/.test(first);
  if (looksLikePreamble && !first.startsWith('rgb')) {
    stopParts = args.slice(1);
    let preamble = first;
    const atMatch = preamble.match(/\bat\s+(.+)$/);
    if (atMatch) {
      posTokens = atMatch[1].trim().split(/\s+/);
      preamble = preamble.slice(0, atMatch.index).trim();
    }
    for (const token of preamble.split(/\s+/).filter(Boolean)) {
      if (token === 'circle' || token === 'ellipse') shape = token;
      else sizeTokens.push(token);
    }
  }

  const cx = area.x + resolveLength(posTokens[0] ?? '50%', area.w);
  const cy = area.y + resolveLength(posTokens[1] ?? '50%', area.h);
  const dx = { near: Math.min(cx - area.x, area.x + area.w - cx), far: Math.max(cx - area.x, area.x + area.w - cx) };
  const dy = { near: Math.min(cy - area.y, area.y + area.h - cy), far: Math.max(cy - area.y, area.y + area.h - cy) };

  let rx: number;
  let ry: number;
  const keyword = sizeTokens.find((t) => t.includes('-'));
  if (sizeTokens.length && !keyword) {
    if (sizeTokens.length === 1) {
      rx = ry = px(sizeTokens[0]);
      shape ??= 'circle';
    } else {
      rx = resolveLength(sizeTokens[0], area.w);
      ry = resolveLength(sizeTokens[1], area.h);
      shape ??= 'ellipse';
    }
  } else {
    const kw = keyword ?? 'farthest-corner';
    shape ??= 'ellipse';
    const side = kw.includes('closest') ? 'near' : 'far';
    if (shape === 'circle') {
      const cornerDist = (sx: number, sy: number) => Math.hypot(sx, sy);
      if (kw.endsWith('side')) {
        rx = ry = Math.min(dx[side], dy[side]);
        if (side === 'far') rx = ry = Math.max(dx.far, dy.far);
      } else {
        const distances = [
          cornerDist(cx - area.x, cy - area.y),
          cornerDist(area.x + area.w - cx, cy - area.y),
          cornerDist(cx - area.x, area.y + area.h - cy),
          cornerDist(area.x + area.w - cx, area.y + area.h - cy),
        ];
        rx = ry = side === 'near' ? Math.min(...distances) : Math.max(...distances);
      }
    } else {
      if (kw.endsWith('side')) {
        rx = dx[side];
        ry = dy[side];
      } else {
        // Corner ellipses keep the side-ellipse aspect ratio and pass
        // through the corner: rx = √2·dx, ry = √2·dy.
        rx = dx[side] * Math.SQRT2;
        ry = dy[side] * Math.SQRT2;
      }
    }
  }
  rx = Math.max(rx, 1e-6);
  ry = Math.max(ry, 1e-6);

  const stops = parseStops(stopParts, rx, normalizeColor);
  const finalStops = emulatePremultipliedInterpolation(stops);

  let startPos = 0;
  let endPos = 1;
  if (repeating) {
    startPos = stops[0].pos!;
    endPos = stops[stops.length - 1].pos!;
    if (endPos - startPos <= 0) {
      throw new SvgExportUnsupportedError('repeating gradient', 'zero-length stop run');
    }
  }
  const p = ctx.precision;
  const span = endPos - startPos;
  // Ellipses use a circle of radius rx scaled vertically by ry/rx around the
  // center - this keeps `r` meaningful for stop offsets.
  const scaleY = ry / rx;
  const node: SvgNode = {
    tag: 'radialGradient',
    attrs: {
      gradientUnits: 'userSpaceOnUse',
      cx: fmtNum(cx, p),
      cy: fmtNum(cy, p),
      r: fmtNum(rx * endPos, p),
      // fx/fy default to cx/cy. For `repeating`, SVG repeats from r0=0 unless
      // we offset stops; we renormalize below instead.
      spreadMethod: repeating ? 'repeat' : undefined,
      gradientTransform:
        Math.abs(scaleY - 1) > 1e-6
          ? `translate(0 ${fmtNum(cy - cy * scaleY, p)}) scale(1 ${fmtNum(scaleY, 6)})`
          : undefined,
    },
    children: stopNodes(
      finalStops,
      ctx,
      repeating ? (t) => (t - startPos) / span : (t) => t / endPos
    ),
  };
  // With spreadMethod=repeat the run must start at the circle edge fraction
  // startPos/endPos - SVG has no r0, so a nonzero start cannot repeat inward
  // faithfully. The catalog's repeating-radial gradients start at 0.
  if (repeating && startPos > 1e-4) {
    throw new SvgExportUnsupportedError('repeating-radial-gradient with nonzero first stop');
  }
  return addDef(ctx, node);
}

// ---------------------------------------------------------------------------
// Conic gradients with hard stops -> sector paths
// ---------------------------------------------------------------------------

type Sector = { from: number; to: number; color: Rgba };

export function parseConicSectors(
  args: string[],
  normalizeColor: (raw: string) => Rgba
): { cx: string; cy: string; sectors: Sector[] } {
  let fromDeg = 0;
  let posTokens = ['50%', '50%'];
  let stopParts = args;
  const first = args[0]?.trim() ?? '';
  if (first.startsWith('from ') || first.startsWith('at ')) {
    stopParts = args.slice(1);
    const fromMatch = first.match(/from\s+(-?[\d.]+(?:deg|grad|rad|turn))/);
    if (fromMatch) fromDeg = angleToDeg(fromMatch[1]);
    const atMatch = first.match(/at\s+(.+)$/);
    if (atMatch) posTokens = atMatch[1].trim().split(/\s+/);
  }

  // Flatten stops to (color, position) pairs. The computed serialization
  // expands double-position stops into repeated single-position stops.
  type FlatStop = { color: Rgba; pos: number | null };
  const flat: FlatStop[] = [];
  for (const part of stopParts) {
    const tokens = splitTopLevel(part, ' ').filter(Boolean);
    if (tokens.length === 0 || isPositionToken(tokens[0])) {
      throw new SvgExportUnsupportedError('conic-gradient stop', part);
    }
    const color = normalizeColor(tokens[0]);
    const posTokens2 = tokens.slice(1);
    if (posTokens2.length === 0) {
      flat.push({ color, pos: null });
    } else {
      for (const token of posTokens2) {
        if (!/^-?[\d.]+(%|deg|grad|rad|turn)$/.test(token)) {
          throw new SvgExportUnsupportedError('conic-gradient stop position', token);
        }
        flat.push({
          color,
          pos: token.endsWith('%') ? (parseFloat(token) / 100) * 360 : angleToDeg(token),
        });
      }
    }
  }
  if (flat.length < 2) {
    throw new SvgExportUnsupportedError('conic-gradient', 'fewer than 2 stops');
  }
  flat[0].pos ??= 0;
  flat[flat.length - 1].pos ??= 360;
  for (let i = 1; i < flat.length; i++) {
    if (flat[i].pos == null) {
      // Positionless middle stops distribute evenly - but such stops always
      // sit inside a smooth blend, which is rejected below anyway.
      let j = i;
      while (flat[j].pos == null) j++;
      const prev = flat[i - 1].pos!;
      const next = flat[j].pos!;
      const run = j - i + 1;
      for (let k = i; k < j; k++) {
        flat[k].pos = prev + ((next - prev) * (k - i + 1)) / run;
      }
    }
    flat[i].pos = Math.max(flat[i].pos!, flat[i - 1].pos!);
  }

  // A segment between consecutive stops is a solid sector only when both
  // ends share a color; different colors across a nonzero span mean a
  // smooth angular blend, which SVG cannot express.
  const sameColor = (a: Rgba, b: Rgba): boolean =>
    a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
  const sectors: Sector[] = [];
  for (let i = 0; i < flat.length - 1; i++) {
    const from = flat[i].pos!;
    const to = flat[i + 1].pos!;
    if (to - from < 0.01) continue;
    if (!sameColor(flat[i].color, flat[i + 1].color)) {
      throw new SvgExportUnsupportedError('conic-gradient', 'smooth color sweep');
    }
    sectors.push({ from: fromDeg + from, to: fromDeg + to, color: flat[i].color });
  }
  return { cx: posTokens[0] ?? '50%', cy: posTokens[1] ?? '50%', sectors };
}

/** Sector path around (cx, cy): CSS bearing angles (0° = up, clockwise). */
export function sectorPath(
  cx: number,
  cy: number,
  radius: number,
  fromDeg: number,
  toDeg: number,
  precision: number
): string {
  const f = (n: number) => fmtNum(n, precision);
  const span = toDeg - fromDeg;
  if (span >= 360 - 1e-6) {
    return (
      `M${f(cx - radius)} ${f(cy)}` +
      `A${f(radius)} ${f(radius)} 0 1 1 ${f(cx + radius)} ${f(cy)}` +
      `A${f(radius)} ${f(radius)} 0 1 1 ${f(cx - radius)} ${f(cy)}Z`
    );
  }
  const pt = (deg: number): [number, number] => {
    const rad = (deg * Math.PI) / 180;
    return [cx + radius * Math.sin(rad), cy - radius * Math.cos(rad)];
  };
  const [x1, y1] = pt(fromDeg);
  const [x2, y2] = pt(toDeg);
  const largeArc = span > 180 ? 1 : 0;
  return `M${f(cx)} ${f(cy)}L${f(x1)} ${f(y1)}A${f(radius)} ${f(radius)} 0 ${largeArc} 1 ${f(x2)} ${f(y2)}Z`;
}

// ---------------------------------------------------------------------------
// The walker
// ---------------------------------------------------------------------------

type WalkEnv = {
  ctx: Ctx;
  getStyle: (el: Element, pseudo?: string) => CSSStyleDeclaration;
  normalizeColor: (raw: string) => Rgba;
  /** Untransformed fractional border boxes, filled by measureTree(). */
  boxes: WeakMap<Element, Box>;
};

// Layout offsets (offsetLeft/offsetWidth) are integer-rounded, which turns
// fractional grid tracks into visible 1px seams. Instead, measure fractional
// boxes via getBoundingClientRect with every transform temporarily disabled -
// transforms don't affect layout, and the browser never paints mid-task, so
// the override is invisible.
const MEASURE_OVERRIDE =
  '*,*::before,*::after{transform:none!important;transition:none!important;animation:none!important}';

// The patterns author `transition: ease 400ms` on their cells, so restoring
// transforms and transitions in the same style recalc would *start* a
// transition from the overridden state - and later getComputedStyle() calls
// would read its t=0 (identity) frames. Unwind in two steps: restore
// transforms while transitions are still muted, commit that with a forced
// recalc, then unmute transitions (a no-op change that animates nothing).
const MUTE_MOTION =
  '*,*::before,*::after{transition:none!important;animation:none!important}';

function measureTree(
  root: ShadowRoot,
  anchor: HTMLElement,
  originX: number,
  originY: number,
  boxes: WeakMap<Element, Box>
): void {
  const override = document.createElement('style');
  override.textContent = MEASURE_OVERRIDE;
  const mute = document.createElement('style');
  mute.textContent = MUTE_MOTION;
  // The override style lives in the shadow root, so it can never reach the
  // host <css-doodle> itself - and the `cover` fit scales the host with an
  // inline transform. Left in place it would scale every measured box while
  // getComputedStyle keeps returning unscaled px (border widths, radii,
  // pseudo sizes, shadow offsets), silently distorting the export. Neutralize
  // it inline for the measurement pass; the export then comes out at the
  // render box's native resolution, which is what the source describes.
  const host = root.host as HTMLElement;
  const hostTransform = host.style.transform;
  const hostTransition = host.style.transition;
  host.style.transition = 'none';
  host.style.transform = 'none';
  root.appendChild(override);
  try {
    const anchorRect = anchor.getBoundingClientRect();
    boxes.set(anchor, {
      x: originX,
      y: originY,
      w: anchorRect.width,
      h: anchorRect.height,
    });
    for (const el of Array.from(anchor.querySelectorAll('*'))) {
      const rect = el.getBoundingClientRect();
      boxes.set(el, {
        x: originX + rect.left - anchorRect.left,
        y: originY + rect.top - anchorRect.top,
        w: rect.width,
        h: rect.height,
      });
    }
  } finally {
    root.appendChild(mute);
    override.remove();
    host.style.transform = hostTransform;
    // Commit the restored transforms while transitions are still muted (the
    // host's own transition stays inline-muted through the same recalc).
    void anchor.getBoundingClientRect();
    mute.remove();
    host.style.transition = hostTransition;
  }
}

function warn(ctx: Ctx, message: string): void {
  ctx.warnings.add(message);
}

/** Wrap `children` in a group node, or return them unchanged if no attrs. */
function group(children: SvgNode[], attrs: Attrs): SvgNode[] {
  const meaningful = Object.values(attrs).some((v) => v !== undefined && v !== '');
  if (!meaningful || children.length === 0) return children;
  return [{ tag: 'g', attrs, children }];
}

function transformAttr(
  matrix: Matrix | null,
  originX: number,
  originY: number,
  precision: number
): string | undefined {
  if (!matrix || isIdentity(matrix)) return undefined;
  const f = (n: number) => fmtNum(n, precision);
  const [a, b, c, d, e, tf] = matrix;
  // Conjugate around the absolute origin so nested transforms compose like
  // CSS (which resolves transform-origin per element).
  const e2 = originX + e - (a * originX + c * originY);
  const f2 = originY + tf - (b * originX + d * originY);
  return `matrix(${f(a)} ${f(b)} ${f(c)} ${f(d)} ${f(e2)} ${f(f2)})`;
}

/** Paint one background-image layer onto `shape`. */
function paintImageLayer(
  layer: string,
  shape: Shape,
  box: Box,
  size: string,
  position: string,
  repeat: string,
  env: WalkEnv
): SvgNode[] {
  const { ctx } = env;
  const fnMatch = layer.match(/^([a-z-]+)\(([\s\S]*)\)$/i);
  if (!fnMatch) throw new SvgExportUnsupportedError('background-image', layer);
  const fn = fnMatch[1].toLowerCase();
  const args = splitTopLevel(fnMatch[2]);

  // Layer area: where the (first tile of the) image is drawn.
  const sizeTokens = size.trim().split(/\s+/);
  let areaW = box.w;
  let areaH = box.h;
  const explicitSize = sizeTokens[0] !== 'auto' && !['cover', 'contain'].includes(sizeTokens[0]);
  if (explicitSize) {
    areaW = resolveLength(sizeTokens[0], box.w);
    areaH = sizeTokens[1] && sizeTokens[1] !== 'auto' ? resolveLength(sizeTokens[1], box.h) : areaW;
  } else if (sizeTokens[0] === 'cover' || sizeTokens[0] === 'contain') {
    // Gradients have no intrinsic size; cover/contain degenerate to the box.
    areaW = box.w;
    areaH = box.h;
  }
  const posTokens = position.trim().split(/\s+/);
  const posX = resolveLength(posTokens[0] ?? '0%', box.w - areaW);
  const posY = resolveLength(posTokens[1] ?? posTokens[0] ?? '0%', box.h - areaH);
  const area: Box = { x: box.x + posX, y: box.y + posY, w: areaW, h: areaH };

  const tiles = areaW < box.w - 0.5 || areaH < box.h - 0.5;
  const repeats = repeat.startsWith('repeat');
  if (tiles && !repeats) {
    warn(ctx, 'no-repeat background layer smaller than its box');
  }

  const fillShapeWith = (fill: string): SvgNode[] => [
    shapeNode(shape, { fill }, ctx.precision),
  ];

  if (fn === 'linear-gradient' || fn === 'repeating-linear-gradient') {
    const repeating = fn.startsWith('repeating');
    if (tiles && repeats) {
      // Tile the gradient through a pattern.
      const gid = linearGradientDef(args, { x: 0, y: 0, w: areaW, h: areaH }, repeating, ctx, env.normalizeColor);
      const pid = addDef(ctx, {
        tag: 'pattern',
        attrs: {
          patternUnits: 'userSpaceOnUse',
          x: fmtNum(area.x, ctx.precision),
          y: fmtNum(area.y, ctx.precision),
          width: fmtNum(areaW, ctx.precision),
          height: fmtNum(areaH, ctx.precision),
        },
        children: [
          { tag: 'rect', attrs: { x: 0, y: 0, width: fmtNum(areaW, ctx.precision), height: fmtNum(areaH, ctx.precision), fill: `url(#${gid})` } },
        ],
      });
      return fillShapeWith(`url(#${pid})`);
    }
    const gid = linearGradientDef(args, area, repeating, ctx, env.normalizeColor);
    return fillShapeWith(`url(#${gid})`);
  }

  if (fn === 'radial-gradient' || fn === 'repeating-radial-gradient') {
    const repeating = fn.startsWith('repeating');
    if (tiles && repeats) {
      const gid = radialGradientDef(args, { x: 0, y: 0, w: areaW, h: areaH }, repeating, ctx, env.normalizeColor);
      const pid = addDef(ctx, {
        tag: 'pattern',
        attrs: {
          patternUnits: 'userSpaceOnUse',
          x: fmtNum(area.x, ctx.precision),
          y: fmtNum(area.y, ctx.precision),
          width: fmtNum(areaW, ctx.precision),
          height: fmtNum(areaH, ctx.precision),
        },
        children: [
          { tag: 'rect', attrs: { x: 0, y: 0, width: fmtNum(areaW, ctx.precision), height: fmtNum(areaH, ctx.precision), fill: `url(#${gid})` } },
        ],
      });
      return fillShapeWith(`url(#${pid})`);
    }
    const gid = radialGradientDef(args, area, repeating, ctx, env.normalizeColor);
    return fillShapeWith(`url(#${gid})`);
  }

  if (fn === 'conic-gradient') {
    const { cx: cxTok, cy: cyTok, sectors } = parseConicSectors(args, env.normalizeColor);
    const cx = area.x + resolveLength(cxTok, area.w);
    const cy = area.y + resolveLength(cyTok, area.h);
    const radius = Math.hypot(Math.max(cx - box.x, box.x + box.w - cx), Math.max(cy - box.y, box.y + box.h - cy)) + 1;
    const clipId = addDef(ctx, {
      tag: 'clipPath',
      attrs: {},
      children: [shapeNode(shape, {}, ctx.precision)],
    });
    // Adjacent sectors are painted with a hair of angular overlap: two
    // abutting SVG paths anti-alias against each other and leave a seam the
    // CSS conic rendering doesn't have. Later sectors cover the overlap.
    const OVERLAP_DEG = 0.3;
    const paths = sectors
      .filter((s) => s.color.a > 0)
      .map((s) => {
        const color = ctx.maskMode ? { r: 255, g: 255, b: 255, a: s.color.a } : s.color;
        const to = s.to - s.from >= 360 ? s.to : s.to + OVERLAP_DEG;
        return {
          tag: 'path',
          attrs: {
            d: sectorPath(cx, cy, radius, s.from, to, ctx.precision),
            fill: rgbString(color),
            'fill-opacity': color.a === 1 ? undefined : fmtNum(color.a, 4),
          },
        };
      });
    return [{ tag: 'g', attrs: { 'clip-path': `url(#${clipId})` }, children: paths }];
  }

  if (fn === 'repeating-conic-gradient') {
    throw new SvgExportUnsupportedError('repeating-conic-gradient');
  }

  if (fn === 'url') {
    const target = args.join(',').trim().replace(/^["']|["']$/g, '');
    if (!target.startsWith('data:image/svg+xml')) {
      throw new SvgExportUnsupportedError('background image', target.slice(0, 64));
    }
    if (tiles && repeats) {
      // Paint one tile in local coordinates and repeat it as a pattern.
      const tileNodes = paintSvgDataUri(target, { x: 0, y: 0, w: areaW, h: areaH }, env);
      const pid = addDef(ctx, {
        tag: 'pattern',
        attrs: {
          patternUnits: 'userSpaceOnUse',
          x: fmtNum(area.x, ctx.precision),
          y: fmtNum(area.y, ctx.precision),
          width: fmtNum(areaW, ctx.precision),
          height: fmtNum(areaH, ctx.precision),
        },
        children: tileNodes,
      });
      return fillShapeWith(`url(#${pid})`);
    }
    return paintSvgDataUri(target, area, env);
  }

  throw new SvgExportUnsupportedError('background-image function', fn);
}

/** Decode a data:image/svg+xml URI into SVG source text. */
function decodeSvgDataUri(uri: string): string {
  const comma = uri.indexOf(',');
  const meta = uri.slice(0, comma);
  const payload = uri.slice(comma + 1);
  if (/;base64/i.test(meta)) return atob(payload);
  return decodeURIComponent(payload);
}

/** Deterministic content hash for namespacing inlined payload ids. */
function contentHash(source: string): string {
  let hash = 5381;
  for (let i = 0; i < source.length; i++) {
    hash = ((hash << 5) + hash + source.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

/** Suffix every id (and reference to it) inside an SVG payload. */
function namespaceIds(markup: string, suffix: string): string {
  return markup
    .replace(/\bid="([^"]+)"/g, `id="$1-${suffix}"`)
    .replace(/url\(#([^)]+)\)/g, `url(#$1-${suffix})`)
    .replace(/\b(xlink:href|href)="#([^"]+)"/g, `$1="#$2-${suffix}"`);
}

/**
 * Paint an SVG-image layer (css-doodle's @svg()/@doodle() backgrounds and
 * masks). Plain SVG payloads are inlined as scalable <symbol>s (kept
 * vector); foreignObject payloads (nested @doodle) are re-rendered in a
 * hidden shadow root and walked recursively - the output stays native.
 */
function paintSvgDataUri(
  uri: string,
  area: Box,
  env: WalkEnv
): SvgNode[] {
  const { ctx } = env;
  const source = decodeSvgDataUri(uri);
  const f = (n: number) => fmtNum(n, ctx.precision);

  if (!source.includes('<foreignObject')) {
    // Real SVG markup (from @svg()). Inline it as a <symbol> with a viewBox
    // so <use width/height> scales it into the layer area; ids inside are
    // namespaced by a content hash so distinct payloads can't collide (and
    // identical payloads dedupe to one symbol).
    const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
    const svgEl = parsed.documentElement;
    if (svgEl.querySelector('parsererror') || svgEl.tagName === 'parsererror') {
      throw new SvgExportUnsupportedError('svg background image', 'unparseable payload');
    }
    let viewBox = svgEl.getAttribute('viewBox');
    if (!viewBox) {
      const iw = parseFloat(svgEl.getAttribute('width') ?? '');
      const ih = parseFloat(svgEl.getAttribute('height') ?? '');
      if (Number.isFinite(iw) && Number.isFinite(ih)) {
        viewBox = `0 0 ${iw} ${ih}`;
      } else {
        // No intrinsic size: treat the payload as already area-sized.
        viewBox = `0 0 ${area.w} ${area.h}`;
        warn(ctx, 'svg background image without intrinsic size');
      }
    }
    const suffix = contentHash(source);
    const inner = namespaceIds(svgEl.innerHTML, suffix);
    // overflow: the patterns' @svg payloads intentionally bleed past their
    // viewBox (e.g. stripes at y:-1..102); symbols clip by default.
    const symbolId = addDef(ctx, {
      tag: 'symbol',
      attrs: { viewBox, preserveAspectRatio: 'none', overflow: 'visible' },
      children: [{ tag: '__raw__', attrs: { __source__: inner } }],
    });
    const use: SvgNode = {
      tag: 'use',
      attrs: {
        href: `#${symbolId}`,
        x: f(area.x),
        y: f(area.y),
        width: f(area.w),
        height: f(area.h),
      },
    };
    if (ctx.maskMode) {
      // Alpha->luminance for arbitrary content: force RGB to white, keep alpha.
      const filterId = addDef(ctx, {
        tag: 'filter',
        attrs: {},
        children: [
          {
            tag: 'feColorMatrix',
            attrs: { type: 'matrix', values: '0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0' },
          },
        ],
      });
      return [{ tag: 'g', attrs: { filter: `url(#${filterId})` }, children: [use] }];
    }
    return [use];
  }

  // Nested doodle (foreignObject): mount its HTML off-screen in an isolated
  // shadow root, walk it with the same machinery, then discard it.
  const inner = source.match(/<foreignObject[^>]*>([\s\S]*)<\/foreignObject>/);
  if (!inner) throw new SvgExportUnsupportedError('nested doodle image');
  const html = inner[1].replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '');

  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:-100000px;top:0;width:${area.w}px;height:${area.h}px;contain:strict;`;
  const root = container.attachShadow({ mode: 'open' });
  root.innerHTML = html;
  document.body.appendChild(container);
  try {
    const grid = root.querySelector('cssd-grid') as HTMLElement | null;
    if (!grid) throw new SvgExportUnsupportedError('nested doodle image', 'no grid');
    measureTree(root, grid, area.x, area.y, env.boxes);
    return paintElement(grid, env);
  } finally {
    container.remove();
  }
}

/** Background color + image layers + border for one box. */
/**
 * The background positioning area for one layer: the border box inset by the
 * border (padding-box, the CSS default) and optionally the padding too
 * (content-box). Identical to `box` on a box without borders, which is every
 * pattern that predates section G of batch 11.
 */
function originBox(box: Box, cs: CSSStyleDeclaration, origin: string): Box {
  const kind = origin.trim();
  if (kind === 'border-box') return box;
  let l = px(cs.borderLeftWidth);
  let t = px(cs.borderTopWidth);
  let r = px(cs.borderRightWidth);
  let b = px(cs.borderBottomWidth);
  if (kind === 'content-box') {
    l += px(cs.paddingLeft);
    t += px(cs.paddingTop);
    r += px(cs.paddingRight);
    b += px(cs.paddingBottom);
  }
  if (!l && !t && !r && !b) return box;
  return { x: box.x + l, y: box.y + t, w: box.w - l - r, h: box.h - t - b };
}

function paintBoxLayers(box: Box, cs: CSSStyleDeclaration, env: WalkEnv): SvgNode[] {
  const { ctx } = env;
  const radii = readRadii(cs, box);
  const shape = shapeFor(box, radii, ctx.precision);
  const nodes: SvgNode[] = [];

  const bg = env.normalizeColor(cs.backgroundColor);
  if (bg.a > 0) {
    const color = ctx.maskMode ? { r: 255, g: 255, b: 255, a: bg.a } : bg;
    nodes.push(
      shapeNode(
        shape,
        {
          fill: rgbString(color),
          'fill-opacity': color.a === 1 ? undefined : fmtNum(color.a, 4),
          // Mask tiles (nested-doodle cells) abut each other; snapping their
          // axis-aligned edges avoids hairline AA seams inside the mask.
          'shape-rendering':
            ctx.maskMode && shape.kind === 'rect' ? 'crispEdges' : undefined,
        },
        ctx.precision
      )
    );
  }

  const imageValue = cs.backgroundImage;
  if (imageValue && imageValue !== 'none') {
    const layers = splitTopLevel(imageValue);
    const sizes = splitTopLevel(cs.backgroundSize || 'auto');
    const positions = splitTopLevel(cs.backgroundPosition || '0% 0%');
    const repeats = splitTopLevel(cs.backgroundRepeat || 'repeat');
    const origins = splitTopLevel(cs.backgroundOrigin || 'padding-box');
    // CSS lists layers top-first; paint bottom-up.
    for (let i = layers.length - 1; i >= 0; i--) {
      if (layers[i] === 'none') continue;
      nodes.push(
        ...paintImageLayer(
          layers[i],
          shape,
          // The *positioning area* is the origin box (padding-box by
          // default), not the border box - percentage stops and sizes
          // resolve against it. `shape` stays the border box, which is what
          // the layer is clipped to.
          originBox(box, cs, origins[i % origins.length]),
          sizes[i % sizes.length],
          positions[i % positions.length],
          repeats[i % repeats.length],
          env
        )
      );
    }
  }

  nodes.push(...paintBorders(box, cs, radii, shape, env));

  return nodes;
}

type BorderSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * Path along one side's border centerline, including the halves of the two
 * corner arcs that side owns (CSS splits each corner between its adjacent
 * sides at the 45° diagonal). Sharp corners run to the box corner; stroking
 * this path with the side's width reproduces CSS side borders - including
 * windowpane's quarter-circle arcs and elbow's rounded pipe corner.
 */
function sideBorderPath(
  box: Box,
  radii: CornerRadii | null,
  side: BorderSide,
  width: number,
  precision: number
): string {
  const f = (n: number) => fmtNum(n, precision);
  const inset = width / 2;
  const r = radii ?? { tl: [0, 0], tr: [0, 0], br: [0, 0], bl: [0, 0] };
  // Corner ellipse centers (border-box) and centerline radii.
  const corners = {
    tl: { cx: box.x + r.tl[0], cy: box.y + r.tl[1], rx: r.tl[0] - inset, ry: r.tl[1] - inset },
    tr: { cx: box.x + box.w - r.tr[0], cy: box.y + r.tr[1], rx: r.tr[0] - inset, ry: r.tr[1] - inset },
    br: { cx: box.x + box.w - r.br[0], cy: box.y + box.h - r.br[1], rx: r.br[0] - inset, ry: r.br[1] - inset },
    bl: { cx: box.x + r.bl[0], cy: box.y + box.h - r.bl[1], rx: r.bl[0] - inset, ry: r.bl[1] - inset },
  };
  // Each side: [corner at its start (half-arc), corner at its end], with the
  // side's straight run between the corners' axis points, and the sharp-
  // corner fallback endpoints on the centerline.
  const SIDES: Record<
    BorderSide,
    {
      start: keyof typeof corners; startFrom: number;
      end: keyof typeof corners; endTo: number;
      sharpStart: [number, number]; sharpEnd: [number, number];
    }
  > = {
    top: {
      start: 'tl', startFrom: 315, end: 'tr', endTo: 45,
      sharpStart: [box.x, box.y + inset], sharpEnd: [box.x + box.w, box.y + inset],
    },
    right: {
      start: 'tr', startFrom: 45, end: 'br', endTo: 135,
      sharpStart: [box.x + box.w - inset, box.y], sharpEnd: [box.x + box.w - inset, box.y + box.h],
    },
    bottom: {
      start: 'br', startFrom: 135, end: 'bl', endTo: 225,
      sharpStart: [box.x + box.w, box.y + box.h - inset], sharpEnd: [box.x, box.y + box.h - inset],
    },
    left: {
      start: 'bl', startFrom: 225, end: 'tl', endTo: 315,
      sharpStart: [box.x + inset, box.y + box.h], sharpEnd: [box.x + inset, box.y],
    },
  };
  const spec = SIDES[side];
  const point = (c: (typeof corners)['tl'], bearing: number): [number, number] => {
    const rad = (bearing * Math.PI) / 180;
    return [c.cx + c.rx * Math.sin(rad), c.cy - c.ry * Math.cos(rad)];
  };
  const arc = (c: (typeof corners)['tl'], to: [number, number]): string =>
    `A${f(c.rx)} ${f(c.ry)} 0 0 1 ${f(to[0])} ${f(to[1])}`;

  const startCorner = corners[spec.start];
  const endCorner = corners[spec.end];
  const startRound = startCorner.rx > 0.01 && startCorner.ry > 0.01;
  const endRound = endCorner.rx > 0.01 && endCorner.ry > 0.01;

  let d = '';
  if (startRound) {
    const p0 = point(startCorner, spec.startFrom);
    const p1 = point(startCorner, spec.startFrom + 45);
    d += `M${f(p0[0])} ${f(p0[1])}${arc(startCorner, p1)}`;
  } else {
    d += `M${f(spec.sharpStart[0])} ${f(spec.sharpStart[1])}`;
  }
  if (endRound) {
    const p2 = point(endCorner, spec.endTo - 45);
    const p3 = point(endCorner, spec.endTo);
    d += `L${f(p2[0])} ${f(p2[1])}${arc(endCorner, p3)}`;
  } else {
    d += `L${f(spec.sharpEnd[0])} ${f(spec.sharpEnd[1])}`;
  }
  return d;
}

/** Borders: a uniform ring becomes an inset stroke; otherwise stroke each
 * visible side's centerline path independently. */
function paintBorders(
  box: Box,
  cs: CSSStyleDeclaration,
  radii: CornerRadii | null,
  shape: Shape,
  env: WalkEnv
): SvgNode[] {
  const { ctx } = env;
  const sides: { side: BorderSide; w: number; style: string; color: Rgba }[] = (
    [
      ['top', cs.borderTopWidth, cs.borderTopStyle, cs.borderTopColor],
      ['right', cs.borderRightWidth, cs.borderRightStyle, cs.borderRightColor],
      ['bottom', cs.borderBottomWidth, cs.borderBottomStyle, cs.borderBottomColor],
      ['left', cs.borderLeftWidth, cs.borderLeftStyle, cs.borderLeftColor],
    ] as const
  )
    .map(([side, w, style, color]) => ({
      side,
      w: px(w),
      style,
      color: env.normalizeColor(color),
    }))
    .filter((s) => s.w > 0 && s.style !== 'none' && s.color.a > 0);

  if (sides.length === 0) return [];
  for (const s of sides) {
    if (s.style !== 'solid') {
      throw new SvgExportUnsupportedError('border-style', s.style);
    }
  }

  const maskColor = (c: Rgba): Rgba =>
    ctx.maskMode ? { r: 255, g: 255, b: 255, a: c.a } : c;
  const strokeAttrs = (color: Rgba, width: number): Attrs => ({
    fill: 'none',
    stroke: rgbString(color),
    'stroke-opacity': color.a === 1 ? undefined : fmtNum(color.a, 4),
    'stroke-width': fmtNum(width, ctx.precision),
  });

  const first = sides[0];
  const sameColor = sides.every(
    (s) =>
      s.color.r === first.color.r &&
      s.color.g === first.color.g &&
      s.color.b === first.color.b &&
      s.color.a === first.color.a
  );
  const uniformRing =
    sides.length === 4 &&
    sameColor &&
    sides.every((s) => Math.abs(s.w - first.w) < 0.01);
  if (uniformRing) {
    return [
      shapeNode(
        insetShape(shape, first.w / 2, ctx.precision),
        strokeAttrs(maskColor(first.color), first.w),
        ctx.precision
      ),
    ];
  }

  // Where differently-colored sides meet at a sharp corner, CSS miters at
  // 45° - draw those sides as filled trapezoids. Same-colored sides (and
  // rounded corners, whose 45° arc split miters inherently) keep centerline
  // strokes.
  const visible = new Map(sides.map((s) => [s.side, s.w]));
  const sharp = {
    tl: !radii || (radii.tl[0] < 0.01 && radii.tl[1] < 0.01),
    tr: !radii || (radii.tr[0] < 0.01 && radii.tr[1] < 0.01),
    br: !radii || (radii.br[0] < 0.01 && radii.br[1] < 0.01),
    bl: !radii || (radii.bl[0] < 0.01 && radii.bl[1] < 0.01),
  };
  const sideCorners: Record<BorderSide, [keyof typeof sharp, keyof typeof sharp]> = {
    top: ['tl', 'tr'],
    right: ['tr', 'br'],
    bottom: ['br', 'bl'],
    left: ['bl', 'tl'],
  };

  return sides.map((s) => {
    const [c1, c2] = sideCorners[s.side];
    if (sameColor || !sharp[c1] || !sharp[c2]) {
      return {
        tag: 'path',
        attrs: {
          d: sideBorderPath(box, radii, s.side, s.w, ctx.precision),
          ...strokeAttrs(maskColor(s.color), s.w),
        },
      };
    }
    const f = (n: number) => fmtNum(n, ctx.precision);
    const adj = (side: BorderSide) => visible.get(side) ?? 0;
    const color = maskColor(s.color);
    // Outer edge corner-to-corner; inner edge inset by this side's width and
    // slanted in by each visible adjacent side's width (the 45° miter).
    let points: [number, number][];
    const { x, y, w: bw, h: bh } = box;
    switch (s.side) {
      case 'top':
        points = [[x, y], [x + bw, y], [x + bw - adj('right'), y + s.w], [x + adj('left'), y + s.w]];
        break;
      case 'right':
        points = [[x + bw, y], [x + bw, y + bh], [x + bw - s.w, y + bh - adj('bottom')], [x + bw - s.w, y + adj('top')]];
        break;
      case 'bottom':
        points = [[x + bw, y + bh], [x, y + bh], [x + adj('left'), y + bh - s.w], [x + bw - adj('right'), y + bh - s.w]];
        break;
      default:
        points = [[x, y + bh], [x, y], [x + s.w, y + adj('top')], [x + s.w, y + bh - adj('bottom')]];
        break;
    }
    return {
      tag: 'polygon',
      attrs: {
        points: points.map(([px2, py2]) => `${f(px2)},${f(py2)}`).join(' '),
        fill: rgbString(color),
        'fill-opacity': color.a === 1 ? undefined : fmtNum(color.a, 4),
      },
    };
  });
}

/** Parse computed clip-path into a clipPath def; returns its url() or null. */
function clipPathUrl(cs: CSSStyleDeclaration, box: Box, env: WalkEnv): string | null {
  const value = cs.clipPath;
  if (!value || value === 'none') return null;
  const { ctx } = env;
  const f = (n: number) => fmtNum(n, ctx.precision);
  const fnMatch = value.match(/^([a-z-]+)\(([\s\S]*)\)$/i);
  if (!fnMatch) throw new SvgExportUnsupportedError('clip-path', value);
  const fn = fnMatch[1].toLowerCase();
  const body = fnMatch[2];

  let content: SvgNode;
  if (fn === 'polygon') {
    const points = splitTopLevel(body)
      .map((pair) => {
        const [xTok, yTok] = pair.trim().split(/\s+/);
        return `${f(box.x + resolveLength(xTok, box.w))},${f(box.y + resolveLength(yTok ?? xTok, box.h))}`;
      })
      .join(' ');
    content = { tag: 'polygon', attrs: { points } };
  } else if (fn === 'inset') {
    const [insets, roundPart] = body.split(/\s+round\s+/);
    const tokens = insets.trim().split(/\s+/);
    const top = resolveLength(tokens[0], box.h);
    const right = resolveLength(tokens[1] ?? tokens[0], box.w);
    const bottom = resolveLength(tokens[2] ?? tokens[0], box.h);
    const left = resolveLength(tokens[3] ?? tokens[1] ?? tokens[0], box.w);
    const innerBox: Box = {
      x: box.x + left,
      y: box.y + top,
      w: box.w - left - right,
      h: box.h - top - bottom,
    };
    if (roundPart) {
      const [rh, rv = rh] = roundPart.trim().split('/').map((s) => s.trim());
      const radius: [number, number] = [
        resolveLength(rh.split(/\s+/)[0], innerBox.w),
        resolveLength(rv.split(/\s+/)[0], innerBox.h),
      ];
      const radii: CornerRadii = { tl: radius, tr: radius, br: radius, bl: radius };
      content = { tag: 'path', attrs: { d: roundedRectPath(innerBox, radii, ctx.precision) } };
    } else {
      content = {
        tag: 'rect',
        attrs: { x: f(innerBox.x), y: f(innerBox.y), width: f(innerBox.w), height: f(innerBox.h) },
      };
    }
  } else if (fn === 'circle' || fn === 'ellipse') {
    const [sizePart, posPart] = body.split(/\s+at\s+/);
    const posTokens = (posPart ?? '50% 50%').trim().split(/\s+/);
    const cx = box.x + resolveLength(posTokens[0], box.w);
    const cy = box.y + resolveLength(posTokens[1] ?? '50%', box.h);
    const sizeTokens = sizePart.trim().split(/\s+/).filter(Boolean);
    if (fn === 'circle') {
      const ref = Math.hypot(box.w, box.h) / Math.SQRT2;
      const r = sizeTokens[0] && sizeTokens[0] !== 'closest-side' && sizeTokens[0] !== 'farthest-side'
        ? resolveLength(sizeTokens[0], ref)
        : sizeTokens[0] === 'farthest-side'
          ? Math.max(cx - box.x, box.x + box.w - cx, cy - box.y, box.y + box.h - cy)
          : Math.min(cx - box.x, box.x + box.w - cx, cy - box.y, box.y + box.h - cy);
      content = { tag: 'circle', attrs: { cx: f(cx), cy: f(cy), r: f(r) } };
    } else {
      const rx = resolveLength(sizeTokens[0] ?? '50%', box.w);
      const ry = resolveLength(sizeTokens[1] ?? '50%', box.h);
      content = { tag: 'ellipse', attrs: { cx: f(cx), cy: f(cy), rx: f(rx), ry: f(ry) } };
    }
  } else if (fn === 'path') {
    const d = body.trim().replace(/^["']|["']$/g, '');
    content = {
      tag: 'path',
      attrs: { d, transform: `translate(${f(box.x)} ${f(box.y)})` },
    };
  } else {
    throw new SvgExportUnsupportedError('clip-path', value);
  }

  const id = addDef(ctx, { tag: 'clipPath', attrs: {}, children: [content] });
  return `url(#${id})`;
}

/** Build an SVG <mask> def from computed mask properties; url() or null. */
function maskUrl(cs: CSSStyleDeclaration, box: Box, env: WalkEnv): string | null {
  const image =
    cs.getPropertyValue('mask-image') || cs.getPropertyValue('-webkit-mask-image');
  if (!image || image === 'none') return null;
  const { ctx } = env;

  const size =
    cs.getPropertyValue('mask-size') || cs.getPropertyValue('-webkit-mask-size') || 'auto';
  const position =
    cs.getPropertyValue('mask-position') || cs.getPropertyValue('-webkit-mask-position') || '0% 0%';
  const repeat =
    cs.getPropertyValue('mask-repeat') || cs.getPropertyValue('-webkit-mask-repeat') || 'repeat';
  const composite = (
    cs.getPropertyValue('mask-composite') ||
    cs.getPropertyValue('-webkit-mask-composite') ||
    'add'
  ).trim();
  const layers = splitTopLevel(image);
  const addComposite = /^(add|source-over)(,\s*(add|source-over))*$/.test(composite);
  const intersectComposite = /^(intersect|source-in)(,\s*(intersect|source-in))*$/.test(composite);
  if (layers.length > 1 && !addComposite && !intersectComposite) {
    throw new SvgExportUnsupportedError('mask-composite', composite);
  }

  const sizes = splitTopLevel(size || 'auto');
  const positions = splitTopLevel(position || '0% 0%');
  const repeats = splitTopLevel(repeat || 'repeat');

  const f = (n: number) => fmtNum(n, ctx.precision);
  const regionAttrs = (): Attrs => ({
    maskUnits: 'userSpaceOnUse',
    x: f(box.x - box.w),
    y: f(box.y - box.h),
    width: f(box.w * 3),
    height: f(box.h * 3),
  });

  const wasMaskMode = ctx.maskMode;
  ctx.maskMode = true;
  let children: SvgNode[];
  try {
    const shape: Shape = { kind: 'rect', box };
    const layerContents: SvgNode[][] = [];
    for (let i = 0; i < layers.length; i++) {
      if (layers[i] === 'none') continue;
      layerContents.push(
        paintImageLayer(
          layers[i],
          shape,
          box,
          sizes[i % sizes.length],
          positions[i % positions.length],
          repeats[i % repeats.length],
          env
        )
      );
    }
    if (layerContents.length > 1 && intersectComposite) {
      // Intersection: mask each layer's content by the next layer, nested.
      children = layerContents.reduceRight((inner, layer) =>
        inner.length === 0
          ? layer
          : [
              {
                tag: 'g',
                attrs: {
                  mask: `url(#${addDef(ctx, { tag: 'mask', attrs: regionAttrs(), children: inner })})`,
                },
                children: layer,
              },
            ]
      );
    } else {
      // Additive layers paint bottom-up into one mask.
      children = layerContents.slice().reverse().flat();
    }
  } finally {
    ctx.maskMode = wasMaskMode;
  }
  if (children.length === 0) return null;
  const id = addDef(ctx, {
    tag: 'mask',
    attrs: {
      maskUnits: 'userSpaceOnUse',
      x: f(box.x - box.w),
      y: f(box.y - box.h),
      width: f(box.w * 3),
      height: f(box.h * 3),
    },
    children,
  });
  return `url(#${id})`;
}

/**
 * Absolute (userSpaceOnUse) filter region: `box` padded by the effect's
 * reach. Percentage regions clip badly on thin boxes (a 3px-tall glowing bar
 * needs a region dozens of times its height).
 */
function filterRegion(box: Box, pad: number, precision: number): Attrs {
  const f = (n: number) => fmtNum(n, precision);
  return {
    filterUnits: 'userSpaceOnUse',
    x: f(box.x - pad),
    y: f(box.y - pad),
    width: f(box.w + 2 * pad),
    height: f(box.h + 2 * pad),
  };
}

/** Filter for `filter: blur()`. Returns url() or null. */
function blurFilterUrl(cs: CSSStyleDeclaration, box: Box, env: WalkEnv): string | null {
  const value = cs.filter;
  if (!value || value === 'none') return null;
  const { ctx } = env;
  const fns = value.match(/[a-z-]+\([^)]*\)/gi) ?? [];
  const primitives: SvgNode[] = [];
  let reach = 0;
  for (const fnCall of fns) {
    const m = fnCall.match(/^([a-z-]+)\(([^)]*)\)$/i);
    if (!m) throw new SvgExportUnsupportedError('filter', fnCall);
    if (m[1].toLowerCase() === 'blur') {
      // Filter Effects: blur(v)'s parameter IS the Gaussian stdDeviation
      // (unlike shadow blur radii, which are 2σ).
      const std = px(m[2]);
      reach = Math.max(reach, std * 4 + 4);
      primitives.push({ tag: 'feGaussianBlur', attrs: { stdDeviation: fmtNum(std, 4) } });
    } else {
      throw new SvgExportUnsupportedError('filter function', m[1]);
    }
  }
  if (!primitives.length) return null;
  warn(ctx, 'filter: blur() exported as feGaussianBlur (may degrade in design tools)');
  const id = addDef(ctx, {
    tag: 'filter',
    attrs: filterRegion(box, reach, ctx.precision),
    children: primitives,
  });
  return `url(#${id})`;
}

type ParsedShadow = { color: Rgba; dx: number; dy: number; blur: number; spread: number; inset: boolean };

export function parseBoxShadows(
  value: string,
  normalizeColor: (raw: string) => Rgba
): ParsedShadow[] {
  if (!value || value === 'none') return [];
  return splitTopLevel(value).map((part) => {
    const inset = /\binset\b/.test(part);
    let rest = part.replace(/\binset\b/, '').trim();
    // Computed form: "<color> dx dy blur spread"
    const colorMatch = rest.match(/rgba?\([^)]*\)|^[a-z]+/i);
    let color: Rgba = { r: 0, g: 0, b: 0, a: 1 };
    if (colorMatch) {
      color = normalizeColor(colorMatch[0]);
      rest = rest.replace(colorMatch[0], '').trim();
    }
    const lengths = rest.split(/\s+/).map(px);
    return {
      color,
      dx: lengths[0] ?? 0,
      dy: lengths[1] ?? 0,
      blur: lengths[2] ?? 0,
      spread: lengths[3] ?? 0,
      inset,
    };
  });
}

/** Drop-shadow filter for box-shadow glows. Returns url() or null. */
function boxShadowFilterUrl(cs: CSSStyleDeclaration, box: Box, env: WalkEnv): string | null {
  const shadows = parseBoxShadows(cs.boxShadow, env.normalizeColor);
  const { ctx } = env;
  if (shadows.some((s) => s.inset)) {
    throw new SvgExportUnsupportedError('inset box-shadow');
  }
  if (!shadows.length) return null;
  if (shadows.some((s) => s.spread !== 0)) {
    warn(ctx, 'box-shadow spread approximated');
  }
  warn(ctx, 'box-shadow exported as an SVG drop-shadow filter (may degrade in design tools)');
  // Each CSS shadow derives independently from the box's alpha; stacked
  // beneath the source, first shadow on top. (Chained feDropShadows would
  // wrongly blur each shadow's OUTPUT into the next.)
  let reach = 0;
  const primitives: SvgNode[] = [];
  const mergeInputs: string[] = [];
  shadows.forEach((s, i) => {
    const std = Math.max(s.blur / 2 + s.spread / 2, 0);
    reach = Math.max(reach, std * 4 + Math.max(Math.abs(s.dx), Math.abs(s.dy)) + 4);
    primitives.push(
      {
        tag: 'feGaussianBlur',
        attrs: { in: 'SourceAlpha', stdDeviation: fmtNum(std, 4), result: `b${i}` },
      },
      {
        tag: 'feOffset',
        attrs: { in: `b${i}`, dx: fmtNum(s.dx, 3), dy: fmtNum(s.dy, 3), result: `o${i}` },
      },
      {
        tag: 'feFlood',
        attrs: {
          'flood-color': rgbString(s.color),
          'flood-opacity': s.color.a === 1 ? undefined : fmtNum(s.color.a, 4),
        },
      },
      {
        tag: 'feComposite',
        attrs: { in2: `o${i}`, operator: 'in', result: `s${i}` },
      }
    );
    mergeInputs.push(`s${i}`);
  });
  // CSS paints the first-listed shadow on top of later ones.
  mergeInputs.reverse();
  primitives.push({
    tag: 'feMerge',
    attrs: {},
    children: [
      ...mergeInputs.map((input) => ({ tag: 'feMergeNode', attrs: { in: input } })),
      { tag: 'feMergeNode', attrs: { in: 'SourceGraphic' } },
    ],
  });
  const id = addDef(ctx, {
    tag: 'filter',
    attrs: filterRegion(box, reach, ctx.precision),
    children: primitives,
  });
  return `url(#${id})`;
}

/**
 * Where a ::before/::after sits, given its host's *border* box.
 *
 * Neither kind of pseudo is laid out against the border box: an
 * absolutely-positioned one resolves its offsets against the padding box, a
 * static one is centred in the content box. On a borderless host the three
 * coincide - which is every pattern that predates batch 11's frames - but on a
 * bordered one, using the border box displaces the pseudo by the border width.
 *
 * Returns null when the pseudo has no area to paint.
 */
function pseudoBoxFor(
  box: Box,
  hostCs: CSSStyleDeclaration,
  cs: CSSStyleDeclaration
): Box | null {
  const padBox: Box = {
    x: box.x + px(hostCs.borderLeftWidth),
    y: box.y + px(hostCs.borderTopWidth),
    w: box.w - px(hostCs.borderLeftWidth) - px(hostCs.borderRightWidth),
    h: box.h - px(hostCs.borderTopWidth) - px(hostCs.borderBottomWidth),
  };

  let w: number;
  let h: number;
  let x: number;
  let y: number;
  if (cs.position === 'absolute' || cs.position === 'fixed') {
    const left = cs.left;
    const right = cs.right;
    const top = cs.top;
    const bottom = cs.bottom;
    const width = cs.width;
    const height = cs.height;
    const ml = px(cs.marginLeft);
    const mt = px(cs.marginTop);

    if (width !== 'auto') w = px(width);
    else if (left !== 'auto' && right !== 'auto') w = padBox.w - px(left) - px(right);
    else w = 0;
    if (height !== 'auto') h = px(height);
    else if (top !== 'auto' && bottom !== 'auto') h = padBox.h - px(top) - px(bottom);
    else h = 0;

    if (left !== 'auto') x = padBox.x + px(left) + ml;
    else if (right !== 'auto') x = padBox.x + padBox.w - px(right) - w + ml;
    else x = padBox.x + (padBox.w - w) / 2 + ml;
    if (top !== 'auto') y = padBox.y + px(top) + mt;
    else if (bottom !== 'auto') y = padBox.y + padBox.h - px(bottom) - h + mt;
    else y = padBox.y + (padBox.h - h) / 2 + mt;
  } else {
    // Static pseudo inside a css-doodle cell: the cell is a grid with
    // place-items:center, so a sized pseudo sits centered in the content box.
    const pl = px(hostCs.paddingLeft);
    const pt = px(hostCs.paddingTop);
    const pr = px(hostCs.paddingRight);
    const pb = px(hostCs.paddingBottom);
    w = cs.width === 'auto' ? 0 : px(cs.width);
    h = cs.height === 'auto' ? 0 : px(cs.height);
    if (w <= 0 || h <= 0) return null;
    x = padBox.x + pl + (padBox.w - pl - pr - w) / 2;
    y = padBox.y + pt + (padBox.h - pt - pb - h) / 2;
  }
  if (w <= 0 || h <= 0) return null;
  return { x, y, w, h };
}

/** Paint a ::before/::after pseudo-element of `el`. */
function paintPseudo(
  el: HTMLElement,
  pseudo: '::before' | '::after',
  box: Box,
  env: WalkEnv
): { z: number; nodes: SvgNode[] } {
  const none = { z: 0, nodes: [] };
  const cs = env.getStyle(el, pseudo);
  const content = cs.content;
  if (!content || content === 'none' || cs.display === 'none') return none;
  if (!/^(""|''|normal)$/.test(content)) {
    throw new SvgExportUnsupportedError('pseudo-element text content', content);
  }
  if (cs.visibility === 'hidden') return none;

  const pseudoBox = pseudoBoxFor(box, env.getStyle(el), cs);
  if (!pseudoBox) return none;

  const z = cs.zIndex === 'auto' ? 0 : parseInt(cs.zIndex, 10) || 0;
  return { z, nodes: paintPaintedBox(pseudoBox, cs, env, []) };
}

/**
 * Paint a box (element or pseudo) with all its effects. `childNodes` are the
 * already-painted descendants (empty for pseudo-elements).
 */
function paintPaintedBox(
  box: Box,
  cs: CSSStyleDeclaration,
  env: WalkEnv,
  childNodes: SvgNode[]
): SvgNode[] {
  const { ctx } = env;

  let bgNodes = paintBoxLayers(box, cs, env);

  // box-shadow applies to the border-box shape only, not descendants.
  const shadowFilter = boxShadowFilterUrl(cs, box, env);
  if (shadowFilter) {
    if (bgNodes.length === 0) {
      warn(ctx, 'box-shadow on a box without visible background was dropped');
    } else {
      bgNodes = [{ tag: 'g', attrs: { filter: shadowFilter }, children: bgNodes }];
    }
  }

  let nodes = [...bgNodes, ...childNodes];
  if (nodes.length === 0) return [];

  // Effects, innermost -> outermost. Per the Filter Effects rendering model:
  // children -> filter -> clip-path -> mask -> opacity/blend, with the transform
  // mapping the final result.
  const blur = blurFilterUrl(cs, box, env);
  nodes = group(nodes, { filter: blur ?? undefined });

  const clip = clipPathUrl(cs, box, env);
  nodes = group(nodes, { 'clip-path': clip ?? undefined });

  const mask = maskUrl(cs, box, env);
  nodes = group(nodes, { mask: mask ?? undefined });

  const matrix = parseTransformMatrix(cs.transform);
  const originTokens = cs.transformOrigin.split(/\s+/);
  const originX = box.x + px(originTokens[0] ?? '0');
  const originY = box.y + px(originTokens[1] ?? '0');
  const opacity = parseFloat(cs.opacity);
  const blend = cs.mixBlendMode && cs.mixBlendMode !== 'normal' ? cs.mixBlendMode : undefined;
  if (blend) {
    ctx.usesBlend = true;
    warn(ctx, 'mix-blend-mode exported as an SVG style (may degrade in design tools)');
  }
  nodes = group(nodes, {
    transform: transformAttr(matrix, originX, originY, ctx.precision),
    opacity: opacity < 1 ? fmtNum(opacity, 4) : undefined,
    style: blend ? `mix-blend-mode:${blend}` : undefined,
  });

  return nodes;
}

/** Recursively paint an element subtree rooted at `el`. */
function paintElement(el: HTMLElement, env: WalkEnv): SvgNode[] {
  const cs = env.getStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return [];

  const box = env.boxes.get(el);
  if (!box) return [];

  // Pseudo-elements join the paint list as first/last siblings, so a
  // z-index on either (plait flips its strand layering this way) reorders
  // them exactly like CSS stacking does.
  const before = paintPseudo(el, '::before', box, env);
  const after = paintPseudo(el, '::after', box, env);

  const kids: { z: number; order: number; nodes: SvgNode[] }[] = [
    { z: before.z, order: -1, nodes: before.nodes },
  ];
  let order = 0;
  for (const child of Array.from(el.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (child.tagName === 'STYLE') continue;
    const childCs = env.getStyle(child);
    const z = childCs.zIndex === 'auto' ? 0 : parseInt(childCs.zIndex, 10) || 0;
    kids.push({ z, order: order++, nodes: paintElement(child, env) });
  }
  kids.push({ z: after.z, order: order + 1, nodes: after.nodes });
  kids.sort((a, b) => a.z - b.z || a.order - b.order);

  let content = kids.flatMap((k) => k.nodes);

  // overflow:hidden clips descendants (and pseudos) to the border box.
  if (content.length > 0 && cs.overflow !== 'visible' && cs.overflow !== '') {
    const radii = readRadii(cs, box);
    const shape = shapeFor(box, radii, env.ctx.precision);
    const clipId = addDef(env.ctx, {
      tag: 'clipPath',
      attrs: {},
      children: [shapeNode(shape, {}, env.ctx.precision)],
    });
    content = [{ tag: 'g', attrs: { 'clip-path': `url(#${clipId})` }, children: content }];
  }

  return paintPaintedBox(box, cs, env, content);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Snapshot a live `<css-doodle>` element into a native SVG document.
 * Synchronous: reads the DOM as-is (callers should let render transitions
 * settle first - the tabbied controller's exportSvg() does).
 */
export function doodleToSvg(
  element: HTMLElement,
  options: SvgExportOptions = {}
): SvgExportResult {
  const shadow = element.shadowRoot;
  if (!shadow) {
    throw new Error('[tabbied] doodleToSvg: element has no rendered shadow root');
  }
  const grid = shadow.querySelector('cssd-grid') as HTMLElement | null;
  if (!grid) {
    throw new Error('[tabbied] doodleToSvg: no rendered cssd-grid found');
  }

  const boxes = new WeakMap<Element, Box>();
  measureTree(shadow, grid, 0, 0, boxes);
  const gridBox = boxes.get(grid)!;
  const width = gridBox.w;
  const height = gridBox.h;
  if (!width || !height) {
    throw new Error('[tabbied] doodleToSvg: element has zero size');
  }

  const ctx: Ctx = {
    precision: options.precision ?? 3,
    defs: [],
    defsIndex: new Map(),
    idCounter: 0,
    warnings: new Set(),
    usesBlend: false,
    maskMode: false,
  };

  // Color normalization: fast path for rgb()/rgba(); everything else round-
  // trips through a probe element so wide-gamut serializations become sRGB.
  const probes: HTMLElement[] = [];
  const normalizeColor = (raw: string): Rgba => {
    const fast = parseRgbColor(raw);
    if (fast) return fast;
    if (probes.length === 0) {
      const span = document.createElement('span');
      span.style.display = 'none';
      document.body.appendChild(span);
      probes.push(span);
    }
    const probe = probes[0];
    probe.style.color = '';
    probe.style.color = raw;
    // An unparseable value leaves the property empty - fail loudly instead
    // of silently inheriting some unrelated color.
    if (!probe.style.color) throw new SvgExportUnsupportedError('color', raw);
    const resolved = parseRgbColor(getComputedStyle(probe).color);
    if (!resolved) throw new SvgExportUnsupportedError('color', raw);
    return resolved;
  };

  const view = element.ownerDocument.defaultView ?? window;
  const env: WalkEnv = {
    ctx,
    getStyle: (el, pseudo) => view.getComputedStyle(el, pseudo ?? null),
    normalizeColor,
    boxes,
  };

  let bodyNodes: SvgNode[];
  try {
    // The host's own background (usually transparent - tabbied patterns put
    // color0 on the grid container).
    const hostBg = normalizeColor(env.getStyle(element).backgroundColor);
    bodyNodes = [];
    if (hostBg.a > 0) {
      bodyNodes.push({
        tag: 'rect',
        attrs: {
          x: 0,
          y: 0,
          width: fmtNum(width, ctx.precision),
          height: fmtNum(height, ctx.precision),
          fill: rgbString(hostBg),
          'fill-opacity': hostBg.a === 1 ? undefined : fmtNum(hostBg.a, 4),
        },
      });
    }
    bodyNodes.push(...paintElement(grid, env));
  } finally {
    for (const probe of probes) probe.remove();
  }

  const root: SvgNode = {
    tag: 'svg',
    attrs: {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: `0 0 ${fmtNum(width, ctx.precision)} ${fmtNum(height, ctx.precision)}`,
      style: ctx.usesBlend ? 'isolation:isolate' : undefined,
    },
    children: [
      ...(ctx.defs.length ? [{ tag: 'defs', attrs: {}, children: ctx.defs }] : []),
      ...bodyNodes,
    ],
  };

  // `__raw__` placeholder nodes carry verbatim nested-SVG payloads.
  const svg = serializeNode(root).replace(
    /<__raw__ __source__="([\s\S]*?)"\/>/g,
    (_, escaped: string) =>
      escaped
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
  );

  return { svg, width, height, warnings: [...ctx.warnings] };
}

/** Private: exposed for unit tests only. Not part of the public API. */
export const _internals = {
  splitTopLevel,
  parseRgbColor,
  resolveLength,
  resolveCalc,
  angleToDeg,
  parseTransformMatrix,
  roundedRectPath,
  sectorPath,
  parseConicSectors,
  parseBoxShadows,
  fmtNum,
  originBox,
  pseudoBoxFor,
};
