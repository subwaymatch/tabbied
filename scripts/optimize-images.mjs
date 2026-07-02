// One-shot recompression of the oversized marketing images in public/images.
// With `output: 'export'` the site serves these files as-is (no /_next/image
// optimizer), so they are pre-sized here to ~2x their largest rendered width
// instead of shipping the 1MB+ originals. Re-run after replacing any source
// image: node scripts/optimize-images.mjs
import path from 'node:path';
import { stat, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, 'public/images');

// maxWidth ≈ 2x the widest layout slot the image ever occupies.
const TARGETS = [
  { file: 'uses_wall_art.jpg', maxWidth: 1200 },
  { file: 'uses_notebook.jpg', maxWidth: 1200 },
  { file: 'uses_tshirt.jpg', maxWidth: 1200 },
  { file: 'uses_packaging.jpg', maxWidth: 1200 },
  { file: 'uses_devices.jpg', maxWidth: 2000 },
  { file: 'tabbied_screens.jpg', maxWidth: 1600 },
  // Photo collage with transparency, so it stays a (palette) PNG.
  { file: 'built_by_people.png', maxWidth: 1000 },
];

for (const { file, maxWidth } of TARGETS) {
  const filePath = path.join(DIR, file);
  const before = (await stat(filePath)).size;
  const image = sharp(filePath);
  const meta = await image.metadata();

  let pipeline = image.resize({ width: maxWidth, withoutEnlargement: true });
  pipeline =
    meta.format === 'png'
      ? pipeline.png({ palette: true, compressionLevel: 9 })
      : pipeline.jpeg({ quality: 78, progressive: true, mozjpeg: true });

  // Buffering decouples input from output (sharp can't write over its own
  // input file); write the already-encoded buffer as-is — piping it through
  // sharp() again would re-encode at library defaults, discarding the
  // quality/palette settings above.
  const buffer = await pipeline.toBuffer();
  await writeFile(filePath, buffer);
  const after = (await stat(filePath)).size;
  console.log(
    `${file}: ${meta.width}px ${(before / 1024).toFixed(0)}KB → ` +
      `${Math.min(meta.width, maxWidth)}px ${(after / 1024).toFixed(0)}KB`
  );
}
