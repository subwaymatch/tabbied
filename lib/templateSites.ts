import {
  gasket, spark, gloaming, ridgeline, glyph, wavelet, mortise, karst,
  hilbert, linocut, cascade, crescendo, perforate, bothways, torsion,
  taper, windowpane, epicentre, halftone, staple, maelstrom, caltrop,
  tailoff, tinting, ring, quire, ribline, stitch, damier, plait, chase,
  tidering, radiance, grainfield, metro, rungs,
  pivot, raking, gutter, swapcut, annulus, sail, reeding, miura, lintel,
  dipole,
  cupola, battlement, clipcorner, birdsmouth, rolloff, prismfold,
} from 'tabbied/patterns';
import type { PatternDefinition } from 'tabbied';

export type NewTemplateSite = {
  slug: string;
  name: string;
  topic: string;
  /** Preset slug, for display labels. */
  patternSlug: string;
  pattern: PatternDefinition;
  paletteName: string;
  /** Background color first - the same hexes the site itself uses. */
  palette: string[];
  seed: string;
};

/**
 * The second template collection: thirty-six single-page brand
 * sites under /template/<slug>/, each designed around one Tabbied pattern and
 * AI-generated imagery (see docs/image-pipeline.md). Listed on /template and
 * /templates; palettes here mirror each page's own constants.
 */
