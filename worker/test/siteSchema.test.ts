import { describe, expect, it } from 'vitest';
import { buildSiteValidator, siteJsonSchema, siteSlots, slotLine } from '../ai/siteSchema';
import type { TemplateSpec } from 'tabbied-templates';

// The schema the model is held to is built from the template's own spec, so
// what matters is that it admits exactly the slots the page has - every one
// required, nothing invented - and that the prompt line for a slot says what a
// writer needs: what it is, how long, what it says now.

const spec: TemplateSpec = {
  specVersion: 1,
  site: { slug: 'verdant', name: 'Verdant' },
  palette: { colors: ['#f4faf0', '#2d6a4f'], derivation: 'templateSite' },
  slots: [
    { id: 'brand.name', kind: 'text', value: 'Verdant', format: 'plain', maxChars: 24 },
    {
      id: 'hero.title',
      kind: 'text',
      value: 'Green, made {em}easy{/em}.',
      format: 'emphasis',
      maxChars: 70,
      label: 'Headline',
    },
    {
      id: 'hero.lede',
      kind: 'text',
      value: 'A '.repeat(200).trim(),
      format: 'plain',
      multiline: true,
    },
    { id: 'hero.photo', kind: 'image', src: './images/x.webp', alt: 'x' },
    { id: 'hero.field', kind: 'pattern', config: { slug: 'foliage' } },
  ],
};

describe('the site schema', () => {
  it('is built from the text slots and nothing else', () => {
    const slots = siteSlots(spec);

    expect(slots.map((slot) => slot.id)).toEqual(['brand.name', 'hero.title', 'hero.lede']);
  });

  it('requires every slot and admits no other', () => {
    const slots = siteSlots(spec);
    const json = siteJsonSchema(slots);

    expect(json.properties.text.required).toEqual(['brand.name', 'hero.title', 'hero.lede']);
    expect(json.properties.text.additionalProperties).toBe(false);
    expect(json.properties.text.properties['brand.name']).toMatchObject({ maxLength: 24 });
    expect(json.properties.text.properties['hero.lede']).not.toHaveProperty('maxLength');
    expect(json.properties.text.properties['hero.title'].description).toContain('{em}');
  });

  it('validates the same contract', () => {
    const validator = buildSiteValidator(siteSlots(spec));

    expect(
      validator.safeParse({
        text: { 'brand.name': 'Ye Joo Park', 'hero.title': 'Property, {em}personal{/em}.', 'hero.lede': 'x' },
      }).success
    ).toBe(true);

    // A missing slot, an invented one, and an empty value each fail.
    expect(validator.safeParse({ text: { 'brand.name': 'Ye Joo Park' } }).success).toBe(false);
    expect(
      validator.safeParse({
        text: { 'brand.name': 'a', 'hero.title': 'b', 'hero.lede': 'c', 'nav.99': 'd' },
      }).success
    ).toBe(false);
    expect(
      validator.safeParse({ text: { 'brand.name': '', 'hero.title': 'b', 'hero.lede': 'c' } }).success
    ).toBe(false);
  });

  it('writes a prompt line a copywriter can work from', () => {
    const [name, title, lede] = siteSlots(spec).map(slotLine);

    expect(name).toBe('- brand.name · brand.name; up to 24 characters · now: "Verdant"');
    expect(title).toContain('Headline; up to 70 characters; may wrap one phrase in {em}...{/em}');
    // A long current value is cut, so a 300-slot page does not become a 30k-token prompt.
    expect(lede.length).toBeLessThan(220);
    expect(lede.endsWith('..."')).toBe(true);
  });
});
