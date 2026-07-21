// Content + theming for the ten React-component showcase sites. Each site is a
// fictional brand whose primary design accent is a Tabbied artwork rendered by
// the `TabbiedArtwork` React component (see ShowcaseSite.tsx). Every site is
// themed with one palette from the Tabbied library (lib/paletteLibrary.ts) and
// built around one preset artwork — a set deliberately distinct from the ten
// static-HTML samples under public/samples/, so the full showcase spans twenty
// palette/artwork pairings.
//
// The artwork definition itself is imported by each route's page.tsx (so the
// bundler ships only the presets in use) and passed to ShowcaseSite; this file
// carries everything else.

export type ShowcaseLayout = 'spotlight' | 'split' | 'editorial' | 'boutique';

export type ShowcaseItem = {
  eyebrow: string;
  title: string;
  meta: string;
  /** css-doodle grid for this item's accent, e.g. '6x8'. */
  grid: string;
  seed: string;
};

export type ShowcaseSite = {
  slug: string;
  brand: string;
  topic: string;
  /** Artwork slug — matches the preset imported in the route and the file name. */
  artwork: string;
  /** Library palette id + name (for the gallery) and colors (background first). */
  paletteId: string;
  paletteName: string;
  colors: string[];
  layout: ShowcaseLayout;
  /** Google Fonts family names: [display, body]. Loaded via <link> in the page. */
  fonts: { href: string; display: string; body: string };
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
  sectionTitle: string;
  sectionSub: string;
  items: ShowcaseItem[];
  /** Closing band copy. */
  bandTitle: string;
  bandCta: string;
  /** Hero accent grid + seed. */
  heroGrid: string;
  heroSeed: string;
  /** Band accent grid + seed. */
  bandGrid: string;
  bandSeed: string;
  /** split only — put the doodle panel on the left. */
  reverse?: boolean;
};

const gf = (families: string) =>
  `https://fonts.googleapis.com/css2?${families}&display=swap`;

