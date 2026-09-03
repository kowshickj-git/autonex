"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";

/**
 * Route transition (spec section 43): opacity 0 -> 1 with an 8px lift,
 * keyed on the pathname so every navigation replays it.
 *
 * This is intentionally an ENTER-only transition. Animating the outgoing page
 * in the App Router requires freezing the previous route tree, which delays
 * the new page's paint and hurts navigation speed - a trade the spec
 * explicitly rejects ("Do not use dramatic transitions", "Page navigation
 * remains fast"). A 0.36s fade-in reads as a transition without costing
 * anything.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: EASE.outQuint }}
    >
      {children}
    </motion.div>
  );
}
