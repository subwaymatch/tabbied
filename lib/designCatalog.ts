// The design library as the customizer offers it: every catalog design's slug,
// name and density, and nothing else.
//
// Server-only, like lib/siteCounts.ts and lib/studioDirections.ts: the catalog
// is 384 KB and carries each design's description, options and metadata,
// none of which "Shuffle patterns" needs. The site workspace page reads this
// in its server component and passes the reduced list down, a few kilobytes
// for 295 designs.
import catalog from 'tabbied/catalog.json';

export type DesignDensity = 'sparse' | 'medium' | 'dense';

/** One design a pattern field may be swapped to. */
export type DesignChoice = {
  slug: string;
  name: string;
  density: DesignDensity;
};

type CatalogDesign = { slug: string; name: string; density: string };

export const DESIGN_CHOICES: DesignChoice[] = (catalog.designs as CatalogDesign[]).map(
  (design) => ({
    slug: design.slug,
    name: design.name,
    density: design.density as DesignDensity,
  })
);
