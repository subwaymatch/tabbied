// Extra content for the React showcase sites, so each reads as a full,
// well-structured single-page website rather than a single hero. Kept in its
// own module (keyed by slug) so showcaseData.ts stays focused on identity and
// theming. `images` maps each item's seed to a GPT Image 2 prompt: the cards
// render an image placeholder that shows the prompt, ready to generate a raster
// image to drop in (see https://developers.openai.com/api/docs/models/gpt-image-2).

export type ShowcaseContent = {
  about: {
    eyebrow: string;
    title: string;
    body: string[];
    points: string[];
  };
  features: { title: string; body: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  newsletter: { title: string; body: string; cta: string; placeholder: string };
  /** item.seed -> GPT Image 2 prompt for that card's placeholder image. */
  images: Record<string, string>;
};

const IMG =
  'Square product photograph, soft natural studio light, shallow depth of field, high detail, no text.';

export const SHOWCASE_CONTENT: Record<string, ShowcaseContent> = {
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

  'harbor-and-vine': {
    about: {
      eyebrow: 'Our cellar',
      title: 'Bottles with nothing to hide',
      body: [
        'We pour low-intervention wine from small growers who farm without shortcuts. Nothing added, nothing stripped away, just fermented grapes that taste like the place they came from.',
        'The list changes every week because the good stuff runs out, and we would rather chase something new than keep pouring the safe thing.',
      ],
      points: [
        'Forty-plus bottles, always rotating',
        'A dozen pours by the glass',
        'Snacks built for the wine, not the other way around',
      ],
    },
    features: [
      { title: 'Small growers', body: 'Family plots and first-vintage upstarts, never factory labels.' },
      { title: 'By the glass', body: 'Try three you have never heard of before you commit to a bottle.' },
      { title: 'Corkage nights', body: 'Bring a bottle from your own shelf on Mondays, we do the rest.' },
    ],
    testimonials: [
      { quote: 'The only list in town where I trust every single pour.', name: 'Mara L.', role: 'Regular' },
      { quote: 'Funky, alive, and never pretentious about it.', name: 'Theo K.', role: 'Wine writer' },
    ],
    newsletter: {
      title: 'This week on the list',
      body: 'A short Thursday note with the new arrivals and what is pouring by the glass.',
      cta: 'Send me the list',
      placeholder: 'you@email.com',
    },
    images: {
      hv1: `A glass of cloudy orange skin-contact wine on a marble bar, warm amber backlight, cozy wine bar. ${IMG}`,
      hv2: `A chilled bottle of pet-nat rose with condensation, pale pink, harbourside evening light. ${IMG}`,
      hv3: `A ruby glass of chilled gamay beside a small plate of charcuterie, candlelit bar top. ${IMG}`,
    },
  },

  lumen: {
    about: {
      eyebrow: 'Why Lumen',
      title: 'Three days at the edge of the field',
      body: [
        'Lumen is where designers, engineers, and artists compare notes on what is actually next. Two stages of talks, a day of hands-on labs, and a whole waterfront to keep talking after hours.',
        'No filler keynotes and no sales pitches from the stage. Just people who make things, showing the room how and why.',
      ],
      points: [
        'Sixty speakers across two stages',
        'A full day of small-group labs',
        'One pass, every session and workshop',
      ],
    },
    features: [
      { title: 'Talks', body: 'Sharp, twenty-minute sessions with no wasted slide.' },
      { title: 'Labs', body: 'Build something real in a room of twenty, not two thousand.' },
      { title: 'After hours', body: 'The hallway track, moved to a rooftop over the harbour.' },
    ],
    testimonials: [
      { quote: 'The rare conference where the hallway is as good as the stage.', name: 'Ana R.', role: '2025 speaker' },
      { quote: 'I left with three collaborators and a full notebook.', name: 'Kwame B.', role: '2025 attendee' },
    ],
    newsletter: {
      title: 'Program drops first here',
      body: 'Get speaker announcements and the schedule before the general reveal.',
      cta: 'Notify me',
      placeholder: 'you@email.com',
    },
    images: {
      lum1: `A designer on a dark conference stage lit by vivid magenta and cyan light, bold and cinematic. ${IMG}`,
      lum2: `An attentive audience in a modern auditorium bathed in electric blue stage light. ${IMG}`,
      lum3: `A hands-on design workshop table with laptops and color swatches under bright neon accent lighting. ${IMG}`,
    },
  },

  fathom: {
    about: {
      eyebrow: 'How we work',
      title: 'Open science, from surface to seabed',
      body: [
        'Fathom funds expeditions and publishes every reading the moment it is verified. No paywall, no embargo, just open data anyone can build on.',
        'We are a small nonprofit that partners with research vessels and coastal universities, turning ship time into datasets the whole field can use.',
      ],
      points: [
        'Every reading published under an open license',
        'Grants that put students on the water',
        'Tools and datasets free to reuse',
      ],
    },
    features: [
      { title: 'Fund', body: 'Members and grants put working scientists on real expeditions.' },
      { title: 'Measure', body: 'Standardised sensors from the surface down to a thousand metres.' },
      { title: 'Publish', body: 'Clean, documented datasets, open to anyone the day they land.' },
    ],
    testimonials: [
      { quote: 'Their open data saved my lab a year of fieldwork.', name: 'Dr. Lena S.', role: 'Marine biologist' },
      { quote: 'Rigorous science, and generous with every byte of it.', name: 'Prof. Idris M.', role: 'Oceanography' },
    ],
    newsletter: {
      title: 'Field notes from the deep',
      body: 'A monthly dispatch on new datasets, expeditions, and what we are finding.',
      cta: 'Subscribe',
      placeholder: 'you@email.com',
    },
    images: {
      fat1: `Bioluminescent creatures in the deep ocean twilight zone, teal and gold on near-black water. ${IMG}`,
      fat2: `A vivid coral reef survey with a diver's slate, bright teal water and yellow tape measure. ${IMG}`,
      fat3: `The edge of Arctic sea ice meeting dark cold water, pale mint and deep navy, stark and clean. ${IMG}`,
    },
  },

  'ember-and-oak': {
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

  'petal-and-post': {
    about: {
      eyebrow: 'In the studio',
      title: 'Flowers and paper, made by hand',
      body: [
        'We arrange with whatever is best at the market that morning and press our cards one sheet at a time on a hundred-year-old letterpress. The whole gesture, wrapped and ready to send.',
        'Half florist, half print shop, entirely a two-person studio that answers its own emails.',
      ],
      points: [
        'Market-fresh stems, cut that morning',
        'Letterpress cards printed in-house',
        'Same-day delivery across the city',
      ],
    },
    features: [
      { title: 'Choose', body: 'Pick a bouquet by feeling, we handle the flowers in season.' },
      { title: 'Pair it', body: 'Add a hand-pressed card, blank or with a line from you.' },
      { title: 'Send', body: 'We wrap it and cycle it over, often the very same day.' },
    ],
    testimonials: [
      { quote: 'The card was as beautiful as the flowers. Nobody does both this well.', name: 'Grace H.', role: 'Customer' },
      { quote: 'My go-to for every apology and every celebration.', name: 'Owen P.', role: 'Regular' },
    ],
    newsletter: {
      title: 'What is blooming',
      body: 'A little Friday note on the week ahead: new stems, new cards, seasonal boxes.',
      cta: 'Join the list',
      placeholder: 'you@email.com',
    },
    images: {
      pet1: `A soft blush bouquet of ranunculus and sweet pea wrapped in kraft paper, bright airy studio. ${IMG}`,
      pet2: `A bright coral arrangement of dahlias and cosmos in a ceramic vase, cheerful daylight. ${IMG}`,
      pet3: `A pale pastel bunch of peonies and astilbe beside a letterpress card, gentle morning light. ${IMG}`,
    },
  },

  northwind: {
    about: {
      eyebrow: 'Built to last',
      title: 'Overbuilt on purpose',
      body: [
        'We make fewer things and make them tougher. Every layer is field-tested above the treeline and backed for life, because the best gear is the gear you never have to replace.',
        'When something does wear out, we fix it. Send it in, we patch it and send it back, no receipt required.',
      ],
      points: [
        'Guaranteed for life, repairs included',
        'Recycled and bluesign shells',
        'Tested by the people who design it',
      ],
    },
    features: [
      { title: 'Shells', body: 'Three-layer waterproofs that shrug off a full day of weather.' },
      { title: 'Insulation', body: 'Responsibly sourced down that packs to nothing and holds heat.' },
      { title: 'Repairs', body: 'Free patches for life, so a jacket outlives a decade of trips.' },
    ],
    testimonials: [
      { quote: 'Six winters in and it looks better than my newer jackets.', name: 'Rowan A.', role: 'Alpinist' },
      { quote: 'They repaired a tear for free, ten years after I bought it.', name: 'Kai M.', role: 'Guide' },
    ],
    newsletter: {
      title: 'Field notes',
      body: 'New gear, restocks, and repair tips, about one email a month.',
      cta: 'Sign me up',
      placeholder: 'you@email.com',
    },
    images: {
      nor1: `A three-layer hardshell mountaineering jacket on a rocky alpine ridge, dramatic overcast light. ${IMG}`,
      nor2: `A packable green down jacket compressed beside a summit backdrop, crisp cold daylight. ${IMG}`,
      nor3: `A folded merino base layer on weathered wood, soft even studio light, earthy tones. ${IMG}`,
    },
  },

  honeycomb: {
    about: {
      eyebrow: 'For grown-ups',
      title: 'Screen time you can feel good about',
      body: [
        'Honeycomb teaches reading and early math in five-minute bursts that adapt to your child. Every game gets a little harder as they get a little better, so it always feels like play, never a worksheet.',
        'No ads, no chat, no surprise purchases. Just a friendly little world that grows with them.',
      ],
      points: [
        'Adapts to each child automatically',
        'Five-minute lessons, easy to stop',
        'No ads and nothing to buy inside',
      ],
    },
    features: [
      { title: 'Play', body: 'Bright games that sneak the learning in behind the fun.' },
      { title: 'Adapt', body: 'Every right answer nudges the next question just far enough.' },
      { title: 'Track', body: 'A simple weekly note for parents, no dashboards to decode.' },
    ],
    testimonials: [
      { quote: 'My daughter asks to do her lesson. I still cannot believe it.', name: 'Nadia F.', role: 'Parent of two' },
      { quote: 'Finally an app I do not have to police for junk.', name: 'Sam O.', role: 'Dad' },
    ],
    newsletter: {
      title: 'Little wins, in your inbox',
      body: 'Parenting-friendly tips and new activity packs, roughly monthly.',
      cta: 'Start learning',
      placeholder: 'you@email.com',
    },
    images: {
      hon1: `A cheerful cartoon meadow reading game scene with friendly letters, warm honey-gold palette. ${IMG}`,
      hon2: `A playful counting game with a honeycomb and cartoon bees, bright sunny yellows. ${IMG}`,
      hon3: `A colorful pattern-matching puzzle grove for kids, rounded shapes, warm gold tones. ${IMG}`,
    },
  },

  facet: {
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
      { quote: 'They turned my grandmother’s stone into something I will never take off.', name: 'Eleanor V.', role: 'Bespoke client' },
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

  seabright: {
    about: {
      eyebrow: 'Our promise',
      title: 'Kind to your skin and the water',
      body: [
        'Seabright formulas are short, mineral-rich, and reef-safe. We leave out synthetic fragrance and anything that should not wash into the sea, and make each batch on the coast we are trying to protect.',
        'Fewer ingredients, chosen carefully, so sensitive skin and the shoreline both come out ahead.',
      ],
      points: [
        'Nine ingredients or fewer per formula',
        'No synthetic fragrance, ever',
        'Reef-safe and cruelty-free',
      ],
    },
    features: [
      { title: 'Cleanse', body: 'A gentle sea-kelp gel that never leaves skin tight.' },
      { title: 'Treat', body: 'Mineral serum with the actives and none of the filler.' },
      { title: 'Protect', body: 'A non-nano mineral SPF that the reef can live with.' },
    ],
    testimonials: [
      { quote: 'The first routine my reactive skin has ever actually liked.', name: 'Amara J.', role: 'Customer' },
      { quote: 'Clean in the way that word should have always meant.', name: 'Nils E.', role: 'Customer' },
    ],
    newsletter: {
      title: 'The tide guide',
      body: 'Simple skincare notes and restock alerts, a couple of times a month.',
      cta: 'Join in',
      placeholder: 'you@email.com',
    },
    images: {
      sea1: `A frosted glass bottle of sea-kelp cleansing gel on wet stone, pale seaglass green, coastal light. ${IMG}`,
      sea2: `A dropper of mineral serum over a tide pool background, cool teal and slate tones. ${IMG}`,
      sea3: `A tube of mineral SPF on smooth beach pebbles, soft overcast coastal daylight, muted greens. ${IMG}`,
    },
  },
};
