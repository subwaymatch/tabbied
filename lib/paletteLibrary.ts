// A curated, read-only palette library shown in the gallery rail and the
// artwork editor. Unlike "Your Palettes" (user-defined, persisted in
// localStorage via lib/brandPalettes), these ship with the app: they can be
// applied to preview every design in their colors, or copied into Your Palettes
// with the "+" affordance (which mints a fresh, editable saved palette).
//
// Each palette holds 3-7 colors with the background first (color0), matching
// BrandPalette's shape so the same rendering helpers apply. The first twelve
// are the palettes shipped in the Claude Design handoff mockups; the rest are a
// curated set spanning neutrals, jewel tones, pastels, retro and earthy stories.

export type LibraryPalette = {
  id: string;
  name: string;
  /** Colors, background (color0) first, then the inks. 3-7 total. */
  colors: string[];
};

export const PALETTE_LIBRARY: LibraryPalette[] = [
  // ---- From the handoff mockups (Tabbied Redesign Options.dc.html) ----
  { id: 'lib-ink', name: 'Ink', colors: ['#f8f9fa', '#232529', '#ff3d8b'] },
  { id: 'lib-mint', name: 'Mint', colors: ['#eafff5', '#00b87a', '#232529', '#3e8bff'] },
  { id: 'lib-sunset', name: 'Sunset', colors: ['#2b1d3a', '#ff6b6b', '#ffd23e', '#ff3d8b', '#7048e8'] },
  { id: 'lib-ocean', name: 'Ocean', colors: ['#0b2545', '#8da9c4', '#eef4ed', '#13a8a8'] },
  { id: 'lib-bauhaus', name: 'Bauhaus', colors: ['#f4f1ea', '#d7263d', '#1b6ca8', '#f7b32b', '#232529'] },
  { id: 'lib-forest', name: 'Forest', colors: ['#1e2d24', '#6ca31c', '#e7fce3', '#c9a227'] },
  { id: 'lib-neon', name: 'Neon', colors: ['#0d0d12', '#3fffb2', '#3eecff', '#ff3d8b'] },
  { id: 'lib-terracotta', name: 'Terracotta', colors: ['#f7ede2', '#c1502e', '#84582c', '#2f3e46'] },
  { id: 'lib-candy', name: 'Candy', colors: ['#fff0f6', '#ff3d8b', '#7048e8', '#3eecff', '#ffd23e'] },
  { id: 'lib-mono', name: 'Mono', colors: ['#ffffff', '#111111', '#8a8a8a'] },
  { id: 'lib-berry', name: 'Berry', colors: ['#fdf3f7', '#8e2a5c', '#d7639b', '#3a1f3d', '#ffd23e', '#2e6cc0', '#101010'] },
  { id: 'lib-paper', name: 'Paper', colors: ['#fffdf5', '#232529', '#c9a227'] },

  // ---- Neutrals & monochrome ----
  { id: 'lib-graphite', name: 'Graphite', colors: ['#1b1d21', '#3a3f47', '#7d8594', '#ced3d9'] },
  { id: 'lib-oat', name: 'Oat', colors: ['#f3efe6', '#c9bfa8', '#8a7f68', '#33302a'] },
  { id: 'lib-slate', name: 'Slate', colors: ['#232529', '#98a0af', '#eceef1'] },
  { id: 'lib-linen', name: 'Linen', colors: ['#faf6f0', '#2f2b26', '#a89b86', '#d8ceba'] },
  { id: 'lib-newsprint', name: 'Newsprint', colors: ['#eae7e0', '#1a1a1a', '#5b5b5b', '#b0aca3'] },
  { id: 'lib-charcoal', name: 'Charcoal', colors: ['#111318', '#e8eaed', '#6b7280'] },

  // ---- Blues & teals ----
  { id: 'lib-cobalt', name: 'Cobalt', colors: ['#0a1a3f', '#1e4fd6', '#3eecff', '#eef4ff'] },
  { id: 'lib-tide', name: 'Tide', colors: ['#e9f6f6', '#0f6e78', '#13a8a8', '#052224'] },
  { id: 'lib-glacier', name: 'Glacier', colors: ['#f0f7fb', '#4d8cf7', '#97f4ff', '#1b4075', '#3fffb2'] },
  { id: 'lib-denim', name: 'Denim', colors: ['#1c2b3a', '#3e6d9c', '#8fb8de', '#e7eef5'] },
  { id: 'lib-lagoon', name: 'Lagoon', colors: ['#04252b', '#0d9488', '#5eead4', '#fef9c3'] },
  { id: 'lib-arctic', name: 'Arctic', colors: ['#eaf2f8', '#264653', '#2a9d8f', '#8ecae6'] },

  // ---- Greens ----
  { id: 'lib-meadow', name: 'Meadow', colors: ['#e7fce3', '#6ca31c', '#27305c'] },
  { id: 'lib-moss', name: 'Moss', colors: ['#20261c', '#5f7a34', '#a7c957', '#f2f5e9'] },
  { id: 'lib-fern', name: 'Fern', colors: ['#f4faf0', '#2d6a4f', '#95d5b2', '#1b4332'] },
  { id: 'lib-matcha', name: 'Matcha', colors: ['#eef2df', '#8ab17d', '#3a5a40', '#dda15e'] },
  { id: 'lib-pine', name: 'Pine', colors: ['#0f1f17', '#2f6b4f', '#7fbf9a', '#e9f5ee', '#d4a017'] },

  // ---- Warm / red-orange ----
  { id: 'lib-ember', name: 'Ember', colors: ['#1a0f0a', '#e0511f', '#ff9f1c', '#ffe8c7'] },
  { id: 'lib-poppy', name: 'Poppy', colors: ['#f4f1ea', '#d7263d', '#232529', '#3e8bff', '#ffd23e'] },
  { id: 'lib-clay', name: 'Clay', colors: ['#f6ece3', '#b5651d', '#5e3a1e', '#2f3e46'] },
  { id: 'lib-marigold', name: 'Marigold', colors: ['#fff8e6', '#f4a300', '#e2571e', '#8c2f0d'] },
  { id: 'lib-brick', name: 'Brick', colors: ['#2b1512', '#8c3b2b', '#d98a5f', '#f0d9c0'] },
  { id: 'lib-chili', name: 'Chili', colors: ['#fff4ec', '#e71d36', '#ff9f1c', '#011627', '#2ec4b6'] },

  // ---- Pinks & purples ----
  { id: 'lib-blush', name: 'Blush', colors: ['#fff0f3', '#ff8fab', '#c9184a', '#590d22'] },
  { id: 'lib-orchid', name: 'Orchid', colors: ['#1c1024', '#7048e8', '#c77dff', '#f2e9ff', '#3eecff'] },
  { id: 'lib-plum', name: 'Plum', colors: ['#2a1533', '#6d2e6b', '#c85ba0', '#f6d5e8'] },
  { id: 'lib-lilac', name: 'Lilac', colors: ['#f6f2fb', '#9b8bd6', '#4b3f80', '#2a2440'] },
  { id: 'lib-fuchsia', name: 'Fuchsia', colors: ['#0d0d12', '#ff3d8b', '#c026d3', '#3eecff'] },
  { id: 'lib-mauve', name: 'Mauve', colors: ['#f3eef0', '#8a5a6d', '#4a2e3a', '#c9a3ae'] },

  // ---- Yellows & golds ----
  { id: 'lib-honey', name: 'Honey', colors: ['#fff9e6', '#f6c343', '#b8860b', '#3a2f0b'] },
  { id: 'lib-mustard', name: 'Mustard', colors: ['#2a2410', '#c9a227', '#f2e6b3', '#6b8e23'] },
  { id: 'lib-saffron', name: 'Saffron', colors: ['#fdf6ec', '#e8a33d', '#c1440e', '#26413c'] },
  { id: 'lib-citrus', name: 'Citrus', colors: ['#fffbe6', '#ff9f1c', '#2ec4b6', '#e71d36'] },

  // ---- Retro & pop ----
  { id: 'lib-arcade', name: 'Arcade', colors: ['#12002e', '#ff2079', '#00e5ff', '#f9f871', '#7a04eb'] },
  { id: 'lib-vaporwave', name: 'Vaporwave', colors: ['#2d0a45', '#ff6ad5', '#c774e8', '#94d0ff', '#ad8cff'] },
  { id: 'lib-seventies', name: 'Seventies', colors: ['#f5e6c8', '#d1495b', '#edae49', '#00798c', '#30638e'] },
  { id: 'lib-comic', name: 'Comic', colors: ['#fffef2', '#111111', '#ff4136', '#0074d9', '#ffdc00'] },
  { id: 'lib-pop', name: 'Pop', colors: ['#fdfdfd', '#ff3d8b', '#3e8bff', '#3fffb2', '#ffd23e', '#232529'] },
  { id: 'lib-disco', name: 'Disco', colors: ['#160f29', '#f45b69', '#f6ae2d', '#2a9d8f', '#e0e1dd'] },

  // ---- Earthy & muted ----
  { id: 'lib-desert', name: 'Desert', colors: ['#f0e2d0', '#c1502e', '#6a8532', '#40342b'] },
  { id: 'lib-sable', name: 'Sable', colors: ['#e7ddd2', '#7c5c3e', '#3e2f24', '#a3b18a'] },
  { id: 'lib-harvest', name: 'Harvest', colors: ['#f4ecd6', '#a44a3f', '#d4a24c', '#4a5842'] },
  { id: 'lib-canyon', name: 'Canyon', colors: ['#3a201b', '#a34a2a', '#e08e45', '#f2d0a4', '#5b7553'] },
  { id: 'lib-stormy', name: 'Stormy', colors: ['#20242b', '#4a5568', '#94a3b8', '#e2e8f0', '#f6ad55'] },

  // ---- Cool jewel tones ----
  { id: 'lib-jewel', name: 'Jewel', colors: ['#0b1021', '#5b2a86', '#2176ae', '#57b8ff', '#fbb13c'] },
  { id: 'lib-peacock', name: 'Peacock', colors: ['#04303b', '#036c5f', '#00b4a0', '#ffd166', '#ef476f'] },
  { id: 'lib-amethyst', name: 'Amethyst', colors: ['#12071f', '#5a189a', '#9d4edd', '#e0aaff'] },
  { id: 'lib-emerald', name: 'Emerald', colors: ['#04160f', '#046b48', '#0bd18a', '#d8f3dc'] },
  { id: 'lib-sapphire', name: 'Sapphire', colors: ['#020c1b', '#123c69', '#2e77bb', '#a9d6ff', '#eaf4ff'] },

  // ---- Soft pastels ----
  { id: 'lib-sorbet', name: 'Sorbet', colors: ['#fff5f7', '#ffb3c1', '#a0e7e5', '#b4f8c8', '#fbe7a1'] },
  { id: 'lib-cotton', name: 'Cotton', colors: ['#fdf6ff', '#cdb4db', '#a2d2ff', '#ffc8dd', '#bde0fe'] },
  { id: 'lib-macaron', name: 'Macaron', colors: ['#fbf7f0', '#f6bd60', '#f28482', '#84a59d', '#f5cac3'] },
  { id: 'lib-seaglass', name: 'Seaglass', colors: ['#f2fbf7', '#9ad1c9', '#5f9ea0', '#33576b'] },

  // ---- High-contrast & bold ----
  { id: 'lib-monochrome-red', name: 'Signal', colors: ['#ffffff', '#0b0b0b', '#ff2d2d'] },
  { id: 'lib-electric', name: 'Electric', colors: ['#050510', '#00fff0', '#ff00e5', '#faff00'] },
  { id: 'lib-noir', name: 'Noir', colors: ['#0a0a0a', '#f5f5f5', '#c8102e'] },
  { id: 'lib-primary', name: 'Primary', colors: ['#f7f7f5', '#e63946', '#1d3557', '#f1c40f', '#2a9d8f'] },

  // ---- Expanded set ----
  { id: 'lib-dune', name: 'Dune', colors: ['#f2e8cf', '#bc6c25', '#606c38', '#283618'] },
  { id: 'lib-aegean', name: 'Aegean', colors: ['#eef7fb', '#1b98e0', '#006494', '#13293d'] },
  { id: 'lib-flamingo', name: 'Flamingo', colors: ['#fff0f3', '#ff5d8f', '#ff9ebb', '#3a0ca3'] },
  { id: 'lib-cactus', name: 'Cactus', colors: ['#0f2417', '#4c9a2a', '#a4de02', '#f2f7d4'] },
  { id: 'lib-espresso', name: 'Espresso', colors: ['#efebe4', '#6f4e37', '#3b2417', '#c9a66b'] },
  { id: 'lib-sky', name: 'Sky', colors: ['#eaf6ff', '#5eaaef', '#2d6fb3', '#ffd166'] },
  { id: 'lib-rose', name: 'Rose', colors: ['#fff5f7', '#e0607e', '#b23a5a', '#2b2d42'] },
  { id: 'lib-lava', name: 'Lava', colors: ['#1a0b0b', '#e63e00', '#ff8500', '#ffd500'] },
  { id: 'lib-tundra', name: 'Tundra', colors: ['#e8edf0', '#93a8b4', '#4a5c6a', '#22303c'] },
  { id: 'lib-mango', name: 'Mango', colors: ['#fff8e7', '#ffb703', '#fb8500', '#023047', '#219ebc'] },
  { id: 'lib-thistle', name: 'Thistle', colors: ['#f6f2fa', '#b8a1d9', '#7b6099', '#3d3357'] },
  { id: 'lib-reef', name: 'Reef', colors: ['#f0fbfa', '#2ec4b6', '#ff6b6b', '#ffe66d', '#1a535c'] },
  { id: 'lib-cocoa', name: 'Cocoa', colors: ['#f5ede1', '#8d6346', '#4b2e1e', '#d9b382'] },
  { id: 'lib-electricblue', name: 'Voltage', colors: ['#04060f', '#0466c8', '#48cae4', '#e0fbfc'] },
  { id: 'lib-fig', name: 'Fig', colors: ['#efe6ef', '#7a5c7e', '#4a2545', '#9bc53d'] },
  { id: 'lib-persimmon', name: 'Persimmon', colors: ['#fff3ec', '#ec5f2d', '#f79d5c', '#2e4057'] },
  { id: 'lib-jade', name: 'Jade', colors: ['#e9f5ef', '#3ba776', '#14532d', '#f4a261'] },
  { id: 'lib-ultra', name: 'Ultra', colors: ['#10002b', '#7b2cbf', '#c77dff', '#e0aaff', '#ff9e00'] },
  { id: 'lib-oatmilk', name: 'Oat Milk', colors: ['#faf6ee', '#d8c3a5', '#8e8d8a', '#4a4a48'] },
  { id: 'lib-cherry', name: 'Cherry', colors: ['#fff0f0', '#d00000', '#9d0208', '#370617'] },
  { id: 'lib-lagoonblue', name: 'Shoal', colors: ['#effcfb', '#78c6c1', '#2f8f9d', '#155263'] },
  { id: 'lib-butter', name: 'Butter', colors: ['#fffbeb', '#ffd60a', '#ffc300', '#3a3a3a'] },
  { id: 'lib-grape', name: 'Grape', colors: ['#160a2b', '#5a189a', '#9d4edd', '#ffb3c1', '#ffe66d'] },
  { id: 'lib-mint-choc', name: 'Mint Chip', colors: ['#eafaf1', '#4ecca3', '#2b2b2b', '#a8dadc'] },
  { id: 'lib-rust', name: 'Rust', colors: ['#f4ece2', '#a63a1e', '#e08e45', '#2b2118'] },
  { id: 'lib-cobaltmint', name: 'Signal Blue', colors: ['#f4faff', '#0353a4', '#3fe0a0', '#061826'] },
  { id: 'lib-wine', name: 'Wine', colors: ['#f7eef2', '#722f37', '#a4506a', '#2d1b21', '#d4af37'] },
  { id: 'lib-fizz', name: 'Fizz', colors: ['#fdfffc', '#2ec4b6', '#ff9f1c', '#e71d36', '#011627'] },
  { id: 'lib-storm', name: 'Storm', colors: ['#1c2331', '#3d5a80', '#98c1d9', '#e0fbfc', '#ee6c4d'] },
  { id: 'lib-blossompink', name: 'Sakura', colors: ['#fff0f5', '#ffb7c5', '#d16ba5', '#4a3f5e'] },
  { id: 'lib-moor', name: 'Moor', colors: ['#22181c', '#6b4e71', '#a26769', '#d5b9b2', '#ece2d0'] },
  { id: 'lib-neonpink', name: 'Hot Wire', colors: ['#0d0221', '#ff2a6d', '#05d9e8', '#d1f7ff'] },
  { id: 'lib-olive', name: 'Olive', colors: ['#f0efe2', '#7d8471', '#3d4127', '#b56576'] },
  { id: 'lib-glowworm', name: 'Bioluminescence', colors: ['#03071e', '#00f5d4', '#00bbf9', '#9b5de5'] },
  { id: 'lib-brownstone', name: 'Brownstone', colors: ['#efe7dc', '#a68a64', '#6f4518', '#333d29'] },
  { id: 'lib-poolside', name: 'Poolside', colors: ['#fef9f3', '#00b4d8', '#ffb703', '#fb6f92'] },
  { id: 'lib-coalfire', name: 'Coal Fire', colors: ['#0b090a', '#e5383b', '#f5cb5c', '#e3e3e3'] },
  { id: 'lib-seafoam', name: 'Seafoam', colors: ['#f2fdfb', '#88d9c0', '#3aa79b', '#264653'] },
  { id: 'lib-cider', name: 'Cider', colors: ['#fbf3e0', '#e09f3e', '#9e2a2b', '#540b0e'] },
  { id: 'lib-royal', name: 'Royal', colors: ['#0a0e2a', '#3a0ca3', '#f72585', '#4cc9f0', '#ffd60a'] },
  { id: 'lib-driftwood', name: 'Driftwood', colors: ['#e7e0d5', '#a09283', '#5c5346', '#2a2622'] },
  { id: 'lib-limeade', name: 'Limeade', colors: ['#f7ffe0', '#a1c349', '#4a7c2f', '#22333b'] },
  { id: 'lib-cranberry', name: 'Cranberry', colors: ['#fbeef1', '#9e1946', '#e63946', '#1d3557'] },
  { id: 'lib-fog', name: 'Fog', colors: ['#f4f4f6', '#c4c9d4', '#7a8290', '#3b414c'] },
  { id: 'lib-toucan', name: 'Toucan', colors: ['#0b132b', '#ffce00', '#ff5714', '#1ba1e2', '#f5f5f5'] },
  { id: 'lib-heather', name: 'Heather', colors: ['#f3eefb', '#9a8fb8', '#6d5a97', '#2e2445', '#c8b6e2'] },
  { id: 'lib-copperpatina', name: 'Copper Patina', colors: ['#f0eee6', '#b87333', '#2e8b7d', '#1c3b3a'] },
  { id: 'lib-sunflower', name: 'Sunflower', colors: ['#fffbe6', '#ffc300', '#e07a00', '#3d2b1f', '#6a994e'] },
  { id: 'lib-midnightoil', name: 'Midnight Oil', colors: ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'] },
  { id: 'lib-tangerine', name: 'Tangerine', colors: ['#fff4e6', '#ff7b00', '#ff9505', '#16697a', '#489fb5'] },
  { id: 'lib-basalt', name: 'Slate Rose', colors: ['#f5ebe0', '#d6a2ad', '#7d5a5a', '#33272a'] },
];

const LIBRARY_BY_ID = new Map(PALETTE_LIBRARY.map((palette) => [palette.id, palette]));

/** A curated library palette by id, or undefined when the id isn't in the library. */
export const findLibraryPalette = (
  id: string | null | undefined
): LibraryPalette | undefined =>
  id == null ? undefined : LIBRARY_BY_ID.get(id);

/** Whether an id names a curated library palette (as opposed to a saved one). */
export const isLibraryPaletteId = (id: string | null | undefined): boolean =>
  id != null && LIBRARY_BY_ID.has(id);
