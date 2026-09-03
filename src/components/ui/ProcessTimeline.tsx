"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE, VIEWPORT } from "@/lib/motion";
import { processSteps } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";

/**
 * "Our Process" timeline (spec section 29).
 *
 * A rail fills progressively as the section scrolls past, and each step
 * activates when the fill reaches it. The activation is a colour + weight
 * change plus one soft pulse on the marker - deliberately quiet.
 */
export function ProcessTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative">
      {/* Rail - inactive track */}
      <div
        aria-hidden="true"
        className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-3 md:left-1/2 md:-translate-x-1/2"
      />
      {/* Rail - progressive fill */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          style={{ scaleY: fill, originY: 0 }}
          className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-royal-600 to-copper-500 md:left-1/2 md:-translate-x-1/2"
        />
      )}

      {processSteps.map((step, index) => (
        <TimelineStep
          key={step.number}
          index={index}
          progress={fill}
          total={processSteps.length}
          reduced={reduced}
          {...step}
        />
      ))}
    </ol>
  );
}

function TimelineStep({
  number,
  title,
  body,
  index,
  total,
  progress,
  reduced,
}: {
  number: string;
  title: string;
  body: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
  reduced: boolean;
}) {
  // The step lights up once the rail fill passes its own position.
  const threshold = index / total;
  const active = useTransform(progress, (v): number => (v >= threshold ? 1 : 0));
  const markerScale = useTransform(active, [0, 1], [1, 1.12]);
  const idleOpacity = useTransform(active, [0, 1], [1, 0]);

  const alignRight = index % 2 === 1;

  return (
    <li className="relative pb-10 last:pb-0 md:pb-14">
      <div
        className={`flex gap-5 md:items-center md:gap-0 ${
          alignRight ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Content */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE.outQuint }}
          className={`order-2 flex-1 pt-0.5 md:order-none md:pt-0 ${
            alignRight ? "md:pr-14 md:text-right" : "md:pl-14"
          }`}
        >
          <span className="numeric text-xs font-medium text-copper-600">{number}</span>
          <h3 className="mt-1.5 text-lg font-bold text-navy-900">{title}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-7 md:inline-block">
            {body}
          </p>
        </motion.div>

        {/* Marker */}
        <div className="relative z-10 order-1 flex size-10 shrink-0 items-center justify-center md:order-none md:mx-auto">
          <motion.span
            style={reduced ? undefined : { scale: markerScale }}
            className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-slate-3"
          >
            <motion.span
              style={reduced ? undefined : { opacity: active }}
              className="absolute inset-0 rounded-full bg-royal-600 ring-4 ring-royal-100"
            />
            <motion.span
              style={reduced ? undefined : { opacity: active }}
              className="relative numeric text-[11px] font-semibold text-white"
            >
              {number}
            </motion.span>
            <motion.span
              style={reduced ? undefined : { opacity: idleOpacity }}
              className="absolute numeric text-[11px] font-semibold text-slate-5"
            >
              {number}
            </motion.span>
          </motion.span>
        </div>

        {/* Spacer that keeps the two-column rhythm on desktop */}
        <div className="hidden flex-1 md:block" />
      </div>
    </li>
  );
}
