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
