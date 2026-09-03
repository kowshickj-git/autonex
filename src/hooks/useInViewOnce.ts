"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fraction of the element that must be visible. Default 0.22 (spec: 20-25%). */
  amount?: number;
  /** Extra margin around the root box, e.g. "0px 0px -10% 0px". */
  rootMargin?: string;
  /** Keep firing on re-entry instead of latching to true. */
  repeat?: boolean;
};

/**
 * Plain Intersection Observer trigger.
 *
 * Framer Motion's `whileInView` covers most reveals, but the technical
 * diagrams (gate, RO, IoT, robotics ...) need to start a multi-step timeline
 * exactly once, when the section is genuinely on screen. This hook is that
 * trigger, and it degrades safely: if IntersectionObserver is unavailable the
 * element is treated as visible immediately so content is never hidden.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>({
  amount = 0.22,
  rootMargin = "0px",
  repeat = false,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setInView(false);
        }
      },
      { threshold: amount, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount, rootMargin, repeat]);

  return { ref, inView };
}
