"use client";

import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

/**
 * Thin client wrapper so server components can wrap the single primary CTA
 * in the magnetic effect without becoming client components themselves.
 *
 * Spec section 12 is explicit: this belongs on "Get a Quote" only.
 */
export function MagneticCta({ children }: { children: ReactNode }) {
  return (
    <Magnetic strength={4} radius={80} className="inline-block">
      {children}
    </Magnetic>
  );
}
