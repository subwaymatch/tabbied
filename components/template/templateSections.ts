// Per-site composition for the React template sites: a visual "kit" (how the
// page is dressed) and an ordered list of sections, plus the content for the
// new section types. This is what makes the ten sites feel distinct rather than
// one template, they pick different kits, different section orders, and mix in
// manifestos, alternating illustrated rows, icon grids, FAQs, big quotes, logo
// clouds, and galleries. Existing about/features/testimonials/newsletter/images
// live in templateContent.ts; stats live in templateData.ts.

export type Kit = 'soft' | 'editorial' | 'brutal' | 'bordered' | 'minimal';

// Section keys the page can render (hero is always first, footer always last).
export type SectionKey =
  | 'stats'
  | 'statBand'
  | 'about'
  | 'manifesto'
  | 'altRows'
  | 'iconFeatures'
  | 'items'
  | 'process'
  | 'pricing'
  | 'specs'
  | 'team'
  | 'gallery'
  | 'features'
  | 'testimonials'
  | 'bigQuote'
  | 'faq'
  | 'logos'
  | 'band'
  | 'newsletter';

export type SectionContent = {
  kit: Kit;
  sections: SectionKey[];
  manifesto?: { kicker: string; text: string };
  /** Alternating illustrated rows. `image` is a text-to-image prompt. */
  altRows?: { eyebrow: string; title: string; body: string; image: string }[];
  /** Icon grid. `icon` is a lucide-react icon name. */
  iconFeatures?: { icon: string; title: string; body: string }[];
  faq?: { q: string; a: string }[];
  bigQuote?: { quote: string; name: string; role: string };
  logos?: string[];
  /** Numbered steps: how the thing actually works. */
  process?: { kicker: string; title: string; sub?: string; steps: { title: string; body: string }[] };
  /** Tiers, rates, or ticket types. */
  pricing?: {
    kicker: string; title: string; sub?: string;
    tiers: { name: string; price: string; unit: string; body: string; includes: string[]; cta: string; featured?: boolean }[];
  };
  /** A plain detail table: materials, logistics, specifications. */
  specs?: { kicker: string; title: string; sub?: string; rows: { k: string; v: string }[] };
  /**
   * People, each with a generated portrait (see Team in TemplateSite.tsx).
   *
   * `portraitScene` is the half of the prompt the whole team shares - where
   * they are and how it is lit - and each person's `role` completes it. One
   * line per team instead of one prompt per person, and it keeps a site's
   * people looking like colleagues rather than a stock-photo grab bag.
   */
  team?: {
    kicker: string;
    title: string;
    sub?: string;
    portraitScene: string;
    /** `look` is the authored appearance for this person's generated portrait. */
    people: { name: string; role: string; bio: string; look: string }[];
  };
  /** Lookbook of text-to-image prompts. */
  gallery?: string[];
  /**
   * A generated photograph behind the hero's art panel, with a pattern drawn
   * over it (see HeroArt). Without it the panel is the pattern alone, which is
   * what the other nineteen sites do.
   */
  heroImage?: string;
  /**
   * Pattern slug drawn over `heroImage`, defaulting to the site's last. It is
   * named rather than inferred because the choice is load-bearing: the overlay
   * is opaque, so the design has to be a sparse one whose gaps are real
   * negative space (lines, frames, scattered marks) rather than a dense field
   * that would simply cover the photograph.
   */
  heroOverlayPattern?: string;
};

const IMG =
  'Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.';

