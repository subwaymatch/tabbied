// Studio's matcher: prose in, three template sites out.
//
// This is deliberately not a model call. Everything Studio needs to answer with
// already exists in the repo - 57 finished template sites, each built on one of
// the 295 patterns and one of the 437 palettes, each with a real preview page
// and a real downloadable zip. So a description is matched against that library
// rather than used to generate anything, and every result is a site a person can
// open and download today.
//
// It runs in the browser, which is why it takes a prebuilt index (see
// lib/studioDirections.ts) instead of importing the catalog: the vocabulary for
// 57 sites is a few kilobytes, the catalog is 384 KB.
//
// When the AI gateway in agent-outputs/20260827-studio-ai-plan.md lands, it
// replaces `matchDirections` and nothing above it has to change.

/** One template site, reduced to what matching and the result card need. */
export type StudioEntry = {
  slug: string;
  name: string;
  topic: string;
  patternSlug: string;
  patternName: string;
  paletteName: string;
  palette: string[];
  /** Catalog mood + tags, title-cased for the card's second line. */
  descriptors: string[];
  /** Search vocabulary by weight. */
  topicTerms: string[];
  moods: string[];
  tags: string[];
  density: string;
  /** Hues present in the palette, for colour words in the description. */
  hues: number[];
  /** True when the palette is essentially greyscale. */
  neutral: boolean;
};

export type StudioDirection = StudioEntry & {
  score: number;
  /** Why this one surfaced, for the card's "matched on" line. */
  reasons: string[];
};

const STOPWORDS = new Set([
  'the', 'and', 'for', 'our', 'with', 'that', 'this', 'are', 'was', 'have',
  'has', 'from', 'you', 'your', 'they', 'their', 'want', 'need', 'like',
  'look', 'feel', 'make', 'get', 'use', 'about', 'who', 'help', 'helping',
  'were', 'been', 'more', 'most', 'very', 'some', 'all', 'but', 'not', 'can',
  'will', 'would', 'should', 'business', 'company', 'brand', 'website',
  'site', 'page', 'new', 'good', 'great', 'best', 'also', 'just', 'well',
]);

/**
 * Everyday words a person actually writes, mapped onto the closed catalog
 * vocabulary in packages/tabbied/scripts/catalog-vocabulary.mjs. One word may
 * legitimately imply two moods - "friendly" is both playful and organic.
 */
const MOOD_WORDS: Record<string, string[]> = {
  bold: ['bold'], strong: ['bold'], striking: ['bold'], confident: ['bold'],
  dramatic: ['bold'], punchy: ['bold'], loud: ['bold'], vivid: ['bold'],
  calm: ['calm'], quiet: ['calm'], minimal: ['calm'], minimalist: ['calm'],
  simple: ['calm'], clean: ['calm'], serene: ['calm'], understated: ['calm'],
  professional: ['calm'], trustworthy: ['calm'], trusted: ['calm'],
  reliable: ['calm'], subtle: ['calm'], restrained: ['calm'],
  elegant: ['elegant'], refined: ['elegant'], luxury: ['elegant'],
  luxurious: ['elegant'], premium: ['elegant'], sophisticated: ['elegant'],
  upscale: ['elegant'], timeless: ['elegant'], classic: ['elegant', 'retro'],
  boutique: ['elegant'], couture: ['elegant'],
  festive: ['festive'], celebratory: ['festive'], cheerful: ['festive'],
  vibrant: ['festive', 'bold'], lively: ['festive'], joyful: ['festive'],
  organic: ['organic'], natural: ['organic'], earthy: ['organic'],
  warm: ['organic'], handmade: ['organic'], artisan: ['organic'],
  artisanal: ['organic'], botanical: ['organic'], soft: ['organic'],
  rustic: ['organic'], wellness: ['organic'], sustainable: ['organic'],
  playful: ['playful'], friendly: ['playful', 'organic'], fun: ['playful'],
  quirky: ['playful'], whimsical: ['playful'], kids: ['playful'],
  children: ['playful'], family: ['playful', 'organic'],
  families: ['playful', 'organic'], casual: ['playful'],
  approachable: ['playful', 'organic'], welcoming: ['playful', 'organic'],
  retro: ['retro'], vintage: ['retro'], nostalgic: ['retro'],
  midcentury: ['retro'], seventies: ['retro'], heritage: ['retro'],
  technical: ['technical'], precise: ['technical'], modern: ['technical'],
  contemporary: ['technical'], industrial: ['technical'],
  engineering: ['technical'], architectural: ['technical'],
  geometric: ['technical'], systematic: ['technical'], structured: ['technical'],
  editorial: ['technical', 'elegant'], swiss: ['technical'],
};

