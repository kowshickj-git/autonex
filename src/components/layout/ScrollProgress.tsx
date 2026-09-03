"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A 3px reading-progress rail pinned to the top of the viewport.
 * Purely decorative, so it is hidden from assistive technology.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-royal-600 via-royal-500 to-copper-500"
    />
  );
}
