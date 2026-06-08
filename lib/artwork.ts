import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';

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
