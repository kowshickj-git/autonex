"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";

/**
 * Hero backdrop (spec section 5).
 *
 * Four quiet layers, none above ~12% opacity:
 *   1. a technical grid that drifts one cell every 44s
 *   2. two thin circuit traces with a travelling signal
 *   3. a small, fixed set of drifting particles (10 - deliberately few)
 *   4. one soft royal bloom for depth
 *
 * Particle positions are a hard-coded table rather than Math.random() so the
 * server and client render identical markup.
 */
const PARTICLES = [
  { x: 8, y: 22, d: 13, delay: 0 },
  { x: 19, y: 68, d: 17, delay: 2.4 },
  { x: 31, y: 12, d: 15, delay: 1.1 },
  { x: 44, y: 79, d: 19, delay: 3.6 },
  { x: 57, y: 31, d: 14, delay: 0.8 },
  { x: 66, y: 61, d: 18, delay: 4.2 },
  { x: 78, y: 18, d: 16, delay: 2.0 },
  { x: 86, y: 74, d: 20, delay: 1.6 },
  { x: 93, y: 41, d: 15, delay: 3.1 },
  { x: 72, y: 88, d: 17, delay: 0.4 },
];

export function HeroBackground() {
  const reduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1 - drifting technical grid */}
      <div className="tech-grid absolute inset-0" />

      {/* 4 - atmospheric bloom */}
      <div
        className="tech-bloom absolute inset-0"
        style={{ ["--bloom-x" as string]: "68%", ["--bloom-y" as string]: "34%" }}
      />

      {/* 2 - circuit traces */}
      <svg
        className="absolute inset-0 size-full opacity-[0.14]"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          d="M-20 148H210l52 52h268l40-40h372l60 60h480"
          stroke="#5b93ff"
          strokeWidth="1"
          opacity="0.55"
        />
        <path
          d="M-20 664H286l58-58h300l44 44h298l52-52h422"
          stroke="#5b93ff"
          strokeWidth="1"
          opacity="0.4"
        />
        {!reduced && (
          <>
            <path
              d="M-20 148H210l52 52h268l40-40h372l60 60h480"
              stroke="#8fb5ff"
              strokeWidth="1.6"
              strokeDasharray="70 1400"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1470"
                to="0"
                dur="11s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M-20 664H286l58-58h300l44 44h298l52-52h422"
              stroke="#ff9036"
              strokeWidth="1.6"
              strokeDasharray="54 1400"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1454"
                to="0"
                dur="15s"
                begin="3s"
                repeatCount="indefinite"
              />
            </path>
          </>
        )}
        {/* Junction nodes */}
        {[
          [210, 148],
          [530, 200],
          [570, 160],
          [942, 160],
          [286, 664],
          [644, 606],
          [688, 650],
          [986, 650],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#5b93ff" opacity="0.7" />
        ))}
      </svg>

      {/* 3 - particles */}
      {!reduced &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute size-[3px] rounded-full bg-royal-300/40"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ y: [0, -22, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{
              duration: p.d,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Fade into the section beneath */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-navy-950" />
    </div>
  );
}