/** Colour words to a representative hue angle, matched against the palettes. */
const HUE_WORDS: Record<string, number> = {
  red: 0, crimson: 0, scarlet: 5, ruby: 0, cherry: 355,
  orange: 30, amber: 40, rust: 25, terracotta: 25, apricot: 35, coral: 15,
  yellow: 55, gold: 50, golden: 50, mustard: 50, honey: 45, butter: 55,
  green: 140, olive: 90, sage: 130, emerald: 150, forest: 145, mint: 160,
  lime: 100, moss: 120,
  teal: 180, turquoise: 180, aqua: 185, cyan: 190,
  blue: 220, navy: 225, cobalt: 230, azure: 210, sky: 205, indigo: 260,
  purple: 285, violet: 280, lilac: 285, lavender: 275, plum: 300, aubergine: 300,
  pink: 335, magenta: 320, rose: 345, blush: 350, fuchsia: 320,
  brown: 30, tan: 35, beige: 40, sand: 45, clay: 25, chocolate: 25,
};

const NEUTRAL_WORDS = new Set([
  'black', 'white', 'grey', 'gray', 'monochrome', 'mono', 'greyscale',
  'grayscale', 'neutral', 'charcoal', 'slate', 'ink', 'stone',
]);

const DENSITY_WORDS: Record<string, string> = {
  busy: 'dense', dense: 'dense', rich: 'dense', detailed: 'dense',
  intricate: 'dense', packed: 'dense', maximal: 'dense',
  airy: 'sparse', spacious: 'sparse', sparse: 'sparse', roomy: 'sparse',
  breathable: 'sparse', open: 'sparse',
};

/**
 * Crude suffix stripping - enough that "families" reaches "family" and
 * "bakeries" reaches "bakery". Only used for topic matching, where the words
 * are ordinary nouns; the mood and colour maps are looked up on raw words.
 */
export function stem(word: string): string {
  if (word.endsWith('ies') && word.length > 4) {
    return `${word.slice(0, -3)}y`;
  }
  if (word.endsWith('sses') || word.endsWith('shes') || word.endsWith('ches')) {
    return word.slice(0, -2);
  }
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) {
    return word.slice(0, -1);
  }
  if (word.endsWith('ing') && word.length > 6) {
    return word.slice(0, -3);
  }

  return word;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));
}

/** Hue angle of a #rrggbb colour, or null when it is close to greyscale. */
export function hexHue(hex: string): number | null {
  // Palettes may carry a literal `transparent` in slot 0 - that is what lets a
  // pattern field read over a photograph - so anything that is not a six-digit
  // hex simply has no hue.
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    return null;
  }

  const value = hex.slice(1);
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;

  // Below this the colour reads as a neutral and its hue is meaningless.
  if (chroma < 0.08) {
    return null;
  }

  let hue: number;
  if (max === r) {
    hue = ((g - b) / chroma) % 6;
  } else if (max === g) {
    hue = (b - r) / chroma + 2;
  } else {
    hue = (r - g) / chroma + 4;
  }

  return ((hue * 60) % 360 + 360) % 360;
}

/** Shortest distance between two hue angles, 0-180. */
function hueDistance(a: number, b: number): number {
  const raw = Math.abs(a - b) % 360;

  return raw > 180 ? 360 - raw : raw;
}

/** Stable 32-bit hash, so the same description always ranks ties the same way. */
function hash(text: string): number {
  let h = 0x811c9dc5;

  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }

  return h >>> 0;
}

const WEIGHT = { topic: 4, mood: 3, hue: 2, tag: 2, density: 1 } as const;

/** How close two hues must be for a colour word to count as matched. */
const HUE_TOLERANCE = 30;

type Wanted = {
  words: Set<string>;
  stems: Set<string>;
  /** Mood to how many words in the description asked for it. */
  moods: Map<string, number>;
  hues: number[];
  neutral: boolean;
  tags: Set<string>;
  density: string | null;
};

