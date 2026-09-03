import type { Transition, Variants } from "framer-motion";

/**
 * AUTONEX SOLUTIONS - Global animation language.
 *
 * Every animated surface on the site pulls its timing from this file so the
 * whole product moves with one rhythm. The values mirror the CSS custom
 * properties in `globals.css` (--ease-*, --duration-*) - change them in both
 * places or not at all.
 *
 * Philosophy: motion exists to explain, orient and reassure. Nothing here
 * bounces, spins or flashes.
 */

/* ------------------------------------------------------------------ *
 * Easing - cubic-beziers only. Linear is reserved for continuous
 * background loops (grid drift, signal dashes), never for entrances.
 * ------------------------------------------------------------------ */
export const EASE = {
  /** Default entrance. Fast start, long settle - reads as "engineered". */
  outQuint: [0.22, 1, 0.36, 1],
  /** Even softer landing, for large sections and hero elements. */
  outSoft: [0.16, 1, 0.3, 1],
  /** Symmetrical - continuous float, accordions, two-way transitions. */
  inOutSoft: [0.65, 0, 0.35, 1],
  /** Material-style precision curve for small UI state changes. */
  precise: [0.4, 0, 0.2, 1],
} as const;

/* ------------------------------------------------------------------ *
 * Duration (seconds)
 * micro   0.24  hover, focus, icon nudges
 * control 0.32  buttons, accordions, chips, toggles
 * base    0.64  default element / card reveal
 * section 0.96  hero choreography and large section reveals
 * ------------------------------------------------------------------ */
export const DURATION = {
  micro: 0.24,
  control: 0.32,
  base: 0.64,
  reveal: 0.7,
  section: 0.96,
  slow: 1.2,
} as const;

/** Shared transition presets. */
export const TRANSITION = {
  micro: { duration: DURATION.micro, ease: EASE.precise },
  control: { duration: DURATION.control, ease: EASE.outQuint },
  base: { duration: DURATION.base, ease: EASE.outQuint },
  reveal: { duration: DURATION.reveal, ease: EASE.outQuint },
  section: { duration: DURATION.section, ease: EASE.outSoft },
} satisfies Record<string, Transition>;

/**
 * Viewport trigger used by every scroll reveal.
 * `amount: 0.22` fires when ~22% of the element is visible (spec: 20-25%).
 * `once: true` - content never re-animates on scroll-back, which would be
 * distracting and would fight the browser's scroll restoration.
 */
export const VIEWPORT = { once: true, amount: 0.22 } as const;

/** Looser trigger for tall sections that would otherwise never hit 22%. */
export const VIEWPORT_TALL = { once: true, amount: 0.12 } as const;

/* ------------------------------------------------------------------ *
 * Core variants
 * ------------------------------------------------------------------ */

/** The workhorse: opacity 0 -> 1, translateY 40px -> 0. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: TRANSITION.reveal },
};

/** Shorter travel, for text that sits directly under a heading. */
export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: TRANSITION.base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITION.base },
};

/** Cards: a whisper of scale keeps the grid feeling physical. */
export const cardIn: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: TRANSITION.base },
};

/** Hero / feature imagery: 0.96 -> 1. */
export const visualIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: TRANSITION.section },
};

/** Major images only - a horizontal wipe. */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0.6 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.8, ease: EASE.outSoft },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: TRANSITION.reveal },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: TRANSITION.reveal },
};

/* ------------------------------------------------------------------ *
 * Stagger
 * ------------------------------------------------------------------ */

/**
 * Parent container for staggered children.
 * Default 0.05s between children matches the card cadence in the spec
 * (card 1 @ 0.05s, card 2 @ 0.10s, card 3 @ 0.15s ...).
 */
export const stagger = (each = 0.05, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: each, delayChildren: delay },
  },
});

/** Pre-built container for service / gallery grids. */
export const staggerGrid = stagger(0.05);

/** Slower cadence for short lists where each item should register. */
export const staggerList = stagger(0.08);

/* ------------------------------------------------------------------ *
 * Page-load choreography (spec section 2)
 * Background -> logo -> nav -> heading -> description -> CTA -> visual.
 * Content is never gated behind these; they are pure decoration on top of
 * already-rendered, already-readable HTML.
 * ------------------------------------------------------------------ */
export const LOAD_DELAY = {
  logo: 0.1,
  nav: 0.2,
  heading: 0.3,
  description: 0.45,
  visual: 0.5,
  cta: 0.6,
  stats: 0.75,
} as const;

/** Hero entrance builder: `heroIn(LOAD_DELAY.heading, 30)`. */
export const heroIn = (delay: number, y = 30): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.section, ease: EASE.outSoft, delay },
  },
});

/* ------------------------------------------------------------------ *
 * Route transitions (spec section 43) - subtle, never dramatic.
 * ------------------------------------------------------------------ */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE.outQuint },
  },
  exit: { opacity: 0, transition: { duration: 0.25, ease: EASE.precise } },
};

/* ------------------------------------------------------------------ *
 * Micro-interaction presets for `whileHover` / `whileTap`
 * ------------------------------------------------------------------ */
export const hoverLift = { y: -6, transition: TRANSITION.control };
export const hoverNudge = { y: -2, transition: TRANSITION.micro };
export const tapPress = { scale: 0.97, transition: { duration: 0.12 } };

/**
 * Accordion body. Height is animated here deliberately - it is the one case
 * where transform cannot express the change. Kept to a single element with
 * no siblings reflowing beside it.
 */
export const accordionBody: Variants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: 0.3, ease: EASE.precise } },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.36, ease: EASE.outQuint },
      opacity: { duration: 0.26, delay: 0.06 },
    },
  },
};

/** Lightbox (spec section 24). */
export const lightboxBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EASE.precise } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: EASE.precise } },
};

export const lightboxPanel: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE.outQuint } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.22, ease: EASE.precise } },
};

/** Modal / dialog (admin upload, confirmations). */
export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.32, ease: EASE.outQuint } },
  exit: { opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.2, ease: EASE.precise } },
};

/** Toast notifications. */
export const toastIn: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.34, ease: EASE.outQuint } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.2 } },
};

/**
 * Progressive line-draw for technical diagrams (gate, RO, IoT, PCB ...).
 * Applied to an SVG path via `pathLength`.
 */
export const drawLine = (delay = 0, duration = 0.9): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration, ease: EASE.inOutSoft, delay },
      opacity: { duration: 0.2, delay },
    },
  },
});

/** A diagram node that switches from idle to active. */
export const nodeActivate = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE.outQuint, delay },
  },
});
