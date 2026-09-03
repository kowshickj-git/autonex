"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useRef } from "react";
import { EASE, LOAD_DELAY } from "@/lib/motion";
import { company, trustPillars } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";
import { Magnetic } from "@/components/motion/Magnetic";
import { ControlPanelVisual } from "./ControlPanelVisual";
import { HeroBackground } from "./HeroBackground";

/**
 * Home hero.
 *
 * Two motion systems run here and they are kept strictly separate:
 *
 *  1. PAGE LOAD (spec section 2) - a one-shot stagger driven by LOAD_DELAY:
 *     logo 0.1 / nav 0.2 / heading 0.3 / description 0.45 / visual 0.5 /
 *     CTA 0.6 / trust row 0.75. Nothing is gated on it; the HTML is complete
 *     and readable before a single frame runs.
 *
 *  2. SCROLL TRANSFORM (spec section 6) - as you leave the hero the visual
 *     drifts up 50px, scales to 0.92 and fades to 0.6, while the text lifts
 *     slightly. Driven by scroll progress, so it is fully reversible.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const visualY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.6]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.75]);

  const rise = (delay: number, y = 30) => ({
    initial: reduced ? false : ({ opacity: 0, y } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE.outSoft, delay },
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy-950 text-white">
      <HeroBackground />

      <div className="container-page relative pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pb-32 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* ---- Copy ---- */}
          <motion.div
            style={reduced ? undefined : { y: textY, opacity: textOpacity }}
            className="lg:col-span-7"
          >
            <motion.p {...rise(LOAD_DELAY.heading - 0.08, 16)} className="eyebrow flex items-center gap-2.5 text-royal-300">
              <span aria-hidden="true" className="h-px w-6 bg-copper-500" />
              {company.tagline}
            </motion.p>

            {/*
              The headline is three deliberate sentences. Each word gets its
              own rise so the line assembles like a system coming online -
              still one gesture, not three separate animations.
            */}
            <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.05] !text-white sm:text-6xl lg:text-[4.1rem]">
              {["Automation.", "Engineering.", "Innovation."].map((word, i) => (
                <motion.span
                  key={word}
                  {...rise(LOAD_DELAY.heading + i * 0.07)}
                  className="block"
                >
                  {i === 2 ? (
                    <span className="bg-gradient-to-r from-copper-400 to-copper-500 bg-clip-text text-transparent">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              {...rise(LOAD_DELAY.description, 20)}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
            >
              Complete automation, engineering, water treatment, security and technology
              solutions for homes, businesses, institutions and engineering students.
            </motion.p>

            <motion.div
              {...rise(LOAD_DELAY.cta, 15)}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Magnetic strength={4} radius={80} className="inline-block">
                <Link href="/contact" className="btn btn-primary !px-7 !py-4">
                  Get a Quote
                  <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
                </Link>
              </Magnetic>

              <Link href="#solutions" className="btn btn-outline-invert !px-7 !py-4">
                Explore Our Solutions
              </Link>

              <a
                href={`tel:${company.phonesIntl[0]}`}
                className="btn btn-ghost !text-white/70 hover:!bg-white/8 hover:!text-white"
              >
                <Phone className="size-4" strokeWidth={2} />
                <span className="numeric text-sm">{company.phones[0]}</span>
              </a>
            </motion.div>
          </motion.div>

          {/* ---- Visual ---- */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE.outSoft, delay: LOAD_DELAY.visual }}
            style={
              reduced ? undefined : { y: visualY, scale: visualScale, opacity: visualOpacity }
            }
            className="gpu lg:col-span-5"
          >
            <ControlPanelVisual />
          </motion.div>
        </div>

        {/* ---- Trust indicators ---- */}
        <motion.div
          {...rise(LOAD_DELAY.stats, 20)}
          className="mt-16 border-t border-white/10 pt-8 sm:mt-20"
        >
          <p className="eyebrow text-[10px] text-white/35">What we deliver</p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3.5">
            {trustPillars.map((pillar, i) => (
              <motion.li
                key={pillar.label}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASE.outQuint,
                  delay: LOAD_DELAY.stats + 0.06 * i,
                }}
              >
                <Link
                  href={pillar.href}
                  className="group flex items-center gap-2.5 text-sm font-medium text-white/60 transition-colors duration-300 hover:text-white"
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-copper-500 transition-transform duration-300 group-hover:scale-150"
                  />
                  {pillar.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
