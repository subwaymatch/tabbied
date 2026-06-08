import { useEffect, useState } from 'react';

/**
 * Small `window.matchMedia` based replacement for the Material UI
 * `useMediaQuery` hook. Returns `false` during SSR / the first client render
 * (matching MUI's default behaviour) and updates once mounted.
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = () => setMatches(mediaQueryList.matches);

    handleChange();
    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
