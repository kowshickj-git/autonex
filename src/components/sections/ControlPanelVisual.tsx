"use client";

import { motion } from "framer-motion";
import { Cctv, DoorOpen, Droplets, Lightbulb } from "lucide-react";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";

/**
 * The hero visual: a compact control-panel mockup showing four Autonex
 * systems reporting at once.
 *
 * Built as markup + SVG rather than a photograph, on purpose:
 *   - it is genuinely on-brand instead of generic stock imagery
 *   - it weighs a few KB, so it cannot hurt LCP or shift layout
 *   - it stays sharp on any display and adapts to dark/light surroundings
 */

const TILES = [
  { icon: DoorOpen, label: "Gate", value: "OPEN", tone: "emerald" },
  { icon: Lightbulb, label: "Lighting", value: "3 ZONES", tone: "copper" },
  { icon: Cctv, label: "CCTV", value: "8 CAMS", tone: "royal" },
  { icon: Droplets, label: "RO Plant", value: "42 TDS", tone: "cyan" },
] as const;

const TONE: Record<string, string> = {
  emerald: "text-emerald-300",
  copper: "text-copper-400",
  royal: "text-royal-300",
  cyan: "text-cyan-300",
};

export function ControlPanelVisual() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative">
      {/* Ambient glow behind the panel - the depth comes from light, not shadow */}
      <div
        aria-hidden="true"
        className="tech-bloom absolute -inset-12 -z-10"
        style={{ ["--bloom-y" as string]: "50%" }}
      />

      <div className={reduced ? "" : "float-soft"}>
        <div className="overflow-hidden rounded-2xl bg-navy-900/85 ring-1 ring-white/12 backdrop-blur-sm">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="relative grid size-2 place-items-center">
                <span className="absolute inset-0 rounded-full bg-emerald-400" />
                <span
                  aria-hidden="true"
                  className="ping-ring absolute inset-0 rounded-full bg-emerald-400"
                />
              </span>
              <p className="eyebrow text-[10px] text-white/60">Autonex Control</p>
            </div>
            <p className="numeric text-[10px] text-white/35">SYS / ONLINE</p>
          </div>

          {/* System tiles */}
          <div className="grid grid-cols-2 gap-px bg-white/8">
            {TILES.map((tile, i) => (
              <motion.div
                key={tile.label}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE.outQuint, delay: 0.75 + i * 0.09 }}
                className="bg-navy-900 p-4"
              >
                <div className="flex items-center justify-between">
                  <tile.icon className={`size-4 ${TONE[tile.tone]}`} strokeWidth={1.9} />
                  <span className="numeric text-[9px] text-white/30">0{i + 1}</span>
                </div>
                <p className="mt-3 text-[11px] font-medium text-white/50">{tile.label}</p>
                <p className={`numeric mt-0.5 text-sm font-semibold ${TONE[tile.tone]}`}>
                  {tile.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Live activity trace */}
          <div className="border-t border-white/10 bg-navy-950/60 px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-[9px] text-white/35">Signal Activity</p>
              <p className="numeric text-[9px] text-emerald-300">NOMINAL</p>
            </div>

            <svg viewBox="0 0 300 44" className="mt-2 h-11 w-full" fill="none" aria-hidden="true">
              <motion.path
                d="M0 32 L28 32 L36 14 L44 32 L74 32 L84 22 L94 32 L128 32 L136 8 L146 32 L184 32 L192 24 L200 32 L236 32 L246 16 L256 32 L300 32"
                stroke="#5b93ff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.6, ease: EASE.inOutSoft, delay: 1.1 }}
              />
              <line x1="0" y1="32" x2="300" y2="32" stroke="#ffffff" strokeOpacity="0.08" />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating stat chip - anchored to the panel, lifts with it */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE.outQuint, delay: 1.25 }}
        className="absolute -bottom-5 -left-4 hidden rounded-xl bg-white p-3.5 shadow-e3 ring-1 ring-slate-3 sm:block"
      >
        <p className="eyebrow text-[9px] text-slate-5">Response</p>
        <p className="numeric mt-1 text-lg font-semibold text-navy-900">&lt; 24 hrs</p>
      </motion.div>
    </div>
  );
}
