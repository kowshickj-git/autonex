"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, VIEWPORT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";

type RevealImageProps = {
  children: ReactNode;
  /** Wipe direction. Default: left to right. */
  from?: "left" | "right" | "bottom";
  delay?: number;
  className?: string;
};

const hidden = {
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  bottom: "inset(100% 0 0 0)",
};

/**
 * Clip-path wipe for major imagery only (spec section 31).
 *
 * Deliberately NOT applied to every image - overusing this turns a premium
 * reveal into a gimmick. Reserve it for hero visuals and the lead image of a
 * section. Under reduced motion the image simply appears.
 */
export function RevealImage({
  children,
  from = "left",
  delay = 0,
  className,
}: RevealImageProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: hidden[from], opacity: 0.55 }}
      whileInView={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE.outSoft, delay }}
    >
      {children}
    </motion.div>
  );
}
