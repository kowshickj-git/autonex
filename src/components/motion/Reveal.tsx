"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { EASE, VIEWPORT, VIEWPORT_TALL } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  /** Travel direction. Default "up" (translateY 40 -> 0). */
  direction?: Direction;
  /** Travel distance in px. Default 40 for `up`, 28 for horizontal. */
  distance?: number;
  delay?: number;
  duration?: number;
  /** Fire at 12% instead of 22% - for very tall sections. */
  tall?: boolean;
  className?: string;
  as?: ElementType;
} & Omit<HTMLMotionProps<"div">, "children" | "variants" | "initial" | "whileInView">;

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: -distance };
    case "right":
      return { x: distance };
    default:
      return {};
  }
};

/**
 * The site-wide scroll reveal: opacity 0 -> 1 with a short translate,
 * triggered when ~22% of the element enters the viewport, once only.
 *
 * With reduced motion the element renders in its final state immediately -
 * no fade, no travel, and critically no chance of content staying invisible.
 */
export function Reveal({
  children,
  direction = "up",
  distance,
  delay = 0,
  duration = 0.7,
  tall = false,
  className,
  as = "div",
  ...rest
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const travel = distance ?? (direction === "left" || direction === "right" ? 28 : 40);

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offsetFor(direction, travel) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={tall ? VIEWPORT_TALL : VIEWPORT}
      transition={{ duration, ease: EASE.outQuint, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Parent for a staggered group. Children must be `<RevealItem>`s (or any
 * motion element declaring `hidden` / `visible` variants).
 */
export function RevealGroup({
  children,
  className,
  each = 0.05,
  delay = 0,
  tall = false,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  /** Gap between children in seconds. Default 0.05s. */
  each?: number;
  delay?: number;
  tall?: boolean;
  as?: ElementType;
} & Omit<HTMLMotionProps<"div">, "children" | "variants">) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={tall ? VIEWPORT_TALL : VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: each, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/** A child of `<RevealGroup>`. Cards get a whisper of scale; text does not. */
export function RevealItem({
  children,
  className,
  variant = "card",
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  variant?: "card" | "text";
  as?: ElementType;
} & Omit<HTMLMotionProps<"div">, "children" | "variants">) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const variants =
    variant === "card"
      ? {
          hidden: { opacity: 0, y: 30, scale: 0.98 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.64, ease: EASE.outQuint } },
        }
      : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.outQuint } },
        };

  return (
    <MotionTag className={className} variants={variants} {...rest}>
      {children}
    </MotionTag>
  );
}
