import type { LucideIcon } from "lucide-react";
import type { Solution } from "@/lib/services";

/**
 * Per-service icon gesture (spec section 10).
 *
 * Each solution gets a movement that means something: the gear turns, the
 * barrier lifts, the droplet falls, the alarm pulses, the lens refocuses.
 * All of them are 3-6px or 6deg - readable, never playful.
 *
 * Implemented as CSS `group-hover` transforms rather than JS so they cost
 * nothing at runtime and are switched off wholesale by the reduced-motion
 * block in globals.css.
 */
const GESTURE: Record<Solution["motion"], string> = {
  rotate: "group-hover:rotate-6",
  slide: "group-hover:translate-x-1",
  lift: "group-hover:-translate-y-1",
  drop: "group-hover:translate-y-1",
  wave: "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
  pulse: "group-hover:scale-110",
  lens: "group-hover:scale-105 group-hover:-rotate-3",
  glow: "group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_rgba(242,118,15,0.55)]",
  scale: "group-hover:scale-110",
};

type Props = {
  icon: LucideIcon;
  gesture?: Solution["motion"];
  tone?: "royal" | "copper" | "invert";
  size?: "sm" | "md" | "lg";
};

const TONE = {
  royal: "bg-royal-50 text-royal-700 group-hover:bg-royal-100",
  copper: "bg-copper-50 text-copper-600 group-hover:bg-copper-100",
  invert: "bg-white/8 text-royal-300 group-hover:bg-white/14",
};

const SIZE = {
  sm: { tile: "size-10 rounded-xl", icon: "size-5" },
  md: { tile: "size-13 rounded-2xl", icon: "size-6" },
  lg: { tile: "size-16 rounded-2xl", icon: "size-7" },
};

export function ServiceIcon({
  icon: Icon,
  gesture = "scale",
  tone = "royal",
  size = "md",
}: Props) {
  const s = SIZE[size];
  return (
    <span
      className={`icon-tile grid shrink-0 place-items-center ${s.tile} ${TONE[tone]} transition-colors duration-300`}
    >
      <Icon
        strokeWidth={1.75}
        className={`${s.icon} transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${GESTURE[gesture]}`}
      />
    </span>
  );
}
