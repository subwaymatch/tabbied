// The index Studio matches against, built once at build time.
//
// Server-only, like lib/siteCounts.ts: the catalog is 384 KB and the template
// data pulls in every pattern definition, none of which should reach the
// browser. What crosses to the client is this reduced list - 57 entries of
// names, palettes and vocabulary, a few kilobytes - which the matcher in
// lib/studioMatch.ts then works over without another round trip.
import catalog from 'tabbied/catalog.json';
import { TEMPLATE_SITES } from 'components/template/templateData';
import { NEW_TEMPLATE_SITES } from 'lib/templateSites';
import { hexHue, stem, tokenize, type StudioEntry } from './studioMatch';

type CatalogDesign = {
  slug: string;
  name: string;
  tags: string[];
  mood: string[];
  density: string;
};

const DESIGNS = new Map<string, CatalogDesign>(
  (catalog.designs as CatalogDesign[]).map((design) => [design.slug, design])
);

function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).replace(/-/g, ' ');
}

type RawSite = {
  slug: string;
  name: string;
  topic: string;
  patternSlug: string;
  paletteName: string;
  palette: string[];
};

function toEntry(site: RawSite): StudioEntry {
  const design = DESIGNS.get(site.patternSlug);
  const tags = design?.tags ?? [];
  const moods = design?.mood ?? [];
  const hues = site.palette
    .map(hexHue)
    .filter((hue): hue is number => hue !== null);

  return {
    ...site,
    patternName: design?.name ?? titleCase(site.patternSlug),
    density: design?.density ?? 'medium',
    tags,
    moods,
    hues,
    // "Black and white" should reach a palette that is mostly grey with one
    // accent, not only the handful with no colour at all.
    neutral: hues.length <= Math.floor(site.palette.length * 0.4),
    // The card's second line - how the design feels, then what it is made of.
    descriptors: [...moods.slice(0, 2), ...tags.slice(0, 1)].map(titleCase),
    topicTerms: Array.from(
      new Set([...tokenize(site.topic), ...tokenize(site.name)].map(stem))
    ),
  };
}

/**
 * Both template collections, in the same order /templates lists them. The two
 * carry different field names for the same things - `brand`/`name`,
 * `pattern`/`patternSlug`, `colors`/`palette` - so they are normalised here the
 * way that gallery normalises them for its cards.
 */
export const STUDIO_ENTRIES: StudioEntry[] = [
  ...TEMPLATE_SITES.map((site) =>
    toEntry({
      slug: site.slug,
      name: site.brand,
      topic: site.topic,
      patternSlug: site.pattern,
      paletteName: site.paletteName,
      palette: site.colors,
    })
  ),
  ...NEW_TEMPLATE_SITES.map((site) =>
    toEntry({
      slug: site.slug,
      name: site.name,
      topic: site.topic,
      patternSlug: site.patternSlug,
      paletteName: site.paletteName,
      palette: site.palette,
    })
  ),
];
