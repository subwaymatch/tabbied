// Content + theming for the twenty template sites. Each site is a fictional
// brand whose primary design accent is a Tabbied pattern rendered by the
// `TabbiedPattern` React component (see TemplateSite.tsx). Every site is themed
// with one palette from the Tabbied library (lib/paletteLibrary.ts) and built
// around one preset pattern, so the template spans twenty distinct
// palette/pattern pairings.
//
// Sites 11-20 were authored here; sites 1-10 began life as self-contained
// static-HTML builds under public/samples/ and were ported into this stack once
// it was clear both were rendering the same four layouts and the same nineteen
// section types from two separate codebases.
//
// The pattern definition itself is imported by each route's page.tsx (so the
// bundler ships only the presets in use) and passed to TemplateSite; this file
// carries everything else.

export type TemplateLayout = 'spotlight' | 'split' | 'editorial' | 'boutique';

export type TemplateItem = {
  eyebrow: string;
  title: string;
  meta: string;
  /** Key into TemplateContent.images for this card's prompt. */
  seed: string;
};

export type TemplateSite = {
  slug: string;
  brand: string;
  topic: string;
  /** Primary pattern slug, matches the gallery thumbnail and metadata. */
  pattern: string;
  /** All patterns the site renders (primary first); each is imported by the route. */
  patterns: string[];
  /** Library palette id + name (for the gallery) and colors (background first). */
  paletteId: string;
  paletteName: string;
  colors: string[];
  layout: TemplateLayout;
  /** Google Fonts family names: [display, body]. Loaded via <link> in the page. */
  fonts: { href: string; display: string; body: string };
  /**
   * Optional per-site letter-spacing, added on top of every tracked rule in
   * TemplateSite.module.css (and inherited by the rest). Negative tightens.
   */
  tracking?: string;
  /**
   * Lay every section on the page's own background instead of alternating tone
   * bands, so the site reads as one continuous field.
   */
  flatSections?: boolean;
  favicon: string;
  nav: string[];
  eyebrow: string;
  /** Hero title supports a single {em}...{/em} span for the accent color. */
  title: string;
  lede: string;
  primaryCta: string;
  secondaryCta: string;
  /** Small marquee / ticker phrases (spotlight + editorial). */
  ticker?: string[];
  /** Stat strip (split/spotlight). */
  stats?: { n: string; l: string }[];
  /** Optional index label above the section title. */
  sectionKicker?: string;
  sectionTitle: string;
  sectionSub: string;
  items: TemplateItem[];
  /** Closing band copy. */
  bandTitle: string;
  bandCta: string;
  /** split only, put the doodle panel on the left. */
  reverse?: boolean;
};

const gf = (families: string) =>
  `https://fonts.googleapis.com/css2?${families}&display=swap`;

