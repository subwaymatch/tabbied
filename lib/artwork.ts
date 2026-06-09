import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import type { AspectRatioId } from 'lib/aspectRatio';

export type ArtworkOptionType = 'ButtonSelectGroup' | 'Slider' | 'ToggleSwitch';

export type ArtworkOption = {
  id: string;
  displayName: string;
  type: ArtworkOptionType;
  default: string | number | boolean;
  replace: string;
  /** ButtonSelectGroup choices. */
  options?: string[];
  /** Slider bounds. */
  min?: number;
  max?: number;
  step?: number;
  /** ToggleSwitch "on" snippet. */
  code?: string;
};

export type Artwork = {
  name: string;
  slug: string;
  palette?: string[];
  options: ArtworkOption[];
  code: {
    style: string;
    doodle: string;
  };
  /** Initial aspect ratio when the editor opens. Defaults to "2:3". */
  defaultAspectRatio?: AspectRatioId;
  /**
   * Forces a single aspect ratio and hides the selector — for designs whose
   * layout is tuned to one ratio (e.g. Symmetry's absolute positioning).
   */
  lockAspectRatio?: AspectRatioId;
  /** Render the gallery title in white (for dark thumbnails). */
  galleryWhite?: boolean;
  /** Sort position in the gallery (ascending). Unset sorts last. */
  galleryOrder?: number;
};

export type GalleryItem = {
  slug: string;
  name: string;
  white: boolean;
  /** Everything the gallery needs to render a live css-doodle thumbnail. */
  palette: string[];
  options: ArtworkOption[];
  code: Artwork['code'];
};

const artworksPath = path.join(process.cwd(), 'artworks');

export async function getAllArtworkIds(): Promise<string[]> {
  const fileNames = await readdir(artworksPath);

  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace(/\.json$/, ''));
}

export async function getArtwork(artworkId: string): Promise<Artwork> {
  const artworkJSON = await readFile(
    path.join(artworksPath, `${artworkId}.json`),
    'utf-8'
  );

  return JSON.parse(artworkJSON) as Artwork;
}

// Gallery list derived from the artworks/ folder, so a new preset only needs a
// JSON file plus a thumbnail at public/images/thumb_<slug>.png.
export async function getGalleryItems(): Promise<GalleryItem[]> {
  const ids = await getAllArtworkIds();
  const artworks = await Promise.all(ids.map((id) => getArtwork(id)));

  return artworks
    .map((artwork) => ({
      slug: artwork.slug,
      name: artwork.name,
      white: artwork.galleryWhite ?? false,
      palette: artwork.palette ?? [],
      options: artwork.options,
      code: artwork.code,
      order: artwork.galleryOrder ?? Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map(({ slug, name, white, palette, options, code }) => ({
      slug,
      name,
      white,
      palette,
      options,
      code,
    }));
}
