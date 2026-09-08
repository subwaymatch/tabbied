// Extra content for the React template sites, so each reads as a full,
// well-structured single-page website rather than a single hero. Kept in its
// own module (keyed by slug) so templateData.ts stays focused on identity and
// theming. `images` maps each item's seed to a text-to-image prompt: the cards
// render an image placeholder that shows the prompt, ready to generate a raster
// image to drop in (see https://developers.openai.com/api/docs/models/gpt-image-2).

export type TemplateContent = {
  about: {
    eyebrow: string;
    title: string;
    body: string[];
    points: string[];
  };
  features: { title: string; body: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  newsletter: { title: string; body: string; cta: string; placeholder: string };
  /** item.seed -> text-to-image prompt for that card's placeholder image. */
  images: Record<string, string>;
  /**
   * The about section's art panel. Without it the panel falls back to the
   * site's pattern, which reads as decoration next to copy that is making a
   * specific claim - an image that answers the copy does more work.
   */
  aboutImage?: string;
};

const IMG =
  'Square product photograph, soft natural studio light, shallow depth of field, high detail, no text. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.';

export const TEMPLATE_CONTENT: Record<string, TemplateContent> = {
  solstice: {
    about: {
      eyebrow: 'The Solstice way',
      title: 'A week built around slowing down',
      body: [
        'Every retreat follows the light. Mornings open with breath and movement on the deck, afternoons are yours for the trail or the tide, and evenings close with a long, quiet practice as the sun goes down.',
        'Groups stay small on purpose. With twelve guests and two teachers, nobody is a face in a crowd, and every practice can bend to the room in front of it.',
      ],
      points: [
        'Two daily practices, all levels welcome',
        'Chef-cooked plant-forward meals',
        'Ocean-view rooms, no shared bunks',
      ],
    },
    features: [
      { title: 'Arrive', body: 'A slow first evening: settle in, meet your teachers, unclench.' },
      { title: 'Unwind', body: 'Five days of movement, breath, sea air, and nowhere to be.' },
      { title: 'Carry it home', body: 'A simple practice you can keep long after the drive back.' },
    ],
    testimonials: [
      { quote: 'I came back a different person. Slower, in the best way.', name: 'Priya N.', role: 'Spring 2025 guest' },
      { quote: 'The smallest group I have ever practiced with, and the warmest.', name: 'Daniel R.', role: 'Autumn 2025 guest' },
    ],
    newsletter: {
      title: 'Dates before anyone else',
      body: 'Join the list for 2026 openings and the occasional day-retreat near you.',
      cta: 'Keep me posted',
      placeholder: 'you@email.com',
    },
    images: {
      sol1: `A serene coastal yoga deck at sunrise overlooking the Pacific, a single rolled mat, warm dawn light. ${IMG}`,
      sol2: `A misty redwood clearing with soft golden light through the trees, calm and meditative. ${IMG}`,
      sol3: `An amber-lit evening meditation space with floor cushions and low candles, warm dusk tones. ${IMG}`,
    },
  },

  'ember-and-oak': {
    aboutImage:
      'A wood-fired hearth burning low in a restaurant kitchen, split oak stacked beside it, glowing coals and warm firelight on stone. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'The hearth',
      title: 'One fire, and a menu that follows it',
      body: [
        'Everything at Ember & Oak meets the flame. A single wood-fired hearth anchors the room, and the menu changes with whatever the fire and the market give us that week.',
        'Sit close and watch the coals, or take the far banquette and let the smoke find you. Either way, dinner starts at the fire.',
      ],
      points: [
        'Live-fire kitchen, oak and fruitwood only',
        'A menu rewritten with the seasons',
        'Counter seats facing the hearth',
      ],
    },
    features: [
      { title: 'Wood', body: 'Oak for heat, fruitwood for the finish, nothing from a bottle.' },
      { title: 'Season', body: 'We cook what the market has this morning, not what a printer set last month.' },
      { title: 'The counter', body: 'Eight seats at the pass, the best show in the house.' },
    ],
    testimonials: [
      { quote: 'You taste the smoke in everything, and you never want it to stop.', name: 'Sofia D.', role: 'Diner' },
      { quote: 'The rib alone is worth the reservation scramble.', name: 'Marcus T.', role: 'Food critic' },
    ],
    newsletter: {
      title: 'This week at the hearth',
      body: 'Tonight-only specials and the odd last-minute counter seat, straight to your inbox.',
      cta: 'Pull up a chair',
      placeholder: 'you@email.com',
    },
    images: {
      emb1: `A charred whole leek plated with ember cream and hazelnut, dark moody restaurant lighting. ${IMG}`,
      emb2: `A wood-fired dry-aged rib chop resting over glowing coals, deep amber firelight. ${IMG}`,
      emb3: `A smoked pear dessert with burnt honey cream on dark ceramic, warm low light. ${IMG}`,
    },
  },

  facet: {
    aboutImage:
      'A jeweller\'s bench in low warm light, loupe, gravers and a single gold ring on a leather pad. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'The house',
      title: 'One remarkable stone at a time',
      body: [
        'Every Facet piece is built around a single stone we can trace to the mine that cut it. We set it by hand, in gold or platinum, to be worn for decades and handed down after that.',
        'Come with a stone of your own or start with a spark of an idea, and we will design the rest together.',
      ],
      points: [
        'Ethically sourced, fully traceable stones',
        'Hand-set in solid gold and platinum',
        'Bespoke commissions welcome',
      ],
    },
    features: [
      { title: 'Source', body: 'Stones with a name and an origin, never a mystery lot.' },
      { title: 'Design', body: 'A setting drawn around your stone, not pulled from a tray.' },
      { title: 'Keep', body: 'Made to outlast trends, and us, with lifetime care.' },
    ],
    testimonials: [
      { quote: 'They turned my grandmother\'s stone into something I will never take off.', name: 'Eleanor V.', role: 'Bespoke client' },
      { quote: 'Quietly the finest setting work I have seen.', name: 'Jonas W.', role: 'Collector' },
    ],
    newsletter: {
      title: 'First look at new pieces',
      body: 'Occasional previews of new collections and one-of-a-kind stones.',
      cta: 'Request an invite',
      placeholder: 'you@email.com',
    },
    images: {
      fac1: `A sapphire solitaire ring in 18k gold on black velvet, jewel-toned reflections, macro detail. ${IMG}`,
      fac2: `A tourmaline drop pendant on platinum against deep midnight blue, sparkling facets. ${IMG}`,
      fac3: `A diamond band in rose gold catching prismatic light on dark stone, elegant macro. ${IMG}`,
    },
  },

  // ---- Ported from the static-HTML samples (sites 1-10) ----
  verdant: {
    aboutImage:
      'A bright plant shop corner, tiered shelves of leafy houseplants in terracotta and pale pots, sunlight through a tall window. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'Our promise',
      title: 'Plants that actually make it',
      body: [
        'We match every plant to your light before it ships, pot it in peat-free soil, and text you a care plan so nothing gets guessed at.',
        'If it struggles in the first month, we replace it. No receipts, no questions.',
      ],
      points: ['Matched to your light', 'Peat-free potting', '30-day thrive guarantee'],
    },
    features: [
      { title: 'Match', body: 'A two-minute quiz points you to plants that suit your space.' },
      { title: 'Deliver', body: 'Potted, watered, and boxed to arrive standing up and happy.' },
      { title: 'Support', body: 'Text a botanist any time your leaves look unsure.' },
    ],
    testimonials: [
      { quote: 'First plants I have ever managed to keep alive.', name: 'Mei L.', role: 'Customer' },
      { quote: 'The care texts are weirdly delightful.', name: 'Sam P.', role: 'Plant parent' },
    ],
    newsletter: {
      title: 'Grow with us',
      body: 'Seasonal care tips and first dibs on rare drops, about twice a month.',
      cta: 'Sign up',
      placeholder: 'you@email.com',
    },
    images: {
      v1: 'A potted ZZ plant with glossy dark-green leaves in a matte ceramic pot, bright airy interior. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      v2: 'A tall fiddle-leaf fig in a woven basket by a sunlit window, fresh green houseplant photography. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      v3: 'A tall fiddle-leaf fig in a woven basket against a pale wall, broad glossy leaves, lush and vibrant. This is a houseplant, not an animal, and no birds or creatures appear. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    },
  },

