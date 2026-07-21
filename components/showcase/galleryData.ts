// Metadata for the static-HTML sample sites (built by samples/generate.mjs into
// public/samples/<dir>/). The React showcase sites reuse SHOWCASE_SITES from
// showcaseData.ts. The gallery page (app/samples/page.tsx) renders both lists
// with live TabbiedArtwork thumbnails.

export type StaticSample = {
  dir: string;
  name: string;
  topic: string;
  /** Primary artwork slug used for the thumbnail. */
  artwork: string;
  paletteName: string;
  /** Palette colors, background (color0) first. */
  colors: string[];
};

export const STATIC_SAMPLES: StaticSample[] = [
  { dir: '01-aurora-sound', name: 'Aurora Sound', topic: 'Electronic music label', artwork: 'plasma', paletteName: 'Neon', colors: ['#0d0d12', '#3fffb2', '#3eecff', '#ff3d8b'] },
  { dir: '02-terra-ceramics', name: 'Terra Ceramics', topic: 'Pottery & ceramics studio', artwork: 'pebble', paletteName: 'Terracotta', colors: ['#f7ede2', '#c1502e', '#84582c', '#2f3e46'] },
  { dir: '03-meridian', name: 'Meridian', topic: 'Fintech payments platform', artwork: 'circuit', paletteName: 'Cobalt', colors: ['#0a1a3f', '#1e4fd6', '#3eecff', '#eef4ff'] },
  { dir: '04-verdant', name: 'Verdant', topic: 'Indoor plant shop', artwork: 'foliage', paletteName: 'Fern', colors: ['#f4faf0', '#2d6a4f', '#95d5b2', '#1b4332'] },
  { dir: '05-sunday-press', name: 'The Sunday Press', topic: 'Independent editorial magazine', artwork: 'bauhaus', paletteName: 'Bauhaus', colors: ['#f4f1ea', '#d7263d', '#1b6ca8', '#f7b32b', '#232529'] },
  { dir: '06-zest', name: 'Zest', topic: 'Recipe & food publication', artwork: 'confetti', paletteName: 'Citrus', colors: ['#fffbe6', '#ff9f1c', '#2ec4b6', '#e71d36'] },
  { dir: '07-nocturne', name: 'Nocturne', topic: 'Luxury perfume house', artwork: 'veil', paletteName: 'Amethyst', colors: ['#12071f', '#5a189a', '#9d4edd', '#e0aaff'] },
  { dir: '08-shoreline', name: 'Shoreline', topic: 'Coastal architecture studio', artwork: 'awning', paletteName: 'Ocean', colors: ['#0b2545', '#8da9c4', '#eef4ed', '#13a8a8'] },
  { dir: '09-pixel-playhouse', name: 'Pixel Playhouse', topic: 'Indie game studio', artwork: 'tetro', paletteName: 'Vaporwave', colors: ['#2d0a45', '#ff6ad5', '#c774e8', '#94d0ff', '#ad8cff'] },
  { dir: '10-roast-and-co', name: 'Roast & Co', topic: 'Specialty coffee roaster', artwork: 'halftone', paletteName: 'Espresso', colors: ['#efebe4', '#6f4e37', '#3b2417', '#c9a66b'] },
];
