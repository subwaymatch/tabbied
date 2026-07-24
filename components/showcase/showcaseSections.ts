// Per-site composition for the React showcase sites: a visual "kit" (how the
// page is dressed) and an ordered list of sections, plus the content for the
// new section types. This is what makes the ten sites feel distinct rather than
// one template, they pick different kits, different section orders, and mix in
// manifestos, alternating illustrated rows, icon grids, FAQs, big quotes, logo
// clouds, and galleries. Existing about/features/testimonials/newsletter/images
// live in showcaseContent.ts; stats live in showcaseData.ts.

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
  /** Alternating illustrated rows. `image` is a GPT Image 2 prompt. */
  altRows?: { eyebrow: string; title: string; body: string; image: string }[];
  /** Icon grid. `icon` is a lucide-react icon name. */
  iconFeatures?: { icon: string; title: string; body: string }[];
  faq?: { q: string; a: string }[];
  bigQuote?: { quote: string; name: string; role: string };
  logos?: string[];
  /** Lookbook of GPT Image 2 prompts. */
  gallery?: string[];
};

const IMG =
  'Soft natural light, shallow depth of field, high detail, no text or logos.';

export const SHOWCASE_SECTIONS: Record<string, SectionContent> = {
  solstice: {
    kit: 'soft',
    sections: ['stats', 'manifesto', 'altRows', 'iconFeatures', 'items', 'bigQuote', 'gallery', 'faq', 'band', 'newsletter'],
    manifesto: {
      kicker: 'Our philosophy',
      text: 'Rest is not a reward for finishing. It is the practice. We build every retreat around that one idea.',
    },
    altRows: [
      { eyebrow: 'Mornings', title: 'Start with the sun, not an alarm', body: 'Practice opens on the deck at first light, then breakfast, then the whole day is yours. No schedule to outrun.', image: `A peaceful sunrise yoga session on a wooden deck facing the ocean, warm dawn glow. ${IMG}` },
      { eyebrow: 'Evenings', title: 'Wind down as the light goes', body: 'A long, slow restorative practice closes each day as the sky turns amber and the tide comes in.', image: `A candle-lit restorative yoga room at dusk with floor cushions, warm amber tones. ${IMG}` },
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

  'harbor-and-vine': {
    kit: 'editorial',
    sections: ['logos', 'about', 'altRows', 'items', 'testimonials', 'gallery', 'faq', 'band', 'newsletter'],
    logos: ['DECANTER', 'PUNCH', 'EATER', 'THE INFATUATION', 'PELLICLE', 'SEVENFIFTY'],
    altRows: [
      { eyebrow: 'The cellar', title: 'We taste everything before it hits the list', body: 'Two of us sit down every Tuesday and taste the week in. If it does not move us, it does not get poured.', image: `A cozy wine bar cellar with rows of natural wine bottles, warm moody light. ${IMG}` },
      { eyebrow: 'The kitchen', title: 'Snacks built for the bottle', body: 'A short menu of things that make the wine sing: cured meats, funky cheese, and whatever the market gave us.', image: `A rustic charcuterie and cheese board on a marble bar with a glass of orange wine. ${IMG}` },
    ],
    gallery: [
      `A candlelit natural wine bar interior at night, warm and intimate. ${IMG}`,
      `A close-up of a hand pouring cloudy pet-nat into a glass. ${IMG}`,
      `A shelf of hand-labeled low-intervention wine bottles. ${IMG}`,
      `A small marble table with two wine glasses and a cheese plate. ${IMG}`,
    ],
    faq: [
      { q: 'Do you take reservations?', a: 'For parties of four or more. Otherwise, pull up a stool.' },
      { q: 'Can I buy bottles to go?', a: 'Yes, everything on the list is available as retail.' },
      { q: 'What is natural wine?', a: 'Low-intervention: organic fruit, wild ferment, little to nothing added.' },
      { q: 'Is there food?', a: 'A short snack menu, always built to match what is open.' },
    ],
  },

  lumen: {
    kit: 'brutal',
    sections: ['logos', 'stats', 'iconFeatures', 'items', 'gallery', 'altRows', 'bigQuote', 'faq', 'band', 'newsletter'],
    logos: ['FIGMA', 'VERCEL', 'LINEAR', 'STRIPE', 'RETOOL', 'RAYCAST'],
    iconFeatures: [
      { icon: 'Presentation', title: 'Two stages', body: 'Sharp twenty-minute talks with no wasted slide.' },
      { icon: 'FlaskConical', title: 'Hands-on labs', body: 'Build something real in a room of twenty.' },
      { icon: 'Users', title: 'The hallway', body: 'The best track, moved to a rooftop over the harbour.' },
      { icon: 'Ticket', title: 'One pass', body: 'Every session and workshop, no upsells.' },
    ],
    gallery: [
      `A packed modern conference auditorium lit in vivid magenta and cyan stage light. ${IMG}`,
      `A speaker gesturing on a dark stage with bold neon graphics behind. ${IMG}`,
      `A hands-on design workshop with laptops under bright neon accent lighting. ${IMG}`,
      `A rooftop networking party at night with a harbour view and colored lights. ${IMG}`,
    ],
    altRows: [
      { eyebrow: 'The city', title: 'Three days on the Lisbon waterfront', body: 'The venue opens onto the river. Sessions by day, the whole industry spilling onto the terrace by night.', image: `The Lisbon waterfront at dusk with warm lights and a modern venue, vivid sky. ${IMG}` },
    ],
    bigQuote: { quote: 'The rare conference where the hallway is as good as the stage.', name: 'Ana R.', role: '2025 speaker' },
    faq: [
      { q: 'When do tickets go on sale?', a: 'Early-bird is live now. Prices step up on the first of each month.' },
      { q: 'Are talks recorded?', a: 'Yes, ticket holders get the full library two weeks after.' },
      { q: 'Is there a student rate?', a: 'A limited block of student passes at half price.' },
      { q: 'Where should I stay?', a: 'We publish a hotel guide walking distance from the venue.' },
    ],
  },

  fathom: {
    kit: 'minimal',
    sections: ['manifesto', 'stats', 'iconFeatures', 'altRows', 'items', 'gallery', 'bigQuote', 'faq', 'band', 'newsletter'],
    manifesto: {
      kicker: 'Why open data',
      text: 'The deep sea belongs to everyone, so the data should too. We publish every reading the day it is verified.',
    },
    iconFeatures: [
      { icon: 'Waves', title: 'Full water column', body: 'Standardised sensors from surface to a thousand metres.' },
      { icon: 'Database', title: 'Open by default', body: 'Every dataset released under a permissive license.' },
      { icon: 'GraduationCap', title: 'Students aboard', body: 'Grants that put early-career scientists on the water.' },
      { icon: 'Globe', title: 'Global reach', body: 'Partners on four oceans and counting.' },
    ],
    altRows: [
      { eyebrow: 'The expedition', title: 'Real ships, real readings', body: 'We buy ship time on working research vessels and instrument them to a shared standard, so the data lines up.', image: `A marine research vessel at sea deploying instruments, cool teal water, overcast. ${IMG}` },
      { eyebrow: 'The data', title: 'Clean, documented, reusable', body: 'Every release ships with methods, calibration, and code, so another lab can build on it the same day.', image: `A scientist reviewing ocean data charts on a laptop in a ship cabin, teal tones. ${IMG}` },
    ],
    gallery: [
      `Bioluminescent creatures in the deep ocean twilight zone, teal and gold on black. ${IMG}`,
      `A coral reef survey with a diver and measuring tape, bright teal water. ${IMG}`,
      `The edge of Arctic sea ice meeting dark cold water, pale mint and navy. ${IMG}`,
      `A CTD rosette sampler being lowered into a calm teal sea. ${IMG}`,
    ],
    bigQuote: { quote: 'Their open data saved my lab a year of fieldwork.', name: 'Dr. Lena S.', role: 'Marine biologist' },
    faq: [
      { q: 'How is Fathom funded?', a: 'Members, grants, and philanthropy. No paywalls, ever.' },
      { q: 'Can I use the data commercially?', a: 'Yes, the license permits commercial reuse with attribution.' },
      { q: 'How do I propose an expedition?', a: 'We open a grant round twice a year, applications on the site.' },
      { q: 'Do you take volunteers?', a: 'Occasionally for shore work. Join the list to hear first.' },
    ],
  },

  'ember-and-oak': {
    kit: 'editorial',
    sections: ['about', 'items', 'altRows', 'bigQuote', 'iconFeatures', 'gallery', 'faq', 'band', 'newsletter'],
    altRows: [
      { eyebrow: 'The fire', title: 'One hearth, all night', body: 'Oak for heat, fruitwood for the finish. The fire is the pilot light of the whole kitchen and the center of the room.', image: `A glowing wood-fired restaurant hearth with flames and embers, deep amber light. ${IMG}` },
      { eyebrow: 'The counter', title: 'The best seat faces the flame', body: 'Eight stools at the pass, close enough to feel the heat and watch every plate leave the fire.', image: `A chef plating at a fire-lit restaurant counter, dark and moody, warm glow. ${IMG}` },
    ],
    bigQuote: { quote: 'You taste the smoke in everything, and you never want it to stop.', name: 'Sofia D.', role: 'Diner' },
    iconFeatures: [
      { icon: 'Flame', title: 'Live fire', body: 'Everything meets the flame, nothing meets a gas ring.' },
      { icon: 'Leaf', title: 'Market-led', body: 'The menu changes with whatever came in this morning.' },
      { icon: 'Utensils', title: 'The counter', body: 'Eight seats at the pass, the best show in the house.' },
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

  'petal-and-post': {
    kit: 'soft',
    sections: ['stats', 'about', 'altRows', 'items', 'iconFeatures', 'gallery', 'testimonials', 'band', 'newsletter'],
    altRows: [
      { eyebrow: 'The flowers', title: 'Cut this morning, in your hands by evening', body: 'We buy at the market at dawn and arrange to order, so nothing sits in a bucket for a week before it reaches you.', image: `A bright florist studio bench with fresh-cut seasonal blooms and kraft paper. ${IMG}` },
      { eyebrow: 'The paper', title: 'Pressed one sheet at a time', body: 'Our cards are letterpressed in-house on a hundred-year-old press, so every one carries a little bite of ink.', image: `A vintage letterpress printing a soft pink greeting card, close-up, warm light. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Flower2', title: 'Seasonal only', body: 'Whatever is best at the market that morning.' },
      { icon: 'Mail', title: 'Hand-pressed', body: 'Letterpress cards printed on our own press.' },
      { icon: 'Truck', title: 'Same-day local', body: 'Cycled across the city, often the same afternoon.' },
    ],
    gallery: [
      `A soft blush bouquet of ranunculus and sweet pea in kraft paper, airy studio. ${IMG}`,
      `A bright coral arrangement of dahlias in a ceramic vase, cheerful daylight. ${IMG}`,
      `A stack of pastel letterpress cards tied with ribbon. ${IMG}`,
      `A florist wrapping a bouquet at a sunlit counter. ${IMG}`,
    ],
  },

  northwind: {
    kit: 'bordered',
    sections: ['logos', 'stats', 'about', 'items', 'altRows', 'iconFeatures', 'gallery', 'bigQuote', 'faq', 'band', 'newsletter'],
    logos: ['OUTSIDE', 'GEAR PATROL', 'ALPINIST', 'BACKPACKER', 'FIELD MAG', 'THE DIRTBAG'],
    altRows: [
      { eyebrow: 'The build', title: 'Overbuilt on purpose', body: 'We spec heavier fabric, bigger zips, and double the stitching. The best gear is the gear you never think about.', image: `A close-up of rugged technical jacket fabric with reinforced seams, moody green light. ${IMG}` },
      { eyebrow: 'The guarantee', title: 'We fix it, for life', body: 'Send in a worn-out piece and we patch it and send it back. No receipt, no expiry, no fine print.', image: `A repair workshop hand-patching a green outdoor jacket, warm workshop light. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'ShieldCheck', title: 'Lifetime guarantee', body: 'Repairs included, for as long as you own it.' },
      { icon: 'Recycle', title: 'Recycled shells', body: 'Bluesign fabrics from post-consumer materials.' },
      { icon: 'Mountain', title: 'Field-tested', body: 'Proven above the treeline before it ships.' },
      { icon: 'Leaf', title: 'Carbon neutral', body: 'Every order, offset at no cost to you.' },
    ],
    gallery: [
      `A three-layer hardshell jacket on a rocky alpine ridge, dramatic overcast light. ${IMG}`,
      `A packed green down jacket beside a summit backdrop, crisp cold daylight. ${IMG}`,
      `A folded merino base layer on weathered wood, earthy green tones. ${IMG}`,
      `A hiker on a misty ridgeline in a green shell, wind and cloud. ${IMG}`,
    ],
    bigQuote: { quote: 'Six winters in and it looks better than my newer jackets.', name: 'Rowan A.', role: 'Alpinist' },
    faq: [
      { q: 'How does the guarantee work?', a: 'Send it in any time. We repair or replace, free.' },
      { q: 'How should I size?', a: 'True to size with room to layer. Full guide on each product.' },
      { q: 'Do you ship internationally?', a: 'Yes, carbon-neutral shipping to most countries.' },
      { q: 'Can I return it?', a: '90 days, worn or unworn, no questions.' },
    ],
  },

  honeycomb: {
    kit: 'soft',
    sections: ['stats', 'manifesto', 'iconFeatures', 'altRows', 'items', 'gallery', 'testimonials', 'faq', 'band', 'newsletter'],
    manifesto: {
      kicker: 'What we believe',
      text: 'The best learning does not feel like learning. It feels like five more minutes of a game they love.',
    },
    iconFeatures: [
      { icon: 'Sparkles', title: 'Adaptive', body: 'Every right answer nudges the next one a little further.' },
      { icon: 'Clock', title: 'Five minutes', body: 'Bite-size lessons that are easy to start and stop.' },
      { icon: 'ShieldCheck', title: 'No ads', body: 'No chat, no ads, nothing to buy inside. Ever.' },
      { icon: 'Baby', title: 'Ages 4 to 9', body: 'Grows with your child, year after year.' },
    ],
    altRows: [
      { eyebrow: 'For kids', title: 'A world that grows with them', body: 'Reading and number games wrapped in a friendly world that gets a little bigger every time they play.', image: `A cheerful cartoon learning-app world with friendly characters, bright honey-gold. ${IMG}` },
      { eyebrow: 'For parents', title: 'A weekly note, not a dashboard', body: 'A short, plain summary of what your child worked on and what clicked, no metrics to decode.', image: `A parent and child smiling at a tablet together on a cozy couch, warm light. ${IMG}` },
    ],
    gallery: [
      `A cartoon meadow reading game with friendly letters, warm honey-gold palette. ${IMG}`,
      `A playful counting game with a honeycomb and cartoon bees, sunny yellows. ${IMG}`,
      `A colorful pattern-matching puzzle grove for kids, rounded shapes. ${IMG}`,
      `A happy cartoon mascot bee waving, bright gold background. ${IMG}`,
    ],
    faq: [
      { q: 'Is it really free to try?', a: 'Two weeks free, cancel in one tap, no card tricks.' },
      { q: 'How much screen time is it?', a: 'Designed for five to fifteen minutes a day.' },
      { q: 'Can siblings share it?', a: 'One plan covers up to four child profiles.' },
      { q: 'Is my child’s data safe?', a: 'No ads, no third-party tracking, COPPA compliant.' },
    ],
  },

  facet: {
    kit: 'minimal',
    sections: ['manifesto', 'about', 'items', 'altRows', 'bigQuote', 'iconFeatures', 'gallery', 'faq', 'band', 'newsletter'],
    manifesto: {
      kicker: 'The idea',
      text: 'One remarkable stone, set by hand, made to outlast every trend and be handed down after that.',
    },
    altRows: [
      { eyebrow: 'The stone', title: 'Traceable to the source', body: 'We buy from cutters we know and can trace every stone to its origin. Beauty should not cost the earth or anyone on it.', image: `A single brilliant gemstone held in tweezers under jeweller's light, jewel tones. ${IMG}` },
      { eyebrow: 'The setting', title: 'Drawn around your stone', body: 'Every setting is designed for its stone, never pulled from a tray, then set by hand in gold or platinum.', image: `A jeweller hand-setting a gemstone into a gold ring at a workbench, elegant macro. ${IMG}` },
    ],
    bigQuote: { quote: 'They turned my grandmother’s stone into something I will never take off.', name: 'Eleanor V.', role: 'Bespoke client' },
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

  seabright: {
    kit: 'soft',
    sections: ['stats', 'altRows', 'about', 'iconFeatures', 'items', 'gallery', 'bigQuote', 'faq', 'band', 'newsletter'],
    altRows: [
      { eyebrow: 'The formula', title: 'Short lists, on purpose', body: 'Nine ingredients or fewer, each one there for a reason. If it does not earn its place, it does not go in.', image: `A minimalist skincare bottle on wet stone with water droplets, pale seaglass green. ${IMG}` },
      { eyebrow: 'The coast', title: 'Made where it belongs', body: 'We batch on the coast we are trying to protect, and leave out anything that should not wash back into the sea.', image: `A calm rocky tide pool on a quiet coast, muted teal and slate tones. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Droplet', title: 'Reef-safe', body: 'Non-nano minerals the reef can live with.' },
      { icon: 'Leaf', title: 'Fragrance-free', body: 'No synthetic fragrance, ever.' },
      { icon: 'ShieldCheck', title: 'For sensitive skin', body: 'Short formulas that calm, not react.' },
      { icon: 'Recycle', title: 'Refillable', body: 'Glass bottles, refill pouches, less waste.' },
    ],
    gallery: [
      `A frosted bottle of cleansing gel on wet stone, pale seaglass green, coastal light. ${IMG}`,
      `A dropper of mineral serum over a tide pool, cool teal and slate. ${IMG}`,
      `A tube of mineral SPF on smooth beach pebbles, soft overcast daylight. ${IMG}`,
      `A flat-lay of the full skincare set on pale linen with a sprig of seaweed. ${IMG}`,
    ],
    bigQuote: { quote: 'The first routine my reactive skin has ever actually liked.', name: 'Amara J.', role: 'Customer' },
    faq: [
      { q: 'Is it good for sensitive skin?', a: 'That is exactly who we make it for. Short, gentle formulas.' },
      { q: 'What does reef-safe mean?', a: 'No oxybenzone or octinoxate, non-nano minerals only.' },
      { q: 'Do you offer refills?', a: 'Yes, refill pouches for every product at a lower price.' },
      { q: 'Are you cruelty-free?', a: 'Always. Never tested on animals, fully vegan.' },
    ],
  },
};
