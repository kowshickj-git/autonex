"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useRichMotion } from "@/hooks/useMotionPreference";

type ParallaxProps = {
  children: ReactNode;
  /**
   * Total travel in px across the element's full scroll pass.
   * Kept inside the 20-40px band the spec allows; never aggressive.
   */
  distance?: number;
  /** Negative moves the layer up as you scroll down (foreground feel). */
  direction?: "up" | "down";
  className?: string;
};

/**
 * Subtle scroll parallax. Automatically disabled on touch devices, narrow
 * screens and for visitors who prefer reduced motion - in those cases the
 * children render as a plain, static element.
 */
export function Parallax({
  children,
  distance = 32,
  direction = "up",
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rich = useRichMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const travel = direction === "up" ? -distance : distance;
  const raw = useTransform(scrollYProgress, [0, 1], [-travel / 2, travel / 2]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  if (!rich) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="gpu">
        {children}
      </motion.div>
    </div>
  );
}
