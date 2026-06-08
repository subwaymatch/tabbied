'use client';

import dynamic from 'next/dynamic';

// css-doodle registers a browser custom element on import, so the Hero must
// only ever render on the client. `ssr: false` dynamic imports are allowed
// inside Client Components only, which is why this thin wrapper exists.
const Hero = dynamic(() => import('components/main-page/Hero'), {
  ssr: false,
});

export default function HeroClient() {
  return <Hero />;
}
