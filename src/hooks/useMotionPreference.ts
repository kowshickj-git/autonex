"use client";

import { useEffect, useState } from "react";

/**
 * Media-query hook that is SSR-safe and never causes a hydration mismatch:
 * it returns `false` on the server and on the very first client render, then
 * settles to the real value in an effect.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on a device with a precise pointer - i.e. real hover exists. */
export function useHasHover(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** True at >= 1024px. Used to drop parallax and cursor effects on mobile. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/**
 * The one flag most components need: should we run the expensive, continuous
 * or pointer-driven effects at all?
 *
 * Combines reduced-motion preference with device capability so that parallax,
 * particles, magnetic buttons and the custom cursor are all disabled together
 * on touch devices and for motion-sensitive visitors.
 */
export function useRichMotion(): boolean {
  const reduced = usePrefersReducedMotion();
  const desktop = useIsDesktop();
  const hover = useHasHover();
  return !reduced && desktop && hover;
}