function readDescription(description: string, vocabulary: Set<string>): Wanted {
  const words = tokenize(description);
  const moods = new Map<string, number>();
  const tags = new Set<string>();
  const hues: number[] = [];
  let neutral = false;
  let density: string | null = null;

  for (const word of words) {
    for (const mood of MOOD_WORDS[word] ?? []) {
      moods.set(mood, (moods.get(mood) ?? 0) + 1);
    }
    if (word in HUE_WORDS) {
      hues.push(HUE_WORDS[word]);
    }
    if (NEUTRAL_WORDS.has(word)) {
      neutral = true;
    }
    if (word in DENSITY_WORDS) {
      density = DENSITY_WORDS[word];
    }
    // A shape named outright ("waves", "stripes") is a direct tag hit.
    if (vocabulary.has(word)) {
      tags.add(word);
    }
  }

  return {
    words: new Set(words),
    stems: new Set(words.map(stem)),
    moods,
    hues,
    neutral,
    tags,
    density,
  };
}

function scoreEntry(entry: StudioEntry, wanted: Wanted) {
  let score = 0;
  const reasons: string[] = [];

  const topicHits = entry.topicTerms.filter((term) => wanted.stems.has(term));
  if (topicHits.length) {
    score += WEIGHT.topic * topicHits.length;
    reasons.push(topicHits[0]);
  }

  // Scored by votes, so a mood the description asked for three different ways
  // outranks one it only glanced at.
  const moodHits = entry.moods.filter((mood) => wanted.moods.has(mood));
  for (const mood of moodHits) {
    score += WEIGHT.mood * (wanted.moods.get(mood) ?? 1);
  }
  reasons.push(...moodHits);

  const tagHits = entry.tags.filter((tag) => wanted.tags.has(tag));
  if (tagHits.length) {
    score += WEIGHT.tag * tagHits.length;
    reasons.push(...tagHits);
  }

  if (wanted.neutral && entry.neutral) {
    score += WEIGHT.hue;
    reasons.push('neutral');
  }

  for (const hue of wanted.hues) {
    if (entry.hues.some((own) => hueDistance(own, hue) <= HUE_TOLERANCE)) {
      score += WEIGHT.hue;
      const word = Object.keys(HUE_WORDS).find((key) => HUE_WORDS[key] === hue);
      if (word) {
        reasons.push(word);
      }
    }
  }

  if (wanted.density && entry.density === wanted.density) {
    score += WEIGHT.density;
    reasons.push(entry.density);
  }

  return { score, reasons: Array.from(new Set(reasons)).slice(0, 3) };
}

/**
 * Three sites that read as three different directions rather than three near
 * copies: after the best match, a candidate is penalised for repeating a mood
 * or sitting within a hue of one already chosen.
 */
export function matchDirections(
  entries: StudioEntry[],
  description: string,
  count = 3
): StudioDirection[] {
  const vocabulary = new Set(entries.flatMap((entry) => entry.tags));
  const wanted = readDescription(description, vocabulary);
  const seed = hash(description.trim().toLowerCase());

  const scored: StudioDirection[] = entries.map((entry) => {
    const { score, reasons } = scoreEntry(entry, wanted);

    return { ...entry, score, reasons };
  });

  // Ties - including the all-zero case of an empty description - break on a
  // hash of the text, so a given description always yields the same three and
  // two different descriptions rarely yield the same three.
  const tiebreak = (entry: StudioDirection) => hash(`${seed}:${entry.slug}`);
  const remaining = scored
    .slice()
    .sort((a, b) => b.score - a.score || tiebreak(a) - tiebreak(b));

  const chosen: StudioDirection[] = [];

  while (chosen.length < count && remaining.length) {
    let bestIndex = 0;
    let bestValue = -Infinity;

    remaining.forEach((candidate, index) => {
      let value = candidate.score;

      for (const picked of chosen) {
        if (candidate.moods.some((mood) => picked.moods.includes(mood))) {
          value -= 3;
        }
        const clash = candidate.hues.some((hue) =>
          picked.hues.some((other) => hueDistance(hue, other) <= HUE_TOLERANCE)
        );
        if (clash) {
          value -= 2;
        }
        // Two cards drawn from the same motif read as one direction shown
        // twice, however different their palettes are.
        if (candidate.tags[0] && candidate.tags[0] === picked.tags[0]) {
          value -= 2;
        }
      }

      // Keep the deterministic order among equals.
      if (value > bestValue) {
        bestValue = value;
        bestIndex = index;
      }
    });

    chosen.push(remaining.splice(bestIndex, 1)[0]);
  }

  return chosen;
}