zest: {
    about: {
      eyebrow: 'How Zest works',
      title: 'Short lists, big flavour',
      body: [
        'Every recipe is built around a handful of ingredients you can actually find and a cook time that fits a weeknight. We test each one until a tired person can nail it.',
        'No ten-step reductions, no shopping for one obscure thing. Just fast food that tastes like you tried.',
      ],
      points: ['Ten ingredients or fewer', 'One pan where we can', 'Tested by real weeknight cooks'],
    },
    features: [
      { title: 'Pick', body: 'Filter by time, mood, or what is wilting in the fridge.' },
      { title: 'Cook', body: 'Clear steps, big photos, and a timer built into every recipe.' },
      { title: 'Brag', body: 'Snap it, share it, and pretend it took longer than it did.' },
    ],
    testimonials: [
      { quote: 'I cook from Zest four nights a week now.', name: 'Aya T.', role: 'Subscriber' },
      { quote: 'Finally recipes that respect a Tuesday.', name: 'Marco B.', role: 'Home cook' },
    ],
    newsletter: {
      title: 'Dinner, sorted',
      body: 'One quick recipe in your inbox every weekday afternoon.',
      cta: 'Get the box',
      placeholder: 'you@email.com',
    },
    images: {
      z1: 'A vibrant chili-lime corn bowl in a colorful bowl, fresh and appetizing overhead food photo. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      z2: 'A skillet of blistered cherry tomato orzo with basil, bright and saucy weeknight dinner. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      z3: 'A tangle of sesame crunch noodles with scallions in a bowl, glossy and colorful food photo. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    },
  },

  nocturne: {
    aboutImage:
      'A dark perfumer\'s organ of amber sample bottles on a lacquered surface, one glass flacon lit in a single pool of light. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'The house',
      title: 'Composed like music, worn like memory',
      body: [
        'Nocturne is a small perfume house that works the way a composer does: a few notes, held in balance, that unfold over hours. Each scent is built to change as the night goes on.',
        'We bottle in refillable glass and never test on animals.',
      ],
      points: ['Extrait concentrations', 'Refillable glass', 'Never tested on animals'],
    },
    features: [
      { title: 'Compose', body: 'Our perfumer builds each scent around a single central accord.' },
      { title: 'Age', body: 'Every batch rests for weeks before it is ever bottled.' },
      { title: 'Wear', body: 'A discovery set lets you live with three before you commit.' },
    ],
    testimonials: [
      { quote: 'Strangers stop me to ask what I am wearing.', name: 'Camille D.', role: 'Client' },
      { quote: 'It smells like a memory I have not made yet.', name: 'Iris N.', role: 'Client' },
    ],
    newsletter: {
      title: 'Private previews',
      body: 'Occasional notes on new compositions and members-only releases.',
      cta: 'Request an invitation',
      placeholder: 'you@email.com',
    },
    images: {
      n1: 'A faceted perfume bottle glowing amethyst on black velvet, luxurious moody product photograph. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      n2: 'A dark still life of a perfume flacon among night-blooming flowers, deep purple and violet. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      n3: 'A minimalist perfume bottle backlit in soft violet haze, elegant and cinematic. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped - no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    },
  },

  };
