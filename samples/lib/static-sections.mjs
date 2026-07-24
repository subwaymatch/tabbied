// Per-site composition + new-section content for the static sample sites,
// keyed by directory. generate.mjs merges this onto each site so the ten pages
// pick different visual kits, different section orders, and mix in manifestos,
// alternating illustrated rows, icon grids, FAQs, big quotes, logo clouds, and
// galleries, the same section library the React sites use.

const IMG =
  'Soft natural light, shallow depth of field, high detail, no text or logos.';

export const STATIC_SECTIONS = {
  '01-aurora-sound': {
    kit: 'brutal',
    sections: ['logos', 'iconFeatures', 'items', 'gallery', 'altRows', 'bigQuote', 'faq', 'band', 'newsletter'],
    logos: ['RESIDENT ADVISOR', 'PITCHFORK', 'BOILER ROOM', 'MIXMAG', 'BANDCAMP', 'NTS'],
    iconFeatures: [
      { icon: 'Radio', title: 'Weekly radio', body: 'A two-hour show mining the catalogue and the crates.' },
      { icon: 'Disc3', title: 'Coloured wax', body: 'Short-run vinyl, cut and sleeved by hand.' },
      { icon: 'Headphones', title: 'Mastered twice', body: 'Once for the club, once for the couch.' },
      { icon: 'CalendarDays', title: 'Label nights', body: 'Residencies in three cities and counting.' },
    ],
    gallery: [
      `A glowing liquid light-wave album cover in vivid neon, abstract and futuristic. ${IMG}`,
      `A dark club dancefloor lit by teal and pink lasers, atmospheric. ${IMG}`,
      `A close-up of a colored vinyl record catching neon light. ${IMG}`,
      `A neon-lit DJ booth at night, glowing knobs and faders. ${IMG}`,
    ],
    altRows: [
      { eyebrow: 'The label', title: 'We press what we would play', body: 'Every release is a record we would drop ourselves at 2am. If it does not move the floor, it does not get a catalogue number.', image: `A DJ playing a glowing neon-lit set in a dark club, cinematic. ${IMG}` },
      { eyebrow: 'The artists', title: 'First on every split', body: 'Artists keep the lion’s share and the masters. We are here to press it, push it, and get out of the way.', image: `A music producer at a glowing studio console at night, neon accents. ${IMG}` },
    ],
    bigQuote: { quote: 'The only label whose whole catalogue I buy on sight.', name: 'DJ Verre', role: 'Resident, Basement FM' },
    faq: [
      { q: 'Do you take demos?', a: 'Always. Send a private link, not an attachment, and give us two weeks.' },
      { q: 'Is everything on vinyl?', a: 'Most releases, in short coloured runs, plus lossless digital.' },
      { q: 'Do you book the label nights?', a: 'We do. Join the list for dates and guest slots.' },
      { q: 'Where do you ship?', a: 'Worldwide, from the plant nearest you.' },
    ],
  },

  '02-terra-ceramics': {
    kit: 'soft',
    sections: ['stats', 'about', 'altRows', 'items', 'iconFeatures', 'gallery', 'testimonials', 'faq', 'band', 'newsletter'],
    altRows: [
      { eyebrow: 'On the wheel', title: 'Thrown, trimmed, and glazed by hand', body: 'Every piece is thrown one day and trimmed the next, then dipped by hand in glaze we mix ourselves. The little marks are the maker saying hello.', image: `A potter's hands shaping wet clay on a spinning wheel, warm studio light. ${IMG}` },
      { eyebrow: 'In the kiln', title: 'A slow fire sets the colour', body: 'A long stoneware firing pulls the glaze into its final tone, so the batch shifts gently with the season and the kiln.', image: `Glazed ceramic pieces glowing inside a hot kiln, warm amber light. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Palette', title: 'Mixed in-house', body: 'Glazes blended from local mineral oxides.' },
      { icon: 'Flame', title: 'Stoneware fired', body: 'A slow high firing that makes it last.' },
      { icon: 'ShieldCheck', title: 'Food-safe', body: 'Lead-free, dishwasher-friendly glazes.' },
    ],
    gallery: [
      `A ripple bowl in warm terracotta glaze on linen, artisanal ceramics. ${IMG}`,
      `A row of hand-thrown mugs drying on a studio shelf. ${IMG}`,
      `A potter trimming a bowl on the wheel, close-up, warm light. ${IMG}`,
      `A matte dune-toned vase with a single dried stem. ${IMG}`,
    ],
    faq: [
      { q: 'Are the pieces dishwasher safe?', a: 'Yes, though hand-washing keeps the glaze its best.' },
      { q: 'Why does my piece look slightly different?', a: 'Each is thrown and glazed by hand, so no two match exactly.' },
      { q: 'Do you take custom orders?', a: 'For sets of six or more, with a few weeks’ notice.' },
      { q: 'Do you run classes?', a: 'Weekly beginner wheel classes, spots open each season.' },
    ],
  },

  '03-meridian': {
    kit: 'bordered',
    sections: ['logos', 'stats', 'about', 'iconFeatures', 'items', 'altRows', 'bigQuote', 'faq', 'band', 'newsletter'],
    logos: ['NORTHWIND', 'LUMEN', 'CASCADE', 'OBERON', 'FLEETLY', 'HARBOR'],
    iconFeatures: [
      { icon: 'Code', title: 'One API', body: 'Cards, transfers, and payouts behind a single key.' },
      { icon: 'ShieldCheck', title: 'Compliant', body: 'SOC 2 and PCI handled so you do not have to.' },
      { icon: 'Zap', title: 'Instant payouts', body: 'Move money in forty currencies in seconds.' },
      { icon: 'Layers', title: 'Real ledger', body: 'Double-entry underneath every primitive.' },
    ],
    altRows: [
      { eyebrow: 'The ledger', title: 'Correct by construction', body: 'We start with a double-entry ledger and expose payments on top, so your balances reconcile in real time and an audit is a query.', image: `A clean isometric render of a glowing financial ledger graph, cobalt blue fintech. ${IMG}` },
      { eyebrow: 'The routing', title: 'Every cent takes the best path', body: 'Adaptive routing sends each transaction down the rail most likely to succeed, and retries the smart way when it does not.', image: `An abstract network routing diagram with cyan nodes on deep navy. ${IMG}` },
    ],
    bigQuote: { quote: 'We replaced three vendors and a spreadsheet with one API.', name: 'Priya S.', role: 'CTO, Cascade' },
    faq: [
      { q: 'How long to integrate?', a: 'Sandbox in a minute, production after one review call.' },
      { q: 'What does it cost?', a: 'Usage-based, with volume pricing and no minimums.' },
      { q: 'Is there a real ledger?', a: 'Yes, double-entry, queryable, and correct in real time.' },
      { q: 'Which regions?', a: 'Forty-plus currencies across North America, EU, and APAC.' },
    ],
  },

  '04-verdant': {
    kit: 'soft',
    sections: ['stats', 'about', 'altRows', 'items', 'iconFeatures', 'gallery', 'testimonials', 'band', 'newsletter'],
    altRows: [
      { eyebrow: 'Matched to you', title: 'The right plant for your light', body: 'Tell us which way your windows face and how much sun you get, and we point you to plants that will actually be happy there.', image: `A sunlit windowsill lined with healthy green houseplants, bright and airy. ${IMG}` },
      { eyebrow: 'Delivered thriving', title: 'Potted, watered, ready', body: 'Every plant arrives in peat-free soil, watered and boxed to stand up straight, with a care card in the leaves.', image: `A hand unboxing a potted plant delivered in a cardboard box, fresh green. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Leaf', title: 'Light-matched', body: 'A quick quiz points you to plants that suit your space.' },
      { icon: 'Truck', title: 'Next-day local', body: 'Potted and delivered across the city.' },
      { icon: 'MessagesSquare', title: 'Text a botanist', body: 'Real care advice whenever a leaf looks unsure.' },
      { icon: 'Recycle', title: 'Peat-free', body: 'Kinder soil, sturdier roots.' },
    ],
    gallery: [
      `A ZZ plant with glossy leaves in a matte pot, bright airy interior. ${IMG}`,
      `A tall fiddle-leaf fig in a woven basket by a window. ${IMG}`,
      `A cluster of small potted succulents on a shelf. ${IMG}`,
      `A dramatic bird-of-paradise against a pale wall. ${IMG}`,
    ],
    faq: [
      { q: 'What if my plant struggles?', a: 'Our 30-day thrive promise replaces it, no receipt needed.' },
      { q: 'Do you deliver everywhere?', a: 'Next-day within the city, standard shipping nationwide.' },
      { q: 'Are the plants pet-safe?', a: 'Each listing flags pet-safe options clearly.' },
      { q: 'Can I gift a plant?', a: 'Yes, with a hand-written note and gift wrap.' },
    ],
  },

  '05-sunday-press': {
    kit: 'editorial',
    sections: ['logos', 'about', 'items', 'altRows', 'testimonials', 'gallery', 'faq', 'band', 'newsletter'],
    logos: ['THE VERGE', 'KOTTKE', 'DESIGN MILK', 'IT’S NICE THAT', 'AIGA', 'DENSE DISCOVERY'],
    altRows: [
      { eyebrow: 'The craft', title: 'Long reads, clean type', body: 'We publish one considered issue a month, set in type we actually care about, with nothing between you and the writing.', image: `An elegant editorial magazine spread with bold modernist typography, primary colors. ${IMG}` },
      { eyebrow: 'The model', title: 'Readers, not advertisers', body: 'No ads, no chum, no tracking. Subscriptions keep us independent and the whole archive open forever.', image: `A stack of printed independent magazines on a warm paper desk. ${IMG}` },
    ],
    gallery: [
      `A bold Bauhaus-style poster in red, blue, and yellow geometric shapes. ${IMG}`,
      `A clean flat-lay of a laptop and notebook on a warm desk. ${IMG}`,
      `A geometric paper collage in primary colors. ${IMG}`,
      `An open magazine showing a striking editorial layout. ${IMG}`,
    ],
    faq: [
      { q: 'How often do you publish?', a: 'One full issue a month, plus a short weekly note.' },
      { q: 'Is there a free tier?', a: 'The weekly note is free. Members get the full issue.' },
      { q: 'Do you pay writers?', a: 'Fairly, and we edit generously.' },
      { q: 'Can I read old issues?', a: 'The entire archive is open to everyone.' },
    ],
  },

  '06-zest': {
    kit: 'soft',
    sections: ['stats', 'manifesto', 'iconFeatures', 'items', 'altRows', 'gallery', 'testimonials', 'faq', 'band', 'newsletter'],
    manifesto: { kicker: 'The Zest rule', text: 'If a tired person cannot cook it on a Tuesday, it does not go in the box. Short lists, big flavour, every time.' },
    iconFeatures: [
      { icon: 'Timer', title: '30 minutes', body: 'Most recipes, start to plate, in half an hour.' },
      { icon: 'Flame', title: 'One pan', body: 'Less washing up, more eating.' },
      { icon: 'Salad', title: 'Ten ingredients', body: 'Things you can actually find, nothing obscure.' },
    ],
    altRows: [
      { eyebrow: 'Tested', title: 'Cooked until a beginner can nail it', body: 'Every recipe gets made again and again until the steps are foolproof and the timing is honest.', image: `A bright overhead shot of a colorful fresh weeknight dinner in a bowl. ${IMG}` },
      { eyebrow: 'Fast', title: 'Built for a real weeknight', body: 'Short ingredient lists, short cook times, and a timer baked into every step so nothing burns.', image: `A skillet of vibrant vegetables sizzling on a stovetop, bright and fresh. ${IMG}` },
    ],
    gallery: [
      `A vibrant chili-lime corn bowl, appetizing overhead food photo. ${IMG}`,
      `A skillet of blistered tomato orzo with basil. ${IMG}`,
      `A bowl of glossy sesame crunch noodles with scallions. ${IMG}`,
      `Charred broccoli tacos on a bright plate. ${IMG}`,
    ],
    faq: [
      { q: 'How does the box work?', a: 'A recipe lands in your inbox every weekday afternoon.' },
      { q: 'Can I filter for diet?', a: 'Yes, vegetarian, vegan, and quick filters on everything.' },
      { q: 'Do I need special equipment?', a: 'A pan, a pot, and a knife. That is the whole kit.' },
      { q: 'Is it free?', a: 'The weekday recipe is free. Members get the full archive.' },
    ],
  },

  '07-nocturne': {
    kit: 'minimal',
    sections: ['manifesto', 'about', 'items', 'altRows', 'bigQuote', 'iconFeatures', 'gallery', 'faq', 'band', 'newsletter'],
    manifesto: { kicker: 'The house', text: 'A perfume should change as the night does. We compose in a few notes, held in balance, that unfold for hours.' },
    altRows: [
      { eyebrow: 'The composition', title: 'Built around one accord', body: 'Each scent begins with a single idea and a few materials, layered so it opens, turns, and settles like a piece of music.', image: `A dark still life of a faceted perfume bottle among night flowers, deep violet. ${IMG}` },
      { eyebrow: 'The maturation', title: 'Rested before it is bottled', body: 'Every batch sits for weeks so the materials marry, then it is decanted into refillable glass by hand.', image: `A perfumer's dim atelier with amber bottles and a single lamp, moody violet. ${IMG}` },
    ],
    bigQuote: { quote: 'It smells like a memory I have not made yet.', name: 'Iris N.', role: 'Client' },
    iconFeatures: [
      { icon: 'Moon', title: 'Composed for night', body: 'Deeper materials that speak after dark.' },
      { icon: 'FlaskConical', title: 'Extrait strength', body: 'High concentration, long on the skin.' },
      { icon: 'Recycle', title: 'Refillable glass', body: 'Bring the bottle back, we fill it again.' },
    ],
    gallery: [
      `A faceted perfume bottle glowing amethyst on black velvet, luxurious. ${IMG}`,
      `A dark arrangement of night-blooming flowers, deep purple. ${IMG}`,
      `A minimalist flacon backlit in soft violet haze. ${IMG}`,
      `A close-up of perfume being sprayed, a fine violet mist. ${IMG}`,
    ],
    faq: [
      { q: 'How long does it last?', a: 'Our extraits sit close to the skin for eight hours or more.' },
      { q: 'Can I try before buying?', a: 'The discovery set holds three, redeemable against a bottle.' },
      { q: 'Do you refill?', a: 'Bring any Nocturne bottle back for a refill at a lower price.' },
      { q: 'Are they vegan?', a: 'Fully vegan and never tested on animals.' },
    ],
  },

  '08-shoreline': {
    kit: 'minimal',
    sections: ['stats', 'about', 'items', 'altRows', 'iconFeatures', 'bigQuote', 'gallery', 'faq', 'band', 'newsletter'],
    altRows: [
      { eyebrow: 'The site', title: 'We walk the land first', body: 'Every project starts on the ground at different tides and times of day. The building follows the light and the weather, not the other way round.', image: `An architect walking a windswept coastal site at golden hour, wide and calm. ${IMG}` },
      { eyebrow: 'The materials', title: 'Chosen to grey gracefully', body: 'Timber, stone, and lime that weather into the coast instead of fighting it, and ask little of the years.', image: `A close-up of weathered timber cladding on a coastal house, soft grey light. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Wind', title: 'Built for weather', body: 'Low, sheltering forms that hold the wind.' },
      { icon: 'Sun', title: 'Planned for light', body: 'Rooms placed where the light lands.' },
      { icon: 'Compass', title: 'Site-led', body: 'Every design begins on the land.' },
      { icon: 'Ruler', title: 'Low-energy', body: 'Fabric-first, quiet on running costs.' },
    ],
    bigQuote: { quote: 'They gave us a house that feels like the coast itself.', name: 'The Aldous family', role: 'Salt House' },
    gallery: [
      `A low-slung timber coastal house against a grey sky, calm architecture. ${IMG}`,
      `A minimalist dune pavilion with glass facing the sea. ${IMG}`,
      `A stone harbourside building at dusk with deep window reveals. ${IMG}`,
      `An interior with a large window framing the ocean, soft light. ${IMG}`,
    ],
    faq: [
      { q: 'Where do you work?', a: 'Coastlines, mostly. We travel for the right project.' },
      { q: 'Do you do renovations?', a: 'Yes, alongside new-builds and civic work.' },
      { q: 'How do fees work?', a: 'A percentage of build cost, staged by RIBA work stage.' },
      { q: 'How long does a house take?', a: 'Typically eighteen months from first sketch to keys.' },
    ],
  },

  '09-pixel-playhouse': {
    kit: 'brutal',
    sections: ['stats', 'iconFeatures', 'items', 'gallery', 'altRows', 'bigQuote', 'faq', 'band', 'newsletter'],
    stats: [{ n: '3', l: 'Friends' }, { n: '4', l: 'Games shipped' }, { n: '0', l: 'Crunch weeks' }],
    iconFeatures: [
      { icon: 'Gamepad2', title: 'Cozy by design', body: 'Short sessions that respect your evening.' },
      { icon: 'Heart', title: 'Demo first', body: 'Every game ships a demo before it asks for a cent.' },
      { icon: 'Music', title: 'Free soundtracks', body: 'Every score up on Bandcamp, name your price.' },
      { icon: 'Sparkles', title: 'Built in the open', body: 'Devlogs every Friday, no exceptions.' },
    ],
    gallery: [
      `A cozy pixel-art town at dusk with glowing streetlights, warm vaporwave pinks. ${IMG}`,
      `A neon rooftop delivery scene in pixel art, night city with pink and blue glow. ${IMG}`,
      `A colorful pixel-art coral reef aquarium scene, pastel vaporwave. ${IMG}`,
      `A retro falling-blocks arcade game screen in vivid neon. ${IMG}`,
    ],
    altRows: [
      { eyebrow: 'The studio', title: 'Three friends, no publisher', body: 'We make the games we want to come home to. Warm, weird, and never in a hurry, funded by the players who love them.', image: `A cozy indie game studio room with pixel-art posters and warm lamps, night. ${IMG}` },
      { eyebrow: 'The vibe', title: 'No crunch, just vibes', body: 'We ship when it is ready and rest when it is not. Turns out you can make good games and sleep too.', image: `A relaxed desk with a handheld console and a warm mug at night, cozy glow. ${IMG}` },
    ],
    bigQuote: { quote: 'The comfort food of video games. I adore it.', name: 'pixelfox', role: 'Player' },
    faq: [
      { q: 'What platforms?', a: 'PC and Mac now, Switch for the next one.' },
      { q: 'Is there a demo?', a: 'Always, on the store page before you buy.' },
      { q: 'Where is the soundtrack?', a: 'On Bandcamp, name your price, all of it to the composer.' },
      { q: 'Can I follow development?', a: 'Devlogs land every Friday, join the list.' },
    ],
  },

  '10-roast-and-co': {
    kit: 'bordered',
    sections: ['stats', 'about', 'altRows', 'items', 'iconFeatures', 'gallery', 'testimonials', 'faq', 'band', 'newsletter'],
    altRows: [
      { eyebrow: 'At the source', title: 'Bought from farms we visit', body: 'We buy small lots direct from growers we know by name, and pay above the fair-trade floor because a good coffee starts long before the roast.', image: `A coffee farmer holding fresh red coffee cherries on a highland farm, warm light. ${IMG}` },
      { eyebrow: 'At the roastery', title: 'Roasted the day before it ships', body: 'Small batches, dialled in for each lot, roasted the day before dispatch so it reaches your kitchen at its peak.', image: `Coffee beans tumbling in a drum roaster with warm glow, cozy roastery. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Coffee', title: 'Roasted to order', body: 'Every bag leaves within 24 hours.' },
      { icon: 'MapPin', title: 'Traceable lots', body: 'Farm, altitude, and process on every bag.' },
      { icon: 'Truck', title: 'Direct trade', body: 'Long relationships, prices above the floor.' },
    ],
    gallery: [
      `A bag of single-origin beans spilling onto burlap, warm espresso tones. ${IMG}`,
      `A pour-over setup with rich crema in soft window light. ${IMG}`,
      `Glossy roasted coffee beans piled close-up with warm highlights. ${IMG}`,
      `A barista weighing beans on a scale at a wooden counter. ${IMG}`,
    ],
    faq: [
      { q: 'How fresh is it?', a: 'Roasted to order and shipped within a day of roasting.' },
      { q: 'How does a subscription work?', a: 'Pick a cadence and a roast style, pause any time.' },
      { q: 'Whole bean or ground?', a: 'Either, ground to your brew method if you like.' },
      { q: 'Do you do wholesale?', a: 'Yes, for cafes and offices, get in touch.' },
    ],
  },
};