export const NEW_TEMPLATE_SITES: NewTemplateSite[] = [
  { slug: 'mistral-cycles', name: 'Mistral Cycles', topic: 'Handbuilt bicycle frames', patternSlug: 'gasket', pattern: gasket, paletteName: 'Blueprint navy', palette: ['#0D1B2A', '#1B98E0', '#E0FBFC', '#FF7B00', '#FFD23F', '#EAEAEA'], seed: 'dir-mc' },
  { slug: 'zenith-observatory', name: 'Zenith', topic: 'Observatory & planetarium', patternSlug: 'spark', pattern: spark, paletteName: 'Nebula violet', palette: ['#10002B', '#5A189A', '#9D4EDD', '#C77DFF', '#E0AAFF', '#FFD6FF'], seed: 'dir-ze' },
  { slug: 'maison-ambre', name: 'Maison Ambre', topic: 'Perfume house', patternSlug: 'gloaming', pattern: gloaming, paletteName: 'Amber noir', palette: ['#141210', '#C9A227', '#E8D9B0', '#8C6A2F', '#FBF6EA', '#5A4632'], seed: 'dir-ma' },
  { slug: 'cairn-expeditions', name: 'Cairn', topic: 'Alpine guiding service', patternSlug: 'ridgeline', pattern: ridgeline, paletteName: 'Glacier ember', palette: ['#10222E', '#A8CEDE', '#F2F7F9', '#E8734A', '#4E7A8C', '#D8E8EF'], seed: 'dir-ca' },
  { slug: 'hopscotch-museum', name: 'Hopscotch', topic: "Children's discovery museum", patternSlug: 'glyph', pattern: glyph, paletteName: 'Crayon primaries', palette: ['#FFF9EF', '#2B2B33', '#FF5C4D', '#2E86DE', '#27C093', '#FFC53D'], seed: 'dir-ho' },
  { slug: 'cerulean-swim', name: 'Cerulean', topic: 'Swimwear label', patternSlug: 'wavelet', pattern: wavelet, paletteName: 'Lagoon', palette: ['#F2FBFC', '#0FA3B1', '#B5E2E8', '#FF8266', '#FFD97D', '#134D57'], seed: 'dir-ce' },
  { slug: 'oxbow-workshop', name: 'Oxbow', topic: 'Furniture workshop', patternSlug: 'mortise', pattern: mortise, paletteName: 'Oiled oak', palette: ['#F5F1E8', '#2E2A25', '#A9713C', '#6B4F35', '#9AA69B', '#C7BBA5'], seed: 'dir-ox' },
  { slug: 'piquant-provisions', name: 'Piquant Provisions', topic: 'Small-batch hot sauce', patternSlug: 'karst', pattern: karst, paletteName: 'Scoville', palette: ['#0F1A20', '#F4D35E', '#EE964B', '#F95738', '#EFE6DD', '#4C8FBD'], seed: 'dir-pi' },
  { slug: 'quanta-robotics', name: 'Quanta', topic: 'Robotics laboratory', patternSlug: 'hilbert', pattern: hilbert, paletteName: 'Phosphor', palette: ['#0B0E14', '#25E0C8', '#4A5568', '#E8ECF1', '#7A88FF', '#1A2230'], seed: 'dir-qu' },
  { slug: 'madrigal-strings', name: 'Madrigal', topic: 'Violin atelier', patternSlug: 'linocut', pattern: linocut, paletteName: 'Varnish', palette: ['#2D132C', '#801336', '#C72C41', '#EE4540', '#F0C419', '#FFE9C7'], seed: 'dir-md' },
  { slug: 'caldera-rail', name: 'Caldera', topic: 'Scenic railway journeys', patternSlug: 'cascade', pattern: cascade, paletteName: 'Gouache travel', palette: ['#F0EAD6', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'], seed: 'dir-cl' },

  // Swiss-minimal set: one design language, five grids. Inter throughout.
  { slug: 'konzerthaus-halden', name: 'Konzerthaus Halden', topic: 'Concert hall', patternSlug: 'crescendo', pattern: crescendo, paletteName: 'Programme red', palette: ['#F2F1EE', '#E1261C'], seed: 'dir-kh' },
  { slug: 'institut-vollmer', name: 'Institut Vollmer', topic: 'Materials research', patternSlug: 'perforate', pattern: perforate, paletteName: 'Signal blue', palette: ['#FFFFFF', '#1A1A1A', '#0B4EE0', '#9AA0A6', '#E9EBEE', '#4A4F55'], seed: 'dir-iv' },
  { slug: 'linie-nord', name: 'Linie Nord', topic: 'Regional transit', patternSlug: 'bothways', pattern: bothways, paletteName: 'Signal yellow', palette: ['#F1F1EF', '#17181A', '#FFD400', '#7E858C', '#DCDEDE', '#2A2E33'], seed: 'dir-ln' },
  { slug: 'chronometrie-bex', name: 'Chronométrie Bex', topic: 'Watch manufacture', patternSlug: 'torsion', pattern: torsion, paletteName: 'Bone and steel', palette: ['#EDEDEB', '#0E0E0E', '#FF5A1F', '#9C9C98', '#DAD9D5', '#3A3A38'], seed: 'dir-cb' },
  { slug: 'bogen-papier', name: 'Bogen Papier', topic: 'Paper merchant', patternSlug: 'taper', pattern: taper, paletteName: 'Stock green', palette: ['#FAFAF7', '#14150F', '#2E7D4F', '#C9C4B4', '#E7E5DC', '#6B6656'], seed: 'dir-bp' },

  // Pattern-forward Swiss set: full-bleed pattern fields with a transparent
  // background slot, redrawn on a timer so each page keeps moving.
  { slug: 'werkraum', name: 'Werkraum', topic: 'Architecture practice', patternSlug: 'windowpane', pattern: windowpane, paletteName: 'Basel red', palette: ['#F4F3EF', '#16161A', '#D6001C', '#8E8E88', '#C9C8C1'], seed: 'dir-wr' },
  { slug: 'nordlicht', name: 'Nordlicht', topic: 'Cartography & survey', patternSlug: 'epicentre', pattern: epicentre, paletteName: 'Chart blue', palette: ['#FCFCFA', '#0E1116', '#1B4DFF', '#8A9098', '#C3CBD4'], seed: 'dir-nl' },
  { slug: 'halbfett', name: 'Halbfett', topic: 'Type foundry', patternSlug: 'halftone', pattern: halftone, paletteName: 'Proof vermilion', palette: ['#FFFFFF', '#000000', '#FF3B14', '#9A9A9A', '#DCDCDC'], seed: 'dir-hb' },
  { slug: 'hafen-sechs', name: 'Hafen Sechs', topic: 'Container terminal', patternSlug: 'staple', pattern: staple, paletteName: 'Signal yellow, night', palette: ['#101215', '#F0EFEA', '#FFD400', '#6E747C', '#1C2026'], seed: 'dir-h6' },
  { slug: 'klangwerk', name: 'Klangwerk', topic: 'Electroacoustic studio', patternSlug: 'maelstrom', pattern: maelstrom, paletteName: 'Signal green, dark', palette: ['#08090B', '#E9E9E4', '#00E58A', '#5A6068', '#14161A'], seed: 'dir-kl' },
  { slug: 'mesura', name: 'Mesura', topic: 'Structural engineering', patternSlug: 'caltrop', pattern: caltrop, paletteName: 'Primer orange', palette: ['#F2F1ED', '#15171A', '#FF6A00', '#8C9096', '#D9D8D2'], seed: 'dir-me' },
  { slug: 'seconde', name: 'Seconde', topic: 'Sports timing', patternSlug: 'tailoff', pattern: tailoff, paletteName: 'Finish magenta', palette: ['#F7F7F5', '#101010', '#FF0059', '#8E8E8E', '#D6D6D2'], seed: 'dir-se' },
  { slug: 'cobalt-works', name: 'Cobalt Works', topic: 'Dry pigment mill', patternSlug: 'tinting', pattern: tinting, paletteName: 'Cobalt', palette: ['#F6F4EE', '#14161C', '#0033CC', '#7E8494', '#DEDBD0'], seed: 'dir-co' },
  { slug: 'nullpunkt', name: 'Nullpunkt', topic: 'Calibration laboratory', patternSlug: 'ring', pattern: ring, paletteName: 'One red, four times', palette: ['#FFFFFF', '#0A0A0A', '#E10600', '#9EA2A6', '#DBDBD9'], seed: 'dir-np' },
  { slug: 'sammlung-weiss', name: 'Sammlung Weiss', topic: 'Private art collection', patternSlug: 'quire', pattern: quire, paletteName: 'Achromatic bone', palette: ['#EFEDE6', '#111111', '#6E6A60', '#CFCBBF', '#EAE7DD'], seed: 'dir-sw' },
  { slug: 'frequenz', name: 'Frequenz 94,6', topic: 'Free radio station', patternSlug: 'ribline', pattern: ribline, paletteName: 'On-air amber', palette: ['#121014', '#F2EFE6', '#FFA200', '#6B6560', '#1D1A20'], seed: 'dir-fq' },
  { slug: 'fonds-aubert', name: 'Fonds Aubert', topic: 'Private records archive', patternSlug: 'stitch', pattern: stitch, paletteName: 'Archive olive', palette: ['#F0F0E8', '#1A1C18', '#4C6B2F', '#8C8F84', '#DEDAD4'], seed: 'dir-fa' },
  { slug: 'passform', name: 'Passform', topic: 'Bespoke tailoring', patternSlug: 'damier', pattern: damier, paletteName: 'Thread rust', palette: ['#F5F1EA', '#191512', '#C1440E', '#9A9086', '#E5DFD4'], seed: 'dir-pf' },
  { slug: 'meterware', name: 'Meterware', topic: 'Weaving mill', patternSlug: 'plait', pattern: plait, paletteName: 'Yarn indigo', palette: ['#EFEBE1', '#14161F', '#2B3FAE', '#8E8A7E', '#DCD7C9'], seed: 'dir-mw' },
  { slug: 'sichtbeton', name: 'Sichtbeton', topic: 'Fair-faced concrete', patternSlug: 'chase', pattern: chase, paletteName: 'Safety orange', palette: ['#E9E9E6', '#131313', '#FF5A00', '#8B8B87', '#D3D3CE'], seed: 'dir-sb' },
  { slug: 'kaella', name: 'Källa', topic: 'Municipal water utility', patternSlug: 'tidering', pattern: tidering, paletteName: 'Still water', palette: ['#F2F6F6', '#0F1A1D', '#00A6A6', '#7E9296', '#DCE7E7'], seed: 'dir-ka' },
  { slug: 'nachtzug', name: 'Nachtzug', topic: 'Sleeper trains', patternSlug: 'rungs', pattern: rungs, paletteName: 'Lamplight gold', palette: ['#0B0E1A', '#EDE8DA', '#E0A83C', '#545C74', '#141827'], seed: 'dir-nz' },
  { slug: 'lichtfeld', name: 'Lichtfeld', topic: 'Lighting design', patternSlug: 'radiance', pattern: radiance, paletteName: 'Warm white', palette: ['#0A0A0A', '#FAFAF5', '#F5E663', '#6A6A64', '#151515'], seed: 'dir-lf' },
  { slug: 'silbersalz', name: 'Silbersalz', topic: 'Photographic laboratory', patternSlug: 'grainfield', pattern: grainfield, paletteName: 'Safelight red', palette: ['#EDEBE4', '#101010', '#C8102E', '#8A8880', '#D9D6CC'], seed: 'dir-ss' },
  { slug: 'kryss', name: 'Kryss', topic: 'Wayfinding studio', patternSlug: 'metro', pattern: metro, paletteName: 'Directional green', palette: ['#F4F4F1', '#131416', '#00843D', '#8E9094', '#E2E2DE'], seed: 'dir-ky' },

  // Swiss-bold set: the same grid discipline turned up. Display type at
  // poster size, the full width of the viewport used as the measure, no
  // photography, and no rules - sections are divided by a change of ground
  // or by a full-bleed pattern field. Longer pages than anything above.
  { slug: 'salzhaus', name: 'Salzhaus', topic: 'Contemporary dance company', patternSlug: 'pivot', pattern: pivot, paletteName: 'Basel scarlet', palette: ['#F3F1EC', '#101014', '#FF2D00', '#8B8B85', '#DEDCD4'], seed: 'bold-sz' },
  { slug: 'zwoelfton', name: 'Zwölfton', topic: 'New-music ensemble', patternSlug: 'raking', pattern: raking, paletteName: 'Acid yellow, night', palette: ['#0B0B0F', '#EFEEE7', '#E8FF00', '#6D6D66', '#22222A'], seed: 'bold-zt' },
  { slug: 'bureau-vektor', name: 'Bureau Vektor', topic: 'Public statistics office', patternSlug: 'gutter', pattern: gutter, paletteName: 'Ultramarine', palette: ['#FFFFFF', '#0C0D10', '#1F3CFF', '#8A8F99', '#E8EAF0'], seed: 'bold-bv' },
  { slug: 'presse-neun', name: 'Presse Neun', topic: 'Screenprint workshop', patternSlug: 'swapcut', pattern: swapcut, paletteName: 'Fluoro pink', palette: ['#F4F2EA', '#141210', '#FF2D78', '#8C8A82', '#E2DFD4'], seed: 'bold-p9' },
  { slug: 'isobar', name: 'Isobar', topic: 'Meteorological service', patternSlug: 'annulus', pattern: annulus, paletteName: 'Storm violet', palette: ['#E9EDF0', '#0D1418', '#6B2BE0', '#7C8792', '#D3DAE1'], seed: 'bold-ib' },
  { slug: 'beaufort', name: 'Ateliers Beaufort', topic: 'Sail loft', patternSlug: 'sail', pattern: sail, paletteName: 'Sea green, navy', palette: ['#0B1B2B', '#EFEAE0', '#00B37A', '#6E808F', '#14293D'], seed: 'bold-bf' },
  { slug: 'grafit', name: 'Grafit', topic: 'Pencil works', patternSlug: 'reeding', pattern: reeding, paletteName: 'Pencil ochre', palette: ['#EEEDE7', '#131313', '#E5A000', '#8A887F', '#DCDAD0'], seed: 'bold-gf' },
  { slug: 'falzbogen', name: 'Falzbogen', topic: 'Trade bookbindery', patternSlug: 'miura', pattern: miura, paletteName: 'Bookcloth crimson', palette: ['#F2EEE4', '#171310', '#B0003A', '#8B857A', '#E0DACB'], seed: 'bold-fb' },
  { slug: 'kubus', name: 'Kubus', topic: 'Kunsthalle', patternSlug: 'lintel', pattern: lintel, paletteName: 'Achromatic', palette: ['#080808', '#FAFAF8', '#8A8A86', '#1C1C1C'], seed: 'bold-kb' },
  { slug: 'tiefsee', name: 'Tiefsee', topic: 'Deep-sea research programme', patternSlug: 'dipole', pattern: dipole, paletteName: 'Bioluminescent cyan', palette: ['#04121A', '#E6EEF0', '#00D2E0', '#5D7480', '#0A1F2B'], seed: 'bold-ts' },

  // Swiss-bold, with photography: the same full-bleed grid and poster type as
  // the set above, but each page also carries generated imagery. Scenes run
  // full-bleed with the pattern bands beside them; only the cut-out objects
  // are composited, onto a pattern plate drawn on a transparent ground.
  // Page palette and data/image-prompts.json project palette are the same hexes.
  { slug: 'glockenhof', name: 'Glockenhof', topic: 'Bell foundry', patternSlug: 'cupola', pattern: cupola, paletteName: 'Bronze, night', palette: ['#141210', '#F0EAD8', '#C89B3C', '#7C736A', '#221D18'], seed: 'img-gh' },
  { slug: 'orgelwerk', name: 'Orgelwerk', topic: 'Pipe organ builders', patternSlug: 'battlement', pattern: battlement, paletteName: 'Organ pine', palette: ['#F1EFE7', '#141614', '#1D6F5C', '#87887F', '#DFDCD0'], seed: 'img-ow' },
  { slug: 'marais-blanc', name: 'Marais Blanc', topic: 'Sea salt works', patternSlug: 'clipcorner', pattern: clipcorner, paletteName: 'Salt-pan rose', palette: ['#FBFAF7', '#171519', '#C2456B', '#8C8A90', '#E4E1DC'], seed: 'img-mb' },
  { slug: 'ringmark', name: 'Ringmark', topic: 'Bird observatory', patternSlug: 'birdsmouth', pattern: birdsmouth, paletteName: 'Dune lichen', palette: ['#EFEDE3', '#16180F', '#6B7F1E', '#8C8B7C', '#DEDCCE'], seed: 'img-rm' },
  { slug: 'kupferwalz', name: 'Kupferwalz', topic: 'Copper rolling mill', patternSlug: 'rolloff', pattern: rolloff, paletteName: 'Copper, mill night', palette: ['#15100E', '#EFE7DE', '#B4552D', '#7A736D', '#231A16'], seed: 'img-kw' },
  { slug: 'purpurhaus', name: 'Purpurhaus', topic: 'Natural dye works', patternSlug: 'prismfold', pattern: prismfold, paletteName: 'Cochineal plum', palette: ['#F4F0E6', '#191317', '#5E2750', '#8B8279', '#E2DBCB'], seed: 'img-ph' },
];