export const TEMPLATE_SITES: TemplateSite[] = [
  // 11, Solstice · wellness / yoga retreat · Sunset · lobe
  {
    slug: 'solstice',
    flatSections: true,
    brand: 'Solstice',
    topic: 'Yoga & wellness retreat',
    pattern: 'lobe',
    patterns: ['lobe', 'blossom', 'spark', 'frond'],
    paletteId: 'lib-sunset',
    paletteName: 'Sunset',
    colors: ['#2b1d3a', '#ff6b6b', '#ffd23e', '#ff3d8b', '#7048e8'],
    layout: 'split',
    fonts: {
      href: gf('family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:opsz,wght@6..12,300..700'),
      display: "'Fraunces', Georgia, serif",
      body: "'Karla', system-ui, sans-serif",
    },
    favicon: '\u{1F305}',
    nav: ['Retreats', 'Classes', 'Teachers', 'Journal'],
    eyebrow: 'Coastal retreats · Small groups',
    title: 'Come back to {em}yourself{/em}.',
    lede: 'Seven-day yoga and breath-work retreats on the edge of the Pacific, unhurried mornings, long horizons, and nothing to be but here.',
    primaryCta: 'See 2026 dates',
    secondaryCta: 'How it works',
    stats: [
      { n: '7 days', l: 'Per retreat' },
      { n: '12', l: 'Guests max' },
      { n: '2:1', l: 'Guest to teacher' },
    ],
    sectionTitle: 'Upcoming retreats',
    sectionSub: 'Seasons on the coast, each with its own rhythm.',
    items: [
      { eyebrow: 'Spring', title: 'Tidewater Reset', meta: 'Big Sur · Apr 12-19', seed: 'sol1' },
      { eyebrow: 'Summer', title: 'Long Light', meta: 'Mendocino · Jun 20-27', seed: 'sol2' },
      { eyebrow: 'Autumn', title: 'Amber Hours', meta: 'Sonoma · Sep 14-21', seed: 'sol3' },
    ],
    bandTitle: 'Your quietest week of the year is waiting.',
    bandCta: 'Reserve your mat',
  },

  // 12, Harbor & Vine · natural wine bar · Cranberry · quilt
// 13, Lumen · design conference · Arcade · spectrum
// 14, Fathom · ocean research nonprofit · Lagoon · lattice
// 15, Ember & Oak · wood-fire restaurant · Ember · windowpane
  {
    slug: 'ember-and-oak',
    flatSections: true,
    brand: 'Ember & Oak',
    topic: 'Wood-fire restaurant',
    pattern: 'windowpane',
    patterns: ['windowpane', 'chamfer', 'fluting', 'merlon'],
    paletteId: 'lib-ember',
    paletteName: 'Ember',
    colors: ['#1a0f0a', '#e0511f', '#ff9f1c', '#ffe8c7'],
    layout: 'boutique',
    fonts: {
      href: gf('family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Libre+Franklin:wght@300;400;500;600'),
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Libre Franklin', system-ui, sans-serif",
    },
    favicon: '\u{1F525}',
    nav: ['Menu', 'Reservations', 'Private Dining', 'About'],
    eyebrow: 'Live fire · Seasonal',
    title: 'Everything touched by {em}flame{/em}.',
    lede: 'A single wood-fired hearth, a menu that changes with the market, and a room built around the glow of the coals.',
    primaryCta: 'Reserve a table',
    secondaryCta: 'View the menu',
    sectionTitle: 'From the hearth',
    sectionSub: 'Tonight\'s fire, plated three ways.',
    items: [
      { eyebrow: 'To start', title: 'Charred Leek', meta: 'ember cream · hazelnut', seed: 'emb1' },
      { eyebrow: 'The main', title: 'Oak-Fired Rib', meta: '45-day · bone marrow', seed: 'emb2' },
      { eyebrow: 'To finish', title: 'Smoked Pear', meta: 'honey · burnt cream', seed: 'emb3' },
    ],
    bandTitle: 'The best seat in the house faces the fire.',
    bandCta: 'Book your evening',
  },

  // 16, Petal & Post · florist + stationery · Blush · frond
// 17, Northwind · outdoor apparel · Forest · maze
// 18, Honeycomb · kids learning app · Honey · bokeh
// 19, Facet · fine jewelry · Jewel · prisma
  {
    slug: 'facet',
    flatSections: true,
    brand: 'Facet',
    topic: 'Fine jewelry brand',
    pattern: 'prisma',
    patterns: ['prisma', 'diadem', 'chamfer', 'vitrail'],
    paletteId: 'lib-jewel',
    paletteName: 'Jewel',
    colors: ['#0b1021', '#5b2a86', '#2176ae', '#57b8ff', '#fbb13c'],
    layout: 'boutique',
    fonts: {
      href: gf('family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500;600'),
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Jost', system-ui, sans-serif",
    },
    favicon: '\u{1F48E}',
    nav: ['Collections', 'Bespoke', 'Our Stones', 'Appointments'],
    eyebrow: 'Ethically sourced · Made to order',
    title: 'Light, {em}cut to keep{/em}.',
    lede: 'Fine jewelry built around a single remarkable stone, traceable, hand-set, and made to outlast every trend.',
    primaryCta: 'View collections',
    secondaryCta: 'Book an appointment',
    sectionTitle: 'The Prism collection',
    sectionSub: 'Colour, held to the light.',
    items: [
      { eyebrow: 'N° 01', title: 'Aurora Ring', meta: 'sapphire · 18k', seed: 'fac1' },
      { eyebrow: 'N° 02', title: 'Spectra Drop', meta: 'tourmaline · platinum', seed: 'fac2' },
      { eyebrow: 'N° 03', title: 'Facet Band', meta: 'diamond · rose gold', seed: 'fac3' },
    ],
    bandTitle: 'Bring us a stone, or start with a spark.',
    bandCta: 'Design something bespoke',
  },

  // 20, Seabright · coastal skincare · Seaglass · metro
// ---- Ported from the static-HTML samples (sites 1-10) ----
{
    slug: 'verdant',
    brand: 'Verdant',
    topic: 'Indoor plant shop',
    pattern: 'foliage',
    patterns: ['foliage', 'frond', 'ivy', 'blossom'],
    paletteId: 'lib-fern',
    paletteName: 'Fern',
    colors: ['#f4faf0', '#2d6a4f', '#95d5b2', '#1b4332'],
    layout: 'split',
    fonts: {
      href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito+Sans:opsz,wght@6..12,300..700&display=swap',
      display: "'DM Serif Display', Georgia, serif",
      body: "'Nunito Sans', system-ui, sans-serif",
    },
    favicon: '\u{1F33F}',
    nav: ['Shop', 'Care Guides', 'Gifts', 'Studio'],
    eyebrow: 'Hand-picked · Delivered potted',
    title: 'Green, made {em}easy{/em}.',
    lede: 'Hand-picked houseplants matched to your light, delivered to your door with everything they need to thrive.',
    primaryCta: 'Find your plant',
    secondaryCta: 'Care quiz',
    stats: [{ n: 'Next-day', l: 'Local delivery' }, { n: '30-day', l: 'Thrive promise' }, { n: '120+', l: 'Varieties' }],
    sectionTitle: 'Easy-care favourites',
    sectionSub: 'Cut this morning, potted and ready to go.',
    items: [
      { eyebrow: 'Low light', title: 'ZZ Plant', meta: '$32', seed: 'v1' },
      { eyebrow: 'Bright indirect', title: 'Fiddle Fig', meta: '$68', seed: 'v2' },
      { eyebrow: 'Statement', title: 'Bird of Paradise', meta: '$95', seed: 'v3' },
    ],
    bandTitle: 'Your greenest room is one box away.',
    bandCta: 'Start the quiz',
    reverse: true,
  },

{
    slug: 'nocturne',
    flatSections: true,
    brand: 'Nocturne',
    topic: 'Fragrance for the small hours',
    pattern: 'veil',
    patterns: ['veil', 'bokeh', 'lunette', 'prisma'],
    paletteId: 'lib-amethyst',
    paletteName: 'Amethyst',
    colors: ['#12071f', '#5a189a', '#9d4edd', '#e0aaff'],
    layout: 'boutique',
    fonts: {
      href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;400;500;600&display=swap',
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Manrope', system-ui, sans-serif",
    },
    favicon: '\u{1F319}',
    nav: ['Collection', 'The House', 'Discovery Set'],
    eyebrow: 'Eau de Parfum · Extrait',
    title: 'After{em}dark{/em}',
    lede: 'Fragrance composed for the small hours, when the city quiets and scent speaks loudest.',
    primaryCta: 'Discover the collection',
    secondaryCta: 'Book a consultation',
    sectionTitle: 'The Maison collection',
    sectionSub: 'Seven hours of night, bottled.',
    items: [
      { eyebrow: 'N° 01', title: 'Velvet Hour', meta: 'iris · suede · black plum', seed: 'n1' },
      { eyebrow: 'N° 02', title: 'Midnight Bloom', meta: 'tuberose · incense · amber', seed: 'n2' },
      { eyebrow: 'N° 03', title: 'Last Train', meta: 'vetiver · smoke · bergamot', seed: 'n3' },
    ],
    bandTitle: 'A perfume is a memory you can wear before it happens.',
    bandCta: 'Order a discovery set',
  },

];
