import type { StudioDirection } from '../../lib/studioMatch';
import type { StoredDirection } from './schema';
import { slotLine, type SiteSlot } from './siteSchema';

// Prompts are assembled here and nowhere else. The client sends a description
// and receives a document; it never sees or influences the instructions, which
// is what keeps the endpoint task-shaped rather than a proxy.

const candidateLine = (entry: StudioDirection) =>
  `- ${entry.slug} · ${entry.name} - ${entry.topic}. ` +
  `Mood: ${entry.moods.join('/') || 'unstated'}. ` +
  `Motifs: ${entry.tags.slice(0, 4).join(', ') || 'unstated'}. ` +
  `Density: ${entry.density}. ` +
  `Palette "${entry.paletteName}": ${entry.palette.join(' ')}.`;

export function directionsSystemPrompt(candidates: StudioDirection[]): string {
  return [
    'You are a brand director choosing website directions for a small business.',
    '',
    'You will be given a description of a business and a shortlist of finished',
    'template websites. Choose exactly three of the shortlisted templates and,',
    'for each, propose a brand direction built on it.',
    '',
    'Rules:',
    '- Choose only from the shortlist, by slug. Never invent a slug.',
    '- Choose three templates that read as three genuinely different',
    '  directions - not three variations of one idea. Vary the mood, the',
    '  motif and the colour temperature.',
    '- Each palette starts with the background colour, then inks. At least one',
    '  ink must be clearly legible on that background; a palette where',
    "  everything is close in tone will be rejected and replaced with the",
    "  template's own.",
    '- Write the copy for this specific business. No placeholders, no lorem,',
    '  no invented facts about the business beyond what it was told.',
    '- "stance" is a name for the direction, two or three words.',
    '- "why" is one sentence, addressed to the business owner.',
    '',
    'The shortlist:',
    ...candidates.map(candidateLine),
  ].join('\n');
}

/** The description is data, fenced so it cannot read as instructions. */
export const directionsUserPrompt = (description: string) =>
  ['The business, in their own words:', '"""', description, '"""'].join('\n');

/**
 * Brand imagery for one chosen direction. This borrows the offline pipeline's
 * prompt craft wholesale (docs/image-pipeline.md): one subject, no text, no
 * baked shadow, and the palette anchored to materials rather than named as
 * hexes - a bare hex has nothing to attach to in a photograph.
 */
export function directionImagePrompt(
  direction: StoredDirection,
  description: string
): string {
  return [
    `A single photographic still life representing a business described as: ${description.slice(0, 240)}`,
    `The brand direction is "${direction.stance}" - ${direction.why}`,
    `Colour it from this palette, as real materials and surfaces rather than flat swatches: ${direction.palette.join(', ')}.`,
    'One subject, centred, three-quarter view, soft even studio light.',
    'No cast shadow. No text, letters, numbers, or logos.',
  ].join(' ');
}

/**
 * The full document: every text slot on the chosen template, rewritten for
 * this business in the direction already chosen.
 *
 * The direction is restated rather than chained from the directions turn,
 * because that turn was a different task with a different schema; what this
 * call needs from it is the brief - stance, name, headline, tagline - and that
 * fits in a paragraph.
 */
export function siteSystemPrompt(
  direction: StoredDirection,
  templateName: string
): string {
  const copy = direction.copy;

  return [
    'You are a copywriter rewriting a finished website template for a specific',
    'small business. The template is a complete page with a masthead, sections,',
    'cards, quotes and a footer. You will be given every piece of text on it,',
    'with what it is for and how long it may be. Write a new value for each.',
    '',
    'Rules:',
    '- Write for this business only. No placeholders, no lorem, no facts you',
    '  were not told. Where the template states a specific (a price, a date, a',
    '  count, a place), replace it with something honest for this business or',
    '  with a general phrase - never leave the template\'s own.',
    '- Keep each value the kind of thing it was: a nav label stays a short label,',
    '  a quote stays a quote, a footer line stays a footer line. Section order',
    '  and structure are not yours to change; only the words are.',
    '- Stay within each character budget. Single paragraph, no line breaks.',
    '- Only a slot marked as allowing it may contain {em}...{/em}, and there it',
    '  should wrap one short phrase for emphasis.',
    '- Use the brand name exactly as given, everywhere the template names the',
    '  business.',
    '',
    'The brand direction:',
    `- Template: ${templateName}`,
    `- Direction: ${direction.stance} - ${direction.why}`,
    copy ? `- Brand name: ${copy.brandName}` : '',
    copy ? `- Headline: ${copy.headline}` : '',
    copy ? `- Tagline: ${copy.tagline}` : '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

/** The business, fenced as data, then the slots. */
export function siteUserPrompt(description: string, slots: SiteSlot[]): string {
  return [
    'The business, in their own words:',
    '"""',
    description,
    '"""',
    '',
    'The text on the page, one line per slot:',
    ...slots.map(slotLine),
  ].join('\n');
}

/**
 * A picture for one image slot of a site. The slot's current alt text says
 * what kind of picture the template put there (a storefront, a product, a
 * portrait); the business and the direction say whose. The offline pipeline's
 * craft again: one subject, no text, palette as materials, and - because the
 * result is a cut-out on a real alpha channel - no cast shadow and nothing
 * touching the edge.
 */
export function siteImagePrompt(options: {
  description: string;
  stance: string;
  why: string;
  palette: string[];
  slotAlt: string;
  references: number;
}): string {
  return [
    `A single photographic image for the website of a business described as: ${options.description.slice(0, 240)}`,
    options.slotAlt
      ? `The template used this picture as: "${options.slotAlt.slice(0, 160)}". Make the equivalent for this business.`
      : 'Make a picture that suits this business.',
    `The brand direction is "${options.stance}" - ${options.why}`,
    `Colour it from this palette, as real materials and surfaces rather than flat swatches: ${options.palette.join(', ')}.`,
    options.references > 0
      ? 'Draw the subject, materials and setting from the reference pictures provided.'
      : '',
    'One subject, centred, three-quarter view, soft even studio light, nothing touching the edge of the frame.',
    'No cast shadow. No text, letters, numbers, or logos.',
  ]
    .filter((line) => line !== '')
    .join(' ');
}

/**
 * A conversational change to a site that already exists. The current text of
 * every slot is what the model is editing - not the template's, the person's -
 * and the instruction is fenced as data, like the description.
 */
export function reviseSystemPrompt(direction: StoredDirection, templateName: string): string {
  return [
    'You are editing the text of a finished small-business website at the',
    "owner's request. You will be given every piece of text on the page as it",
    'currently reads, and one request. Change only what the request asks for.',
    '',
    'Rules:',
    '- Return a change for each slot you alter, and no others. Untouched slots',
    '  must not appear in your answer.',
    '- Keep each value the kind of thing it was and within its length budget.',
    '- Only a slot marked as allowing it may contain {em}...{/em}.',
    '- Set palette only if the request is about colours; otherwise null.',
    '- Do not invent facts about the business.',
    '- In "note", tell the owner in one sentence what you changed.',
    '',
    `The site is built on the ${templateName} template, in the direction`,
    `"${direction.stance}" - ${direction.why}`,
  ].join('\n');
}

export function reviseUserPrompt(
  description: string,
  slots: SiteSlot[],
  instruction: string
): string {
  return [
    'The business, in their own words:',
    '"""',
    description,
    '"""',
    '',
    'The page as it currently reads, one line per slot:',
    ...slots.map(slotLine),
    '',
    'The request:',
    '"""',
    instruction,
    '"""',
  ].join('\n');
}
