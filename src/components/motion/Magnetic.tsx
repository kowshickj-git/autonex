"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useRef, type ReactNode } from "react";
import { useRichMotion } from "@/hooks/useMotionPreference";

type MagneticProps = {
  children: ReactNode;
  /** Maximum displacement in px. Spec caps this at 3-5px. */
  strength?: number;
  /** How far outside the element the pull starts, in px. */
  radius?: number;
  className?: string;
};

/**
 * A very restrained magnetic pull, reserved for the single primary CTA
 * ("Get a Quote"). The element leans toward the cursor by at most a few
 * pixels - enough to feel responsive, never enough to look like a toy.
 *
 * Disabled entirely on touch devices and under reduced motion.
 */
export function Magnetic({ children, strength = 4, radius = 90, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rich = useRichMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.35 });

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      // Normalise against the element's own half-size plus the pull radius,
      // so a wide button does not drift further than a narrow one.
      const reach = Math.max(rect.width, rect.height) / 2 + radius;
      x.set((dx / reach) * strength);
      y.set((dy / reach) * strength);
    },
    [radius, strength, x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (!rich) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
