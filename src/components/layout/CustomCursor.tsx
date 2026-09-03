"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useRichMotion } from "@/hooks/useMotionPreference";

/**
 * A minimal two-part cursor: a solid dot that tracks precisely, and a ring
 * that trails behind and expands over interactive elements.
 *
 * Desktop + fine-pointer only. On touch devices and under reduced motion the
 * component renders nothing at all and the native cursor is never hidden.
 */
export function CustomCursor() {
  const rich = useRichMotion();
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<"default" | "button" | "card">("default");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 34, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 34, mass: 0.4 });

  useEffect(() => {
    if (!rich) return;

    document.body.dataset.cursor = "on";

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;

      if (target.closest("a, button, [role='button'], input, textarea, select, label")) {
        setVariant("button");
      } else if (target.closest("[data-cursor='card']")) {
        setVariant("card");
      } else {
        setVariant("default");
      }
    };

    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      delete document.body.dataset.cursor;
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [rich, visible, x, y]);

  if (!rich) return null;

  const ringSize = variant === "card" ? 56 : variant === "button" ? 40 : 26;

  return (
    <div aria-hidden="true" className="no-print pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute rounded-full border border-royal-500/70"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
        animate={{ width: ringSize, height: ringSize }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      />
      <motion.div
        className="absolute size-1.5 rounded-full bg-copper-500"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
