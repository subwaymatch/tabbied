// Site-side accessors over the `tabbied` package's generated artwork presets.
// The JSON files live in packages/tabbied/artworks/ (the package's codegen
// turns them into a typed module), so the site no longer reads from disk.
import { artworks, isArtworkSlug, type ArtworkDefinition } from 'tabbied';

export type {
  ArtworkColors,
  ArtworkOption,
  ArtworkOptionType,
} from 'tabbied';

export type Artwork = ArtworkDefinition;

export type GalleryItem = {
  slug: string;
  name: string;
  white: boolean;
  /** Everything the gallery needs to render a live css-doodle thumbnail. */
  palette: string[];
  colors?: ArtworkDefinition['colors'];
  options: ArtworkDefinition['options'];
  code: ArtworkDefinition['code'];
};

// The accessors stay async so callers (App Router pages) keep their existing
// await-based shape, even though the data now resolves in-memory.
export async function getAllArtworkIds(): Promise<string[]> {
  return Object.keys(artworks);
}

export async function getArtwork(artworkId: string): Promise<Artwork> {
  if (!isArtworkSlug(artworkId)) {
    throw new Error(`Unknown artwork: ${artworkId}`);
  }

  return artworks[artworkId];
}

// Gallery list derived from the artwork presets, so a new preset only needs a
// JSON file in packages/tabbied/artworks/.
export async function getGalleryItems(): Promise<GalleryItem[]> {
  return Object.values(artworks)
    .map((artwork) => ({
      slug: artwork.slug,
      name: artwork.name,
      white: artwork.galleryWhite ?? false,
      palette: artwork.palette ?? [],
      colors: artwork.colors,
      options: artwork.options,
      code: artwork.code,
      order: artwork.galleryOrder ?? Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map(({ slug, name, white, palette, colors, options, code }) => ({
      slug,
      name,
      white,
      palette,
      colors,
      options,
      code,
    }));
}
