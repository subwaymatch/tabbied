'use client';

import dynamic from 'next/dynamic';

// css-doodle registers a browser custom element on import, so the animated
// backdrop must only ever render on the client. `ssr: false` dynamic imports
// are allowed inside Client Components only, which is why this thin wrapper
// exists. Only the backdrop is deferred — the hero text/CTA server-renders in
// Hero.tsx, so nothing shifts when the doodle mounts into its absolute slot.
const HeroDoodle = dynamic(() => import('components/main-page/HeroDoodle'), {
  ssr: false,
});

export default function HeroClient() {
  return <HeroDoodle />;
}
