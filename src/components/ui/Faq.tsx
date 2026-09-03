"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { EASE } from "@/lib/motion";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export type FaqItem = { q: string; a: string };

/**
 * Accordion (spec section 35).
 *
 * Multiple items may be open at once: these are reference answers people
 * compare against each other, and force-closing the previous one makes that
 * harder. The toggle rotates 45deg turning a plus into a cross, which reads
 * more precisely than a flipping chevron.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const baseId = useId();

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <RevealGroup each={0.05} className="divide-y divide-slate-3 rounded-2xl bg-white ring-1 ring-slate-3">
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <RevealItem key={item.q} variant="text">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-start gap-4 px-5 py-5 text-left transition-colors duration-200 hover:bg-slate-1 sm:px-6"
              >
                <span className="flex-1 text-[15px] font-semibold leading-snug text-navy-900 sm:text-base">
                  {item.q}
                </span>
                <span
                  className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "rotate-45 bg-royal-600 text-white" : "bg-slate-2 text-slate-6"
                  }`}
                >
                  <Plus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.34, ease: EASE.outQuint },
                    opacity: { duration: 0.24, ease: EASE.precise },
                  }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pr-14 text-sm leading-relaxed text-slate-7 sm:px-6 sm:pb-6">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
