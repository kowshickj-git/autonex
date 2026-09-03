"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";
import { company } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";

const SESSION_KEY = "autonex:intro-shown";
const HOLD_MS = 1100;

/**
 * Engineering-style intro (spec section 44).
 *
 * Rules it follows deliberately:
 *  - It is an overlay, not a gate. The page beneath is already rendered,
 *    hydrated and interactive; nothing waits on this.
 *  - It runs for ~1.1s, once per browser session.
 *  - Under reduced motion it never appears at all.
 */
export function IntroScreen() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (reduced) return;

    let seen = true;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Private mode / storage blocked - just skip the intro.
      seen = true;
    }
    if (seen) return;

    setShow(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* non-fatal */
    }

    const id = setTimeout(() => setShow(false), HOLD_MS);
    return () => clearTimeout(id);
  }, [reduced]);

  // Nothing is rendered during SSR, so the overlay can never trap a
  // no-JS visitor or delay first paint.
  if (!ready) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[95] grid place-items-center bg-navy-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE.precise } }}
        >
          <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-40" />

          <div className="relative px-6 text-center">
            <motion.p
              className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE.outQuint }}
            >
              {company.name.toUpperCase()}
            </motion.p>

            <motion.p
              className="eyebrow mt-3 text-royal-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.16 }}
            >
              {company.tagline}
            </motion.p>

            <div className="mx-auto mt-7 h-px w-56 overflow-hidden bg-white/12 sm:w-72">
              <motion.div
                className="h-full bg-copper-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ originX: 0 }}
                transition={{ duration: HOLD_MS / 1000, ease: EASE.inOutSoft }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