export const TEMPLATE_SECTIONS: Record<string, SectionContent> = {
  solstice: {
    kit: 'soft',
    sections: ['stats', 'manifesto', 'altRows', 'iconFeatures', 'items', 'process', 'bigQuote', 'pricing', 'gallery', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'A day here',
      title: 'The shape of a Solstice day',
      sub: 'Loose enough to breathe, structured enough that you never have to decide anything.',
      steps: [
        { title: 'First light', body: 'Tea on the deck at 6:30, then an hour of breath and slow movement while the fog burns off.' },
        { title: 'The long table', body: 'Breakfast is one seating, family style, cooked from whatever the farm sent up that morning.' },
        { title: 'Open hours', body: 'Trail, tide pools, hammock, or nothing at all. Teachers are around if you want them.' },
        { title: 'Closing practice', body: 'A restorative hour as the light goes amber, then dinner and an early, honest bedtime.' },
      ],
    },
    pricing: {
      kicker: 'Rates',
      title: 'What a week costs',
      sub: 'Every rate covers seven nights, all meals, and all practices. Nothing is sold to you once you arrive.',
      tiers: [
        { name: 'Shared room', price: '$2,400', unit: 'per person', body: 'Two guests to a room, both beds facing the water.', includes: ['Seven nights', 'All meals and practices', 'Shuttle from the airport'], cta: 'Check dates' },
        { name: 'Private room', price: '$3,200', unit: 'per person', body: 'Your own room, your own deck, the same long table.', includes: ['Everything in Shared', 'Private ocean-view room', 'One session with a teacher, just you'], cta: 'Check dates', featured: true },
        { name: 'Whole house', price: '$26,000', unit: 'per week', body: 'Take the property for your studio, family, or team.', includes: ['Twelve guests', 'A schedule built with you', 'Dedicated chef and two teachers'], cta: 'Enquire' },
      ],
    },
    manifesto: {
      kicker: 'Our philosophy',
      text: 'Rest is not a reward for finishing. It is the practice. We build every retreat around that one idea.',
    },
    altRows: [
      { eyebrow: 'Mornings', title: 'Start with the sun, not an alarm', body: 'Practice opens on the deck at first light, then breakfast, then the whole day is yours. No schedule to outrun.', image: `A peaceful sunrise yoga session on a wooden deck facing the ocean, warm dawn glow. ${IMG}` },
      { eyebrow: 'Evenings', title: 'Wind down as the light goes', body: 'A long, slow restorative practice closes each day as the sky turns amber and the tide comes in.', image: `A candle-lit restorative yoga room at dusk with floor cushions, bolsters and folded blankets arranged on the floor, warm amber tones. The room is empty, with no people or bodies in the frame. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Sunrise', title: 'All levels', body: 'Every practice bends to the room, first-timers to teachers.' },
      { icon: 'Leaf', title: 'Plant-forward', body: 'Chef-cooked meals from the garden and the market.' },
      { icon: 'Waves', title: 'On the water', body: 'Ocean-view rooms and a private stretch of coast.' },
      { icon: 'HeartHandshake', title: 'Small groups', body: 'Twelve guests, two teachers, nobody lost in a crowd.' },
    ],
    bigQuote: { quote: 'I arrived wound tight and left feeling like myself for the first time in years.', name: 'Priya N.', role: 'Spring 2025 guest' },
    faq: [
      { q: 'Do I need to be flexible?', a: 'Not at all. We meet you where you are, every single practice.' },
      { q: 'What is included?', a: 'All practices, meals, and your room for the week. You just get here.' },
      { q: 'Can I come alone?', a: 'Most guests do. You will not feel alone by the second morning.' },
      { q: 'What about dietary needs?', a: 'Tell us when you book and our chef will take care of it.' },
    ],
    gallery: [
      `A serene ocean-view retreat cabin interior with linen bedding, soft morning light. ${IMG}`,
      `A quiet coastal trail through wildflowers at golden hour. ${IMG}`,
      `A group meditating on a cliff at sunset, silhouettes against warm sky. ${IMG}`,
      `A rustic wooden table set with a colorful plant-based breakfast outdoors. ${IMG}`,
    ],
  },

  'ember-and-oak': {
    kit: 'editorial',
    sections: ['about', 'items', 'process', 'altRows', 'bigQuote', 'iconFeatures', 'gallery', 'team', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'The fire',
      title: 'Everything starts at the hearth',
      sub: 'One fire, lit before the first delivery, feeding every station on the line.',
      steps: [
        { title: 'Split and season', body: 'Oak and almond, air dried for eighteen months in the yard behind the building.' },
        { title: 'Build at six', body: 'Lit before the first delivery arrives and never allowed to go out until close.' },
        { title: 'Cook on coals', body: 'No gas on the line at all. Everything is grilled, ember roasted, or buried in ash.' },
        { title: 'Finish in the ash', body: 'Whole vegetables go in overnight and come out for the next day menu.' },
      ],
    },
    team: {
      kicker: 'The kitchen',
      title: 'Who is cooking',
      sub: 'A short line, all of it within arm reach of the fire.',
      portraitScene:
        'in the open kitchen of a wood-fired restaurant, warm firelight from the hearth behind them',
      people: [
        { name: 'Sofia Marchetti', role: 'Chef, owner', bio: 'Learned fire cooking in Piedmont, then spent a decade getting it wrong before this room.', look: 'a woman in her fifties with grey curls pinned up, sleeves pushed back, chef whites' },
        { name: 'Daniel Osei', role: 'Head of hearth', bio: 'Runs the coals, and has opinions about oak he will share unprompted.', look: 'a Black man in his forties with a shaved head and a heavy canvas apron' },
        { name: 'Reiko Tanaka', role: 'Pastry', bio: 'Bakes in the falling heat after service, which is why the bread tastes like that.', look: 'a Japanese woman in her thirties with straight hair under a bandana, pastry whites' },
        { name: 'Marco Silva', role: 'General manager', bio: 'Front of house, the wine list, and the person who finds you a table.', look: 'a man in his forties in a dark shirt, warm and unhurried' },
      ],
    },
    altRows: [
      { eyebrow: 'The fire', title: 'One hearth, all night', body: 'Oak for heat, fruitwood for the finish. The fire is the pilot light of the whole kitchen and the center of the room.', image: `A glowing wood-fired restaurant hearth with flames and embers, deep amber light. ${IMG}` },
      { eyebrow: 'The counter', title: 'The best seat faces the flame', body: 'Eight stools at the pass, close enough to feel the heat and watch every plate leave the fire.', image: `A chef plating a dish on the pass of a fire-lit restaurant kitchen, dark and moody, warm glow. The person at work is shown whole with their head and upper body in frame. ${IMG}` },
    ],
    bigQuote: { quote: 'You taste the smoke in everything, and you never want it to stop.', name: 'Sofia D.', role: 'Diner' },
    iconFeatures: [
      { icon: 'Flame', title: 'Live fire', body: 'Everything meets the flame, nothing meets a gas ring.' },
      { icon: 'Leaf', title: 'Market-led', body: 'The menu changes with whatever came in this morning.' },
      { icon: 'Utensils', title: 'Eight seats at the pass', body: 'Sit at the counter and watch the whole thing happen an arm away.' },
    ],
    gallery: [
      `A charred whole leek with ember cream on dark ceramic, moody restaurant light. ${IMG}`,
      `A wood-fired rib chop resting over glowing coals, amber firelight. ${IMG}`,
      `A smoked pear dessert with burnt honey cream, warm low light. ${IMG}`,
      `A dim dining room glowing around an open hearth, intimate and warm. ${IMG}`,
    ],
    faq: [
      { q: 'How far ahead should I book?', a: 'Counter seats go two weeks out. We hold a few for walk-ins.' },
      { q: 'Is the menu fixed?', a: 'A short a la carte plus a chef tasting at the counter.' },
      { q: 'Do you cater to dietary needs?', a: 'Tell us when you book and we will build around it.' },
      { q: 'Is there parking?', a: 'Street parking after 6, and a lot two doors down.' },
    ],
  },

  facet: {
    kit: 'minimal',
    sections: ['manifesto', 'about', 'items', 'process', 'altRows', 'bigQuote', 'iconFeatures', 'specs', 'gallery', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'Commissions',
      title: 'How a piece gets made',
      sub: 'Eight to twelve weeks, from the first conversation to the box.',
      steps: [
        { title: 'Talk', body: 'An hour, in the studio or on a call, about the person it is for and how they live.' },
        { title: 'Draw', body: 'Two or three directions in pencil and wax. You pick one and we refine it together.' },
        { title: 'Set', body: 'Cast in the studio, stones set by hand, finished across three or four days.' },
        { title: 'Look after', body: 'Cleaned and checked free, forever. Resizing is free for the first two years.' },
      ],
    },
    specs: {
      kicker: 'Materials',
      title: 'What is in it',
      sub: 'Provenance on request for every stone over half a carat.',
      rows: [
        { k: 'Gold', v: '18 carat, recycled, refined in the UK. We have not bought newly mined gold since 2019.' },
        { k: 'Diamonds', v: 'Lab grown as standard. Natural stones only from single-mine traceable sources.' },
        { k: 'Coloured stones', v: 'Bought at origin in Sri Lanka and Malawi, with no auction house in between.' },
        { k: 'Setting', v: 'Set by hand in the studio. Nothing is sent out to a trade bench.' },
        { k: 'Sizing', v: 'Free for two years, then at cost. Most bands move two sizes either way.' },
        { k: 'Boxes', v: 'Ash and wool felt, made forty miles away, designed to be kept rather than binned.' },
      ],
    },
    manifesto: {
      kicker: 'The idea',
      text: 'One remarkable stone, set by hand, made to outlast every trend and be handed down after that.',
    },
    altRows: [
      { eyebrow: 'The stone', title: 'Traceable to the source', body: 'We buy from cutters we know and can trace every stone to its origin. Beauty should not cost the earth or anyone on it.', image: `A single brilliant gemstone held in tweezers under jeweller's light, jewel tones. ${IMG}` },
      { eyebrow: 'The setting', title: 'Drawn around your stone', body: 'Every setting is designed for its stone, never pulled from a tray, then set by hand in gold or platinum.', image: `A gold ring with a freshly set gemstone resting on a jeweller's workbench beside fine setting tools, elegant macro. No people, no hands and no body parts appear in the frame. ${IMG}` },
    ],
    bigQuote: { quote: 'They turned my grandmother\'s stone into something I will never take off.', name: 'Eleanor V.', role: 'Bespoke client' },
    iconFeatures: [
      { icon: 'Gem', title: 'Traceable stones', body: 'Ethically sourced, with a name and an origin.' },
      { icon: 'PenTool', title: 'Bespoke design', body: 'A setting drawn around your stone, together.' },
      { icon: 'Sparkles', title: 'Lifetime care', body: 'Cleaning, re-tipping, and resizing, always free.' },
    ],
    gallery: [
      `A sapphire solitaire ring on black velvet, jewel-toned reflections, macro. ${IMG}`,
      `A tourmaline pendant on platinum against midnight blue, sparkling facets. ${IMG}`,
      `A diamond band in rose gold catching prismatic light. ${IMG}`,
      `A loose emerald on dark stone under a jeweller's loupe. ${IMG}`,
    ],
    faq: [
      { q: 'Can I bring my own stone?', a: 'Absolutely. Many of our pieces begin with an heirloom.' },
      { q: 'How long does bespoke take?', a: 'Six to ten weeks, from first sketch to final polish.' },
      { q: 'Do you offer financing?', a: 'Yes, interest-free over six or twelve months.' },
      { q: 'What about resizing?', a: 'Free for the life of the piece.' },
    ],
  },

  // ---- Ported from the static-HTML samples (sites 1-10) ----
  verdant: {
    kit: 'soft',
    sections: ['stats', 'about', 'altRows', 'items', 'specs', 'iconFeatures', 'gallery', 'process', 'testimonials', 'band', 'newsletter'],
    specs: {
      kicker: 'Care',
      title: 'What each plant actually needs',
      sub: 'The honest version, rather than a tag that says easy care on everything.',
      rows: [
        { k: 'Light', v: 'Bright indirect means within two metres of a window it can see sky from.' },
        { k: 'Water', v: 'When the top five centimetres are dry. Not Sundays. Plants cannot read a calendar.' },
        { k: 'Humidity', v: 'Most of these want about 50 percent. A grouped shelf beats any amount of misting.' },
        { k: 'Repotting', v: 'Every second spring, one size up. Bigger is not kinder, it just holds water.' },
        { k: 'Feeding', v: 'Half strength, fortnightly, March to September. Nothing at all over winter.' },
        { k: 'If it dies', v: 'Send us a photo within thirty days and we replace it, with no argument.' },
      ],
    },
    process: {
      kicker: 'Delivery',
      title: 'How it reaches you alive',
      sub: 'The part most plant shops would rather not talk about.',
      steps: [
        { title: 'Picked wet', body: 'Watered the night before, so it travels damp rather than soaked, and never dry.' },
        { title: 'Braced', body: 'Root ball bagged, stem cradled in moulded pulp, nothing loose rattling around.' },
        { title: 'Sent Monday', body: 'Only at the start of the week, so nothing sits in a depot over a weekend.' },
        { title: 'Two weeks off', body: 'Leave it somewhere bright and do nothing. Repotting on day one is what kills them.' },
      ],
    },
    altRows: [
      {
        eyebrow: 'Matched to you',
        title: 'The right plant for your light',
        body: 'Tell us which way your windows face and how much sun you get, and we point you to plants that will actually be happy there.',
        image: 'A sunlit windowsill lined with healthy green houseplants, bright and airy. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'Delivered thriving',
        title: 'Potted, watered, ready',
        body: 'Every plant arrives in peat-free soil, watered and boxed to stand up straight, with a care card in the leaves.',
        image: 'A potted plant standing in an open cardboard delivery box on a pale floor, packing paper folded back around it, fresh green. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
    ],
    iconFeatures: [
      { icon: 'Leaf', title: 'Light-matched', body: 'A quick quiz points you to plants that suit your space.' },
      { icon: 'Truck', title: 'Next-day local', body: 'Potted and delivered across the city.' },
      { icon: 'MessagesSquare', title: 'Text a botanist', body: 'Real care advice whenever a leaf looks unsure.' },
      { icon: 'Recycle', title: 'Peat-free', body: 'Kinder soil, sturdier roots.' },
    ],
    gallery: [
      'A ZZ plant with glossy leaves in a matte pot, bright airy interior. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A tall fiddle-leaf fig in a woven basket by a window. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A cluster of small potted succulents on a shelf. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A large monstera deliciosa in a simple ceramic pot against a pale wall, broad glossy split leaves. This is a houseplant, not an animal, and no birds or creatures appear. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    faq: [
      { q: 'What if my plant struggles?', a: 'Our 30-day thrive promise replaces it, no receipt needed.' },
      { q: 'Do you deliver everywhere?', a: 'Next-day within the city, standard shipping nationwide.' },
      { q: 'Are the plants pet-safe?', a: 'Each listing flags pet-safe options clearly.' },
      { q: 'Can I gift a plant?', a: 'Yes, with a hand-written note and gift wrap.' },
    ],
  },

zest: {
    kit: 'soft',
    sections: [
      'stats',
      'manifesto',
      'iconFeatures',
      'items',
      'process',
      'altRows',
      'gallery',
      'pricing',
      'testimonials',
      'faq',
      'band',
      'newsletter',
    ],
    process: {
      kicker: 'The method',
      title: 'Every recipe, the same shape',
      sub: 'Because the thing that stops you cooking is not skill, it is the deciding.',
      steps: [
        { title: 'Read it once', body: 'One page, no story about a holiday, nothing to scroll past to reach the list.' },
        { title: 'Ten minutes prep', body: 'Everything chopped before anything is hot. It is the only rule that really matters.' },
        { title: 'One pan, high heat', body: 'Most of these are twelve minutes on the hob, and none of them need a thermometer.' },
        { title: 'Acid at the end', body: 'Lemon, vinegar, or pickle liquid. That is the whole trick, and it costs nothing.' },
      ],
    },
    pricing: {
      kicker: 'Membership',
      title: 'Or just cook for free',
      sub: 'Half of everything we publish stays open, permanently, with no wall on it.',
      tiers: [
        {
          name: 'Free',
          price: '0 GBP',
          unit: 'forever',
          body: 'Two new recipes a week and the whole basics section.',
          includes: ['Two recipes weekly', 'Every technique guide', 'No account needed'],
          cta: 'Start cooking',
        },
        {
          name: 'Member',
          price: '5 GBP',
          unit: 'per month',
          body: 'Everything, plus the shopping list that actually adds up.',
          includes: ['The full archive', 'Shopping lists built for you', 'Seasonal meal plans'],
          cta: 'Join',
          featured: true,
        },
        {
          name: 'Household',
          price: '40 GBP',
          unit: 'per year',
          body: 'Up to five people, one bill, lists shared across everyone phones.',
          includes: ['Everything in Member', 'Five accounts', 'One shared weekly plan'],
          cta: 'Join',
        },
      ],
    },
    manifesto: {
      kicker: 'The Zest rule',
      text: 'If a tired person cannot cook it on a Tuesday, it does not go in the box. Short lists, big flavour, every time.',
    },
    iconFeatures: [
      { icon: 'Timer', title: '30 minutes', body: 'Most recipes, start to plate, in half an hour.' },
      { icon: 'Flame', title: 'One pan', body: 'Less washing up, more eating.' },
      { icon: 'Salad', title: 'Ten ingredients', body: 'Things you can actually find, nothing obscure.' },
    ],
    altRows: [
      {
        eyebrow: 'Tested',
        title: 'Cooked until a beginner can nail it',
        body: 'Every recipe gets made again and again until the steps are foolproof and the timing is honest.',
        image: 'A bright overhead shot of a colorful fresh weeknight dinner in a bowl. The food itself is warm and natural - reds, oranges, yellows, greens and browns only. No blue or teal anywhere on the food; the teal in the palette belongs to props and linens in the background, never to anything edible. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'Fast',
        title: 'Built for a real weeknight',
        body: 'Short ingredient lists, short cook times, and a timer baked into every step so nothing burns.',
        image: 'A skillet of vibrant vegetables sizzling on a stovetop, bright and fresh. The food itself is warm and natural - reds, oranges, yellows, greens and browns only. No blue or teal anywhere on the food; the teal in the palette belongs to props and linens in the background, never to anything edible. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
    ],
    gallery: [
      'A vibrant chili-lime corn bowl, appetizing overhead food photo. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A skillet of blistered tomato orzo with basil. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A bowl of glossy sesame crunch noodles with scallions. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'Charred broccoli tacos on a bright plate. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    faq: [
      { q: 'How does the box work?', a: 'A recipe lands in your inbox every weekday afternoon.' },
      { q: 'Can I filter for diet?', a: 'Yes, vegetarian, vegan, and quick filters on everything.' },
      { q: 'Do I need special equipment?', a: 'A pan, a pot, and a knife. That is the whole kit.' },
      { q: 'Is it free?', a: 'The weekday recipe is free. Members get the full archive.' },
    ],
  },

  nocturne: {
    kit: 'minimal',
    sections: [
      'manifesto',
      'about',
      'items',
      'specs',
      'altRows',
      'bigQuote',
      'iconFeatures',
      'process',
      'gallery',
      'faq',
      'band',
      'newsletter',
    ],
    specs: {
      kicker: 'Composition',
      title: 'What is in the bottle',
      sub: 'The full pyramid and the concentration, printed on every carton.',
      rows: [
        { k: 'Concentration', v: 'Extrait at 24 percent. It lasts because of the oil load, not because of a fixative.' },
        { k: 'Top', v: 'Bergamot, pink pepper, and a green note lifted from crushed fig leaf.' },
        { k: 'Heart', v: 'Orris butter, jasmine absolute, and a small amount of leather underneath.' },
        { k: 'Base', v: 'Sandalwood, ambrette seed, and vetiver from a single farm in Haiti.' },
        { k: 'Naturals', v: 'Eighty-two percent by weight. The rest is there because nature cannot do it safely.' },
        { k: 'Maceration', v: 'Six weeks in steel before bottling. Nothing ships the week it was mixed.' },
      ],
    },
    process: {
      kicker: 'The making',
      title: 'One perfumer, four years',
      sub: 'Not a brief sent out to a fragrance house. It was made in the room next door.',
      steps: [
        { title: 'The idea', body: 'A city at two in the morning, and the specific kind of quiet that comes with it.' },
        { title: 'Four hundred trials', body: 'Numbered, dated, and kept. Trial 61 and trial 388 are both in the final.' },
        { title: 'Live with it', body: 'Six months of wearing the shortlist before anything was called finished.' },
        { title: 'Bottle small', body: 'Batches of nine hundred, poured and labelled by hand, every one numbered.' },
      ],
    },
    manifesto: {
      kicker: 'The house',
      text: 'A perfume should change as the night does. We compose in a few notes, held in balance, that unfold for hours.',
    },
    altRows: [
      {
        eyebrow: 'The composition',
        title: 'Built around one accord',
        body: 'Each scent begins with a single idea and a few materials, layered so it opens, turns, and settles like a piece of music.',
        image: 'A dark still life of a faceted perfume bottle among night flowers, deep violet. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'The maturation',
        title: 'Rested before it is bottled',
        body: 'Every batch sits for weeks so the materials marry, then it is decanted into refillable glass by hand.',
        image: "A perfumer's dim atelier with amber bottles and a single lamp, moody violet. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.",
      },
    ],
    bigQuote: { quote: 'It smells like a memory I have not made yet.', name: 'Iris N.', role: 'Client' },
    iconFeatures: [
      { icon: 'Moon', title: 'Composed for night', body: 'Deeper materials that speak after dark.' },
      { icon: 'FlaskConical', title: 'Extrait strength', body: 'High concentration, long on the skin.' },
      { icon: 'Recycle', title: 'Refillable glass', body: 'Bring the bottle back, we fill it again.' },
    ],
    gallery: [
      'A faceted perfume bottle glowing amethyst on black velvet, luxurious. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A dark arrangement of night-blooming flowers, deep purple. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A minimalist flacon backlit in soft violet haze. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A close-up of perfume being sprayed, a fine violet mist. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    faq: [
      { q: 'How long does it last?', a: 'Our extraits sit close to the skin for eight hours or more.' },
      { q: 'Can I try before buying?', a: 'The discovery set holds three, redeemable against a bottle.' },
      { q: 'Do you refill?', a: 'Bring any Nocturne bottle back for a refill at a lower price.' },
      { q: 'Are they vegan?', a: 'Fully vegan and never tested on animals.' },
    ],
  },

  };
