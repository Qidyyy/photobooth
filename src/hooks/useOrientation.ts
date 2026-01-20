'use client';

import { useState, useEffect } from 'react';

export function useOrientation() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    // Initial check
    const checkOrientation = () => {
      // Check if window is defined (client-side)
      if (typeof window !== 'undefined') {
        const mql = window.matchMedia("(orientation: portrait)");
        setIsPortrait(mql.matches);
      }
    };

    checkOrientation();

    // Listen for changes
    const mql = window.matchMedia("(orientation: portrait)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches);
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return { isPortrait };
}
