"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";
import { company, whatsappLink } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";

/** Inline SVG so the WhatsApp glyph needs no icon-font or remote asset. */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.85 9.85 0 0 0 4.7 1.2h.01c5.44 0 9.87-4.43 9.87-9.87 0-2.64-1.03-5.12-2.9-6.98A9.8 9.8 0 0 0 12.04 2Zm0 17.98h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.15 8.15 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.86 5.8 2.41a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.19-8.2 8.19Z" />
    </svg>
  );
}

/**
 * Bottom-right action stack: WhatsApp (always) + Back to top (after scroll).
 * They share one column so they can never overlap on small screens.
 */
export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [nudge, setNudge] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* A single soft pulse every ~7s. Not a bounce, not a loop-in-place. */
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setNudge(true);
      setTimeout(() => setNudge(false), 1200);
    }, 7000);
    return () => clearInterval(id);
  }, [reduced]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="no-print fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.3, ease: EASE.outQuint }}
            whileHover={reduced ? undefined : { y: -3 }}
            whileTap={{ scale: 0.94 }}
            className="grid size-11 place-items-center rounded-full bg-navy-900 text-white shadow-e2 ring-1 ring-white/10 transition-colors hover:bg-navy-800"
          >
            <ArrowUp className="size-4.5" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappLink(`Hello ${company.name}, I would like to enquire about your solutions.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        initial={{ opacity: 0, scale: 0.8, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE.outQuint, delay: 1.1 }}
        whileHover={reduced ? undefined : { scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group relative grid size-13 place-items-center rounded-full bg-[#25D366] text-white shadow-e2"
      >
        {/* Occasional attention ring - one expansion, then silence. */}
        <AnimatePresence>
          {nudge && (
            <motion.span
              key="ring"
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[#25D366]"
              initial={{ opacity: 0.45, scale: 1 }}
              animate={{ opacity: 0, scale: 1.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: EASE.outQuint }}
            />
          )}
        </AnimatePresence>

        <WhatsAppGlyph className="relative size-7" />

        {/* Tooltip - desktop hover only */}
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-navy-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-e2 transition-opacity duration-200 group-hover:opacity-100 lg:block">
          Chat with us
        </span>
      </motion.a>
    </div>
  );
}