export const SHOWCASE_SITES: ShowcaseSite[] = [
  // 11 — Solstice · wellness / yoga retreat · Sunset · petal
  {
    slug: 'solstice',
    brand: 'Solstice',
    topic: 'Yoga & wellness retreat',
    artwork: 'petal',
    paletteId: 'lib-sunset',
    paletteName: 'Sunset',
    colors: ['#2b1d3a', '#ff6b6b', '#ffd23e', '#ff3d8b', '#7048e8'],
    layout: 'split',
    fonts: {
      href: gf('family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Jost:wght@300;400;500'),
      display: "'Fraunces', Georgia, serif",
      body: "'Jost', system-ui, sans-serif",
    },
    favicon: '🌅',
    nav: ['Retreats', 'Classes', 'Teachers', 'Journal'],
    eyebrow: 'Coastal retreats · Small groups',
    title: 'Come back to {em}yourself{/em}.',
    lede: 'Seven-day yoga and breath-work retreats on the edge of the Pacific — unhurried mornings, long horizons, and nothing to be but here.',
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
      { eyebrow: 'Spring', title: 'Tidewater Reset', meta: 'Big Sur · Apr 12–19', grid: '5x6', seed: 'sol1' },
      { eyebrow: 'Summer', title: 'Long Light', meta: 'Mendocino · Jun 20–27', grid: '6x7', seed: 'sol2' },
      { eyebrow: 'Autumn', title: 'Amber Hours', meta: 'Sonoma · Sep 14–21', grid: '5x6', seed: 'sol3' },
    ],
    bandTitle: 'Your quietest week of the year is waiting.',
    bandCta: 'Reserve your mat',
    heroGrid: '6x9',
    heroSeed: 'SOLST',
    bandGrid: '10x6',
    bandSeed: 'SOLBAND',
  },

  // 12 — Harbor & Vine · natural wine bar · Cranberry · quilt
  {
    slug: 'harbor-and-vine',
    brand: 'Harbor & Vine',
    topic: 'Natural wine bar',
    artwork: 'quilt',
    paletteId: 'lib-cranberry',
    paletteName: 'Cranberry',
    colors: ['#fbeef1', '#9e1946', '#e63946', '#1d3557'],
    layout: 'editorial',
    fonts: {
      href: gf('family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Archivo:wght@400;500;700'),
      display: "'Playfair Display', Georgia, serif",
      body: "'Archivo', system-ui, sans-serif",
    },
    favicon: '🍷',
    nav: ['The List', 'Menu', 'Events', 'Visit'],
    eyebrow: 'Low-intervention · By the glass',
    title: 'Wine that tastes {em}like somewhere{/em}.',
    lede: 'A harbourside bar pouring small-grower, low-intervention bottles — funky, honest, and always a little alive.',
    primaryCta: 'See the list',
    secondaryCta: 'Book a table',
    ticker: ['NEW ARRIVALS', 'SKIN CONTACT', 'PÉT-NAT FRIDAYS', 'BY THE GLASS', 'CELLAR PICKS'],
    sectionTitle: 'On the list this week',
    sectionSub: 'Rotating pours from growers we love.',
    items: [
      { eyebrow: 'Orange', title: 'Ribolla Gialla', meta: 'Friuli, IT · glass 14', grid: '6x8', seed: 'hv1' },
      { eyebrow: 'Sparkling', title: 'Pét-Nat Rosé', meta: 'Loire, FR · glass 12', grid: '7x9', seed: 'hv2' },
      { eyebrow: 'Red', title: 'Gamay Nouveau', meta: 'Beaujolais · glass 13', grid: '6x8', seed: 'hv3' },
    ],
    bandTitle: 'Pull up a stool. We’ll pour you something new.',
    bandCta: 'Reserve a seat',
    heroGrid: '8x12',
    heroSeed: 'HARBOR',
    bandGrid: '12x7',
    bandSeed: 'HVBAND',
  },

  // 13 — Lumen · design conference · Arcade · spectrum
  {
    slug: 'lumen',
    brand: 'Lumen',
    topic: 'Design & technology conference',
    artwork: 'spectrum',
    paletteId: 'lib-arcade',
    paletteName: 'Arcade',
    colors: ['#12002e', '#ff2079', '#00e5ff', '#f9f871', '#7a04eb'],
    layout: 'spotlight',
    fonts: {
      href: gf('family=Space+Grotesk:wght@400;500;700&family=Sora:wght@600;800'),
      display: "'Sora', system-ui, sans-serif",
      body: "'Space Grotesk', system-ui, sans-serif",
    },
    favicon: '✷',
    nav: ['Program', 'Speakers', 'Venue', 'Tickets'],
    eyebrow: 'June 4–6, 2026 · Lisbon',
    title: 'Where design meets {em}what’s next{/em}.',
    lede: 'Three days on the edges of design, code, and craft — 60 speakers, one waterfront, and the whole industry in one room.',
    primaryCta: 'Get tickets',
    secondaryCta: 'View program',
    ticker: ['60 SPEAKERS', '3 STAGES', '2 WORKSHOPS DAYS', 'ONE WATERFRONT', 'LISBON 2026'],
    sectionTitle: 'Featured speakers',
    sectionSub: 'A first look at the 2026 lineup.',
    items: [
      { eyebrow: 'Keynote', title: 'Generative Systems', meta: 'Ana Reis · Stage A', grid: '6x6', seed: 'lum1' },
      { eyebrow: 'Talk', title: 'Designing for Doubt', meta: 'Kwame Bell · Stage B', grid: '8x8', seed: 'lum2' },
      { eyebrow: 'Workshop', title: 'Color at Scale', meta: 'Mei Tan · Lab 2', grid: '7x7', seed: 'lum3' },
    ],
    bandTitle: 'Early-bird tickets are nearly gone.',
    bandCta: 'Claim your pass',
    heroGrid: '7x11',
    heroSeed: 'LUMEN',
    bandGrid: '10x6',
    bandSeed: 'LUMBAND',
  },

  // 14 — Fathom · ocean research nonprofit · Lagoon · lattice
  {
    slug: 'fathom',
    brand: 'Fathom',
    topic: 'Ocean research nonprofit',
    artwork: 'lattice',
    paletteId: 'lib-lagoon',
    paletteName: 'Lagoon',
    colors: ['#04252b', '#0d9488', '#5eead4', '#fef9c3'],
    layout: 'split',
    fonts: {
      href: gf('family=Spectral:wght@300;400;600&family=Outfit:wght@300;400;500;600'),
      display: "'Spectral', Georgia, serif",
      body: "'Outfit', system-ui, sans-serif",
    },
    favicon: '🌊',
    nav: ['Research', 'Expeditions', 'Data', 'Support'],
    eyebrow: 'Marine science · Nonprofit',
    title: 'Mapping the ocean, {em}one fathom{/em} at a time.',
    lede: 'We fund open expeditions and publish every reading — turning the deep sea into data anyone can build on.',
    primaryCta: 'Explore the data',
    secondaryCta: 'Our expeditions',
    stats: [
      { n: '1.2M', l: 'Readings published' },
      { n: '34', l: 'Expeditions funded' },
      { n: '100%', l: 'Open access' },
    ],
    sectionTitle: 'Current expeditions',
    sectionSub: 'Live science, from surface to seabed.',
    items: [
      { eyebrow: 'Pacific', title: 'Twilight Zone Survey', meta: '200–1000m · ongoing', grid: '8x10', seed: 'fat1' },
      { eyebrow: 'Atlantic', title: 'Coral Census', meta: 'Reef health · Q2', grid: '9x12', seed: 'fat2' },
      { eyebrow: 'Arctic', title: 'Ice-Edge Drift', meta: 'Cold currents · Q3', grid: '8x10', seed: 'fat3' },
    ],
    bandTitle: 'Open science needs open funding.',
    bandCta: 'Become a member',
    heroGrid: '9x13',
    heroSeed: 'FATHOM',
    bandGrid: '14x8',
    bandSeed: 'FATBAND',
    reverse: true,
  },

  // 15 — Ember & Oak · wood-fire restaurant · Ember · windowpane
  {
    slug: 'ember-and-oak',
    brand: 'Ember & Oak',
    topic: 'Wood-fire restaurant',
    artwork: 'windowpane',
    paletteId: 'lib-ember',
    paletteName: 'Ember',
    colors: ['#1a0f0a', '#e0511f', '#ff9f1c', '#ffe8c7'],
    layout: 'boutique',
    fonts: {
      href: gf('family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500'),
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Jost', system-ui, sans-serif",
    },
    favicon: '🔥',
    nav: ['Menu', 'Reservations', 'Private Dining', 'About'],
    eyebrow: 'Live fire · Seasonal',
    title: 'Everything touched by {em}flame{/em}.',
    lede: 'A single wood-fired hearth, a menu that changes with the market, and a room built around the glow of the coals.',
    primaryCta: 'Reserve a table',
    secondaryCta: 'View the menu',
    sectionTitle: 'From the hearth',
    sectionSub: 'Tonight’s fire, plated three ways.',
    items: [
      { eyebrow: 'To start', title: 'Charred Leek', meta: 'ember cream · hazelnut', grid: '6x9', seed: 'emb1' },
      { eyebrow: 'The main', title: 'Oak-Fired Rib', meta: '45-day · bone marrow', grid: '7x10', seed: 'emb2' },
      { eyebrow: 'To finish', title: 'Smoked Pear', meta: 'honey · burnt cream', grid: '6x9', seed: 'emb3' },
    ],
    bandTitle: 'The best seat in the house faces the fire.',
    bandCta: 'Book your evening',
    heroGrid: '8x12',
    heroSeed: 'EMBER',
    bandGrid: '12x8',
    bandSeed: 'EMBBAND',
  },

  // 16 — Petal & Post · florist + stationery · Blush · frond
  {
    slug: 'petal-and-post',
    brand: 'Petal & Post',
    topic: 'Florist & stationery studio',
    artwork: 'frond',
    paletteId: 'lib-blush',
    paletteName: 'Blush',
    colors: ['#fff0f3', '#ff8fab', '#c9184a', '#590d22'],
    layout: 'split',
    fonts: {
      href: gf('family=DM+Serif+Display&family=DM+Sans:wght@400;500;700'),
      display: "'DM Serif Display', Georgia, serif",
      body: "'DM Sans', system-ui, sans-serif",
    },
    favicon: '🌸',
    nav: ['Bouquets', 'Weddings', 'Stationery', 'Subscriptions'],
    eyebrow: 'Seasonal stems · Hand-printed',
    title: 'Flowers & paper, {em}sent with love{/em}.',
    lede: 'A neighbourhood studio arranging seasonal blooms and letterpress cards — the whole gesture, wrapped and delivered.',
    primaryCta: 'Shop bouquets',
    secondaryCta: 'Wedding enquiries',
    stats: [
      { n: 'Daily', l: 'Market-fresh stems' },
      { n: '48 hr', l: 'Local delivery' },
      { n: 'Hand', l: 'Letterpressed' },
    ],
    sectionTitle: 'This week’s blooms',
    sectionSub: 'Cut this morning, arranged to order.',
    items: [
      { eyebrow: 'Signature', title: 'Blush Garden', meta: 'ranunculus · sweet pea', grid: '5x7', seed: 'pet1' },
      { eyebrow: 'Bright', title: 'Coral Market', meta: 'dahlia · cosmos', grid: '6x8', seed: 'pet2' },
      { eyebrow: 'Soft', title: 'First Light', meta: 'peony · astilbe', grid: '5x7', seed: 'pet3' },
    ],
    bandTitle: 'Fresh flowers on the table, every other week.',
    bandCta: 'Start a subscription',
    heroGrid: '6x9',
    heroSeed: 'PETAL',
    bandGrid: '11x6',
    bandSeed: 'PETBAND',
  },

  // 17 — Northwind · outdoor apparel · Forest · maze
  {
    slug: 'northwind',
    brand: 'Northwind',
    topic: 'Outdoor apparel brand',
    artwork: 'maze',
    paletteId: 'lib-forest',
    paletteName: 'Forest',
    colors: ['#1e2d24', '#6ca31c', '#e7fce3', '#c9a227'],
    layout: 'spotlight',
    fonts: {
      href: gf('family=Archivo:wght@500;700;900&family=Work+Sans:wght@400;500;600'),
      display: "'Archivo', system-ui, sans-serif",
      body: "'Work Sans', system-ui, sans-serif",
    },
    favicon: '🧭',
    nav: ['Men', 'Women', 'Gear', 'Field Notes'],
    eyebrow: 'Built for the backcountry',
    title: 'Made to be {em}worn out{/em}.',
    lede: 'Hard-wearing layers for long days above the treeline — overbuilt, weather-beaten, and guaranteed for life.',
    primaryCta: 'Shop the range',
    secondaryCta: 'Our guarantee',
    ticker: ['LIFETIME GUARANTEE', 'RECYCLED SHELLS', 'FIELD-TESTED', 'CARBON NEUTRAL', 'SINCE 1998'],
    sectionTitle: 'New in the range',
    sectionSub: 'Layers that earn their place in the pack.',
    items: [
      { eyebrow: 'Shell', title: 'Ridgeline Jacket', meta: '3-layer · $340', grid: '7x10', seed: 'nor1' },
      { eyebrow: 'Insulation', title: 'Cirrus Down', meta: '800-fill · $260', grid: '8x11', seed: 'nor2' },
      { eyebrow: 'Base', title: 'Merino Crew', meta: '190gsm · $95', grid: '7x10', seed: 'nor3' },
    ],
    bandTitle: 'Wherever the trail ends, we’ll repair it for free.',
    bandCta: 'Read the guarantee',
    heroGrid: '8x12',
    heroSeed: 'NORTH',
    bandGrid: '12x7',
    bandSeed: 'NORBAND',
  },

  // 18 — Honeycomb · kids learning app · Honey · bokeh
  {
    slug: 'honeycomb',
    brand: 'Honeycomb',
    topic: "Kids' learning app",
    artwork: 'bokeh',
    paletteId: 'lib-honey',
    paletteName: 'Honey',
    colors: ['#fff9e6', '#f6c343', '#b8860b', '#3a2f0b'],
    layout: 'split',
    fonts: {
      href: gf('family=Baloo+2:wght@500;600;800&family=Nunito:wght@400;600;700'),
      display: "'Baloo 2', system-ui, sans-serif",
      body: "'Nunito', system-ui, sans-serif",
    },
    favicon: '🐝',
    nav: ['How it works', 'Ages', 'For schools', 'Pricing'],
    eyebrow: 'Ages 4–9 · Screen-time worth having',
    title: 'Little lessons that {em}feel like play{/em}.',
    lede: 'Bite-size reading and number games that adapt to your child — five joyful minutes at a time, no ads, ever.',
    primaryCta: 'Start free trial',
    secondaryCta: 'See a lesson',
    stats: [
      { n: '5 min', l: 'Per lesson' },
      { n: '900+', l: 'Adaptive games' },
      { n: '0', l: 'Ads, always' },
    ],
    sectionTitle: 'What kids play',
    sectionSub: 'Worlds that grow with every right answer.',
    items: [
      { eyebrow: 'Reading', title: 'Word Meadow', meta: 'phonics · ages 4–6', grid: '5x5', seed: 'hon1' },
      { eyebrow: 'Numbers', title: 'Count Hive', meta: 'early math · ages 5–7', grid: '6x6', seed: 'hon2' },
      { eyebrow: 'Logic', title: 'Puzzle Grove', meta: 'patterns · ages 6–9', grid: '5x5', seed: 'hon3' },
    ],
    bandTitle: 'Two weeks free. Cancel in one tap.',
    bandCta: 'Try Honeycomb',
    heroGrid: '6x9',
    heroSeed: 'HONEY',
    bandGrid: '10x6',
    bandSeed: 'HONBAND',
    reverse: true,
  },

  // 19 — Facet · fine jewelry · Jewel · prisma
  {
    slug: 'facet',
    brand: 'Facet',
    topic: 'Fine jewelry brand',
    artwork: 'prisma',
    paletteId: 'lib-jewel',
    paletteName: 'Jewel',
    colors: ['#0b1021', '#5b2a86', '#2176ae', '#57b8ff', '#fbb13c'],
    layout: 'boutique',
    fonts: {
      href: gf('family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500'),
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Jost', system-ui, sans-serif",
    },
    favicon: '💎',
    nav: ['Collections', 'Bespoke', 'Our Stones', 'Appointments'],
    eyebrow: 'Ethically sourced · Made to order',
    title: 'Light, {em}cut to keep{/em}.',
    lede: 'Fine jewelry built around a single remarkable stone — traceable, hand-set, and made to outlast every trend.',
    primaryCta: 'View collections',
    secondaryCta: 'Book an appointment',
    sectionTitle: 'The Prism collection',
    sectionSub: 'Colour, held to the light.',
    items: [
      { eyebrow: 'N° 01', title: 'Aurora Ring', meta: 'sapphire · 18k', grid: '6x8', seed: 'fac1' },
      { eyebrow: 'N° 02', title: 'Spectra Drop', meta: 'tourmaline · platinum', grid: '7x9', seed: 'fac2' },
      { eyebrow: 'N° 03', title: 'Facet Band', meta: 'diamond · rose gold', grid: '6x8', seed: 'fac3' },
    ],
    bandTitle: 'Bring us a stone, or start with a spark.',
    bandCta: 'Design something bespoke',
    heroGrid: '8x12',
    heroSeed: 'FACET',
    bandGrid: '12x8',
    bandSeed: 'FACBAND',
  },

  // 20 — Seabright · coastal skincare · Seaglass · metro
  {
    slug: 'seabright',
    brand: 'Seabright',
    topic: 'Coastal skincare line',
    artwork: 'metro',
    paletteId: 'lib-seaglass',
    paletteName: 'Seaglass',
    colors: ['#f2fbf7', '#9ad1c9', '#5f9ea0', '#33576b'],
    layout: 'split',
    fonts: {
      href: gf('family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Outfit:wght@300;400;500;600'),
      display: "'Fraunces', Georgia, serif",
      body: "'Outfit', system-ui, sans-serif",
    },
    favicon: '🧴',
    nav: ['Shop', 'Ingredients', 'Ritual', 'About'],
    eyebrow: 'Reef-safe · Fragrance-free',
    title: 'Skincare with a {em}clear conscience{/em}.',
    lede: 'Mineral-rich, reef-safe formulas made in small batches on the coast — kind to sensitive skin and the water it runs into.',
    primaryCta: 'Shop the range',
    secondaryCta: 'Our ingredients',
    stats: [
      { n: '9', l: 'Ingredients or fewer' },
      { n: '0', l: 'Synthetic fragrance' },
      { n: '100%', l: 'Reef-safe' },
    ],
    sectionTitle: 'The daily ritual',
    sectionSub: 'Three steps, morning and night.',
    items: [
      { eyebrow: 'Cleanse', title: 'Tide Gel', meta: 'sea kelp · 150ml', grid: '6x8', seed: 'sea1' },
      { eyebrow: 'Treat', title: 'Mineral Serum', meta: 'zinc · magnesium', grid: '7x9', seed: 'sea2' },
      { eyebrow: 'Protect', title: 'Day Fluid SPF30', meta: 'non-nano · 50ml', grid: '6x8', seed: 'sea3' },
    ],
    bandTitle: 'Your skin, and the sea, will thank you.',
    bandCta: 'Build your ritual',
    heroGrid: '7x11',
    heroSeed: 'SEABR',
    bandGrid: '12x7',
    bandSeed: 'SEABAND',
    reverse: true,
  },
];
