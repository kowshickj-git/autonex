"use client";

import { useEffect, useRef, useState } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";

type CountUpProps = {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/**
 * Counts from 0 to `value` when the element scrolls into view - once.
 *
 * The final value is rendered into the DOM as a `<noscript>`-safe fallback via
 * `aria-label`, so assistive tech and search engines read the real figure
 * rather than a mid-animation number.
 */
export function CountUp({
  value,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: CountUpProps) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>({ amount: 0.4 });
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    if (reduced) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const total = duration * 1000;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / total, 1);
      setDisplay(value * easeOutQuint(progress));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [inView, value, duration, reduced]);

  const formatted = display.toFixed(decimals);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {formatted}
        {suffix}
      </span>
    </span>
  );
}
